
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, RefreshCcw, Wand2, Upload, Download, Sun, Moon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { pipeline } from "@huggingface/transformers";

const TextAnalysisSection = () => {
  const [text, setText] = useState("");
  const [results, setResults] = useState<{
    aiScore?: number;
    humanizedText?: string;
    plagiarismResults?: string[];
    rephrasedVersions?: string[];
  }>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { toast } = useToast();

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

  // Simple text analysis functions
  const getAIScore = (text: string): number => {
    // Basic heuristics for AI detection
    const patterns = [
      /\b(therefore|thus|hence|consequently)\b/gi,
      /\b(furthermore|moreover|additionally)\b/gi,
      /\b(however|nevertheless|nonetheless)\b/gi,
      /\b(in conclusion|to summarize|in summary)\b/gi
    ];
    
    const matches = patterns.reduce((count, pattern) => {
      const matches = text.match(pattern);
      return count + (matches ? matches.length : 0);
    }, 0);
    
    // Normalize score between 0 and 1
    return Math.min(matches / 5, 1);
  };

  const humanizeText = (text: string): string => {
    const sentences = text.split(/[.!?]+/).filter(Boolean);
    return sentences.map(sentence => {
      // Simple transformations
      return sentence
        .trim()
        .replace(/\b(utilize)\b/g, 'use')
        .replace(/\b(implement)\b/g, 'use')
        .replace(/\b(facilitate)\b/g, 'help')
        .replace(/\b(leverage)\b/g, 'use');
    }).join('. ') + '.';
  };

  const findPlagiarismPhrases = (text: string): string[] => {
    const words = text.split(/\s+/);
    const phrases: string[] = [];
    
    // Create 3-word phrases
    for (let i = 0; i < words.length - 2; i++) {
      phrases.push(words.slice(i, i + 3).join(' '));
    }
    
    return phrases.slice(0, 5); // Return top 5 phrases
  };

  const rephraseText = (text: string): string[] => {
    const sentences = text.split(/[.!?]+/).filter(Boolean);
    return sentences.map(sentence => {
      // Simple rephrasing by moving words around
      const words = sentence.trim().split(/\s+/);
      if (words.length > 3) {
        // Move the first word to the end
        words.push(words.shift() as string);
      }
      return words.join(' ');
    });
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

    setIsAnalyzing(true);
    try {
      // AI Detection
      const aiScore = getAIScore(text);

      // Text Humanization
      const humanizedText = humanizeText(text);

      // Plagiarism Check
      const plagiarismResults = findPlagiarismPhrases(text);

      // Rephrasing
      const rephrasedVersions = rephraseText(text);

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
    <Card className={`w-full max-w-4xl p-6 glass card-shadow ${isDarkMode ? 'bg-gray-900 text-white' : ''}`}>
      <div className="flex justify-end mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="mr-2"
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
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
                <p className="text-sm mb-2">Key phrases checked:</p>
                <ul className="list-disc list-inside text-sm">
                  {results.plagiarismResults.slice(0, 5).map((phrase, index) => (
                    <li key={index}>{phrase}</li>
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
            <h4 className="font-medium mb-2">Rephrased Text</h4>
            {results.rephrasedVersions?.length ? (
              <div className="space-y-4">
                {results.rephrasedVersions.map((version, index) => (
                  <div key={index} className="p-2 bg-gray-50 rounded">
                    <p className="text-sm">{version}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Rephrased version will appear here.
              </p>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default TextAnalysisSection;
