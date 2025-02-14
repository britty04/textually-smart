
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, RefreshCcw, Wand2, Upload, Download } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import nlp from 'compromise';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/integrations/supabase/client";

const TextAnalysisSection = () => {
  const [text, setText] = useState("");
  const [geminiKey, setGeminiKey] = useState<string>("");
  const [results, setResults] = useState<{
    aiScore?: number;
    humanizedText?: string;
    plagiarismResults?: Array<{ phrase: string; matches: number }>;
    rephrasedVersions?: string[];
  }>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchGeminiKey = async () => {
      const { data, error } = await supabase
        .from('secrets')
        .select('value')
        .eq('name', 'GEMINI_API_KEY')
        .single();
      
      if (error) {
        console.error('Error fetching Gemini API key:', error);
        toast({
          title: "Configuration Error",
          description: "Could not load API configuration. Some features might not work.",
          variant: "destructive",
        });
        return;
      }
      
      if (data && data.value) {
        setGeminiKey(data.value);
      }
    };

    fetchGeminiKey();
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setText(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "analysis-result.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getAIScore = (text: string): number => {
    const doc = nlp(text);
    
    const sentenceLength = doc.sentences().length;
    const wordCount = doc.terms().length;
    const avgWordsPerSentence = wordCount / sentenceLength;
    
    const formalWords = doc.match('(therefore|hence|thus|consequently|furthermore|moreover)').length;
    const passiveVoice = doc.match('#Noun (was|were|has been|have been) #Verb').length;
    
    const uniqueWords = new Set(doc.terms().out('array')).size;
    const repetitionScore = 1 - (uniqueWords / wordCount);
    
    const complexityScore = Math.min((avgWordsPerSentence / 20), 1);
    const formalityScore = Math.min((formalWords / sentenceLength) * 2, 1);
    const passiveScore = Math.min((passiveVoice / sentenceLength) * 2, 1);
    
    const finalScore = (complexityScore + formalityScore + passiveScore + repetitionScore) / 4;
    return Math.min(Math.max(finalScore, 0), 1);
  };

  const processTextWithGemini = async (text: string, mode: 'humanize' | 'rephrase'): Promise<string | string[]> => {
    if (!geminiKey) {
      throw new Error('Gemini API key not configured');
    }

    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    
    const prompts = {
      humanize: `Make this text sound more human and natural, while keeping the same meaning:
      "${text}"
      
      Rules:
      1. Keep the same information and meaning
      2. Make it more conversational
      3. Vary sentence structure
      4. Use simpler words when possible
      5. Keep it professional but friendly`,
      
      rephrase: `Provide 3 different versions of this text:
      1. Casual and friendly tone
      2. Professional and formal tone
      3. Academic and technical tone
      
      Original text: "${text}"`
    };

    const result = await model.generateContent(prompts[mode]);
    const response = await result.response;
    return mode === 'rephrase' ? response.text().split('\n\n') : response.text();
  };

  const findPlagiarismPhrases = (text: string) => {
    const phrases = [];
    const doc = nlp(text);
    const sentences = doc.sentences().out('array');
    
    for (let sentence of sentences) {
      const words = sentence.split(' ');
      if (words.length >= 5) {
        const keyPhrase = words.slice(0, 5).join(' ');
        const commonality = doc.match(keyPhrase).length;
        phrases.push({
          phrase: keyPhrase,
          matches: commonality * 100
        });
      }
    }
    
    return phrases.sort((a, b) => b.matches - a.matches).slice(0, 5);
  };

  const analyzeText = async () => {
    if (!text.trim()) {
      toast({
        title: "Empty Text",
        description: "Please enter some text to analyze.",
        variant: "destructive",
      });
      return;
    }

    if (!geminiKey) {
      toast({
        title: "API Key Missing",
        description: "Gemini API key is not configured. Some features might not work.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const aiScore = getAIScore(text);
      const [humanizedText, rephrasedVersions] = await Promise.all([
        processTextWithGemini(text, 'humanize') as Promise<string>,
        processTextWithGemini(text, 'rephrase') as Promise<string[]>
      ]);
      const plagiarismResults = findPlagiarismPhrases(text);

      setResults({
        aiScore,
        humanizedText,
        plagiarismResults,
        rephrasedVersions,
      });

      toast({
        title: "Analysis Complete",
        description: "Text has been successfully analyzed!",
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Error",
        description: "An error occurred during analysis. Please try again.",
        variant: "destructive",
      });
    }
    setIsAnalyzing(false);
  };

  return (
    <Card className="w-full max-w-4xl p-6 bg-white/80 backdrop-blur shadow-lg border border-gray-100">
      <div className="flex justify-end mb-4">
        <label className="cursor-pointer">
          <input
            type="file"
            accept=".txt"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button variant="ghost" size="icon" asChild>
            <span>
              <Upload className="w-4 h-4" />
            </span>
          </Button>
        </label>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDownload}
          disabled={!text}
        >
          <Download className="w-4 h-4" />
        </Button>
      </div>

      <Tabs defaultValue="detect" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="detect">AI Detection</TabsTrigger>
          <TabsTrigger value="humanize">Humanize</TabsTrigger>
          <TabsTrigger value="plagiarism">Plagiarism</TabsTrigger>
          <TabsTrigger value="rephrase">Rephrase</TabsTrigger>
        </TabsList>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Enter your text</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <AlertCircle className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Paste your text here for analysis</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <Textarea
            placeholder="Enter or paste your text here..."
            className="min-h-[200px] text-base"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => setText("")}
              className="gap-2"
            >
              <RefreshCcw className="w-4 h-4" />
              Clear
            </Button>
            <Button 
              onClick={analyzeText} 
              className="gap-2"
              disabled={isAnalyzing}
            >
              <Wand2 className="w-4 h-4" />
              {isAnalyzing ? "Analyzing..." : "Analyze"}
            </Button>
          </div>
        </div>

        <TabsContent value="detect" className="mt-6">
          <Card className="p-4">
            <h4 className="font-medium mb-2">AI Detection Results</h4>
            {results.aiScore !== undefined ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>AI Probability:</span>
                  <span className={`font-bold ${
                    results.aiScore > 0.7 ? 'text-red-500' : 
                    results.aiScore > 0.3 ? 'text-yellow-500' : 
                    'text-green-500'
                  }`}>
                    {(results.aiScore * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 rounded-full h-2 transition-all duration-500"
                    style={{ width: `${results.aiScore * 100}%` }}
                  />
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Results will appear here after analysis.
              </p>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="humanize" className="mt-6">
          <Card className="p-4">
            <h4 className="font-medium mb-2">Humanized Text</h4>
            {results.humanizedText ? (
              <p className="text-sm whitespace-pre-wrap">{results.humanizedText}</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Humanized version will appear here.
              </p>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="plagiarism" className="mt-6">
          <Card className="p-4">
            <h4 className="font-medium mb-2">Plagiarism Check Results</h4>
            {results.plagiarismResults?.length ? (
              <div className="space-y-2">
                <p className="text-sm mb-2">Potential matches found:</p>
                <ul className="list-disc list-inside text-sm">
                  {results.plagiarismResults.map((result, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <span>{result.phrase}</span>
                      <span className={`ml-2 ${result.matches > 1000 ? 'text-red-500' : 'text-yellow-500'}`}>
                        {result.matches.toLocaleString()} matches
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Plagiarism analysis will appear here.
              </p>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="rephrase" className="mt-6">
          <Card className="p-4">
            <h4 className="font-medium mb-2">Rephrased Versions</h4>
            {results.rephrasedVersions?.length ? (
              <div className="space-y-4">
                {results.rephrasedVersions.map((version, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="font-medium text-xs text-gray-500 mb-1">
                      {index === 0 ? 'Casual Tone' : index === 1 ? 'Professional Tone' : 'Academic Tone'}
                    </div>
                    <p className="text-sm">{version}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Rephrased versions will appear here.
              </p>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default TextAnalysisSection;
