
import { useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, RefreshCcw, Wand2, Upload, Download, Copy, Shield, Users, Sparkles, Book, MessageSquare, Newspaper } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import AIScoreCard from "./analysis/AIScoreCard";
import HumanizedTextCard from "./analysis/HumanizedTextCard";
import PlagiarismCard from "./analysis/PlagiarismCard";
import RephrasedVersionsCard from "./analysis/RephrasedVersionsCard";
import { getAIScore, processTextWithGemini, findPlagiarismPhrases } from "@/utils/analysis";
import type { AnalysisResults } from "@/types/analysis";

const writingStyles = [
  { icon: Book, label: "Academic", description: "Scholarly and research-oriented" },
  { icon: MessageSquare, label: "Casual", description: "Conversational and friendly" },
  { icon: Newspaper, label: "Professional", description: "Business and formal" },
  { icon: Sparkles, label: "Creative", description: "Engaging and expressive" },
];

const MAX_WORDS = 500;

const TextAnalysisSection = () => {
  const [text, setText] = useState("");
  const [results, setResults] = useState<AnalysisResults>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState("casual");
  const [improvementScore, setImprovementScore] = useState(0);
  const [activeTab, setActiveTab] = useState("detect");
  const [userCount] = useState(Math.floor(Math.random() * 5000) + 8000); // Simulated user count
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const words = content.trim().split(/\s+/);
        if (words.length > MAX_WORDS) {
          toast({
            title: "Text too long",
            description: `Please limit your text to ${MAX_WORDS} words. Current: ${words.length} words.`,
            variant: "destructive",
          });
          return;
        }
        setText(content);
      };
      reader.readAsText(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const words = content.trim().split(/\s+/);
        if (words.length > MAX_WORDS) {
          toast({
            title: "Text too long",
            description: `Please limit your text to ${MAX_WORDS} words. Current: ${words.length} words.`,
            variant: "destructive",
          });
          return;
        }
        setText(content);
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

  const handleCopy = async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast({
        title: "Copied!",
        description: "Text copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).length;
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    const wordCount = getWordCount(newText);
    if (wordCount > MAX_WORDS) {
      toast({
        title: "Word limit exceeded",
        description: `Please limit your text to ${MAX_WORDS} words. Current: ${wordCount} words.`,
        variant: "destructive",
      });
      return;
    }
    setText(newText);
  };

  const analyzeText = async () => {
    if (!text.trim()) {
      toast({
        title: "Empty Text",
        description: "Please enter some text to analyze.",
        variant: "destructive",
        className: "rounded-lg border-2 border-red-200",
      });
      return;
    }

    const wordCount = getWordCount(text);
    if (wordCount > MAX_WORDS) {
      toast({
        title: "Text too long",
        description: `Please limit your text to ${MAX_WORDS} words. Current: ${wordCount} words.`,
        variant: "destructive",
        className: "rounded-lg border-2 border-red-200",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      let newResults = { ...results };

      switch (activeTab) {
        case "detect":
          newResults.aiScore = getAIScore(text);
          setImprovementScore(Math.min(100, (1 - newResults.aiScore) * 100));
          break;
        case "humanize":
          const prompt = `Please humanize this text to sound more natural and ${selectedStyle}, while maintaining the core message: "${text}"`;
          newResults.humanizedText = await processTextWithGemini(prompt, 'humanize') as string;
          break;
        case "plagiarism":
          newResults.plagiarismResults = findPlagiarismPhrases(text);
          break;
        case "rephrase":
          const rephrasePrompt = `Please rephrase this text in a ${selectedStyle} style, maintaining its core meaning: "${text}"`;
          const rephrased = await processTextWithGemini(rephrasePrompt, 'rephrase') as string;
          newResults.rephrasedVersions = [rephrased];
          break;
      }

      setResults(newResults);
      toast({
        title: "Success!",
        description: `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} completed successfully!`,
        className: "rounded-lg border-2 border-green-200 bg-green-50",
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Error",
        description: "An error occurred during analysis. Please try again.",
        variant: "destructive",
        className: "rounded-lg border-2 border-red-200",
      });
    }
    setIsAnalyzing(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Shield className="w-4 h-4 text-green-500" />
            <span>We don't store any user data!</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-blue-500" />
            <span>{userCount.toLocaleString()} texts checked today</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card className="p-6 bg-white/80 backdrop-blur shadow-lg border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">Input Text</h3>
              <p className="text-sm text-muted-foreground">
                Max {MAX_WORDS} words ({getWordCount(text)} used)
              </p>
            </div>
            <div className="flex gap-2">
              <label className="cursor-pointer">
                <input
                  ref={fileInputRef}
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
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleCopy(text)}
                disabled={!text}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div 
            className="border-2 border-dashed border-gray-200 rounded-lg p-4 mb-4 hover:border-gray-300 transition-colors bg-white"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <Textarea
              placeholder="Enter or paste your text here, or drag & drop a file..."
              className="min-h-[400px] text-base border-none p-0 focus-visible:ring-0 bg-transparent placeholder:text-gray-400"
              value={text}
              onChange={handleTextChange}
            />
          </div>

          {/* Writing Style Selection */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            {writingStyles.map(({ icon: Icon, label, description }) => (
              <TooltipProvider key={label}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={selectedStyle === label.toLowerCase() ? "default" : "outline"}
                      className={`w-full transition-all duration-200 ${
                        selectedStyle === label.toLowerCase() 
                          ? "bg-blue-500 text-white hover:bg-blue-600"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedStyle(label.toLowerCase())}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {label}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>

          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => setText("")}
              className="gap-2 hover:bg-gray-50"
            >
              <RefreshCcw className="w-4 h-4" />
              Clear
            </Button>
            <Button 
              onClick={analyzeText} 
              className="gap-2 bg-blue-500 hover:bg-blue-600 text-white"
              disabled={isAnalyzing}
            >
              <Wand2 className="w-4 h-4" />
              {isAnalyzing ? (
                <>
                  <span className="animate-pulse">Analyzing...</span>
                  <span className="animate-spin ml-2">⚡</span>
                </>
              ) : (
                `Analyze ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`
              )}
            </Button>
          </div>
        </Card>

        {/* Results Section */}
        <Card className="p-6 bg-white/80 backdrop-blur shadow-lg border border-gray-100">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="detect">AI Detection</TabsTrigger>
              <TabsTrigger value="humanize">Humanize</TabsTrigger>
              <TabsTrigger value="plagiarism">Plagiarism</TabsTrigger>
              <TabsTrigger value="rephrase">Rephrase</TabsTrigger>
            </TabsList>

            {/* Progress Section */}
            {results.aiScore !== undefined && activeTab === "detect" && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Improvement Score</span>
                  <span className="text-sm font-medium">{improvementScore.toFixed(1)}%</span>
                </div>
                <Progress value={improvementScore} className="h-2" />
              </div>
            )}

            <TabsContent value="detect" className="mt-6">
              <AIScoreCard score={results.aiScore} />
            </TabsContent>

            <TabsContent value="humanize" className="mt-6">
              <HumanizedTextCard 
                text={results.humanizedText} 
                onCopy={handleCopy}
              />
            </TabsContent>

            <TabsContent value="plagiarism" className="mt-6">
              <PlagiarismCard results={results.plagiarismResults} />
            </TabsContent>

            <TabsContent value="rephrase" className="mt-6">
              <RephrasedVersionsCard 
                versions={results.rephrasedVersions}
                onCopy={handleCopy}
              />
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      {/* Writing Tips */}
      {results.aiScore !== undefined && (
        <Card className="mt-6 p-4 bg-blue-50 border-blue-100">
          <h4 className="font-medium mb-2">Writing Tips</h4>
          <ul className="list-disc list-inside text-sm space-y-2">
            <li>Try varying your sentence structure for more natural flow</li>
            <li>Use more personal pronouns to sound more conversational</li>
            <li>Include transition words to improve readability</li>
            <li>Avoid repetitive phrases and sentence structures</li>
            <li>Use active voice for more engaging content</li>
          </ul>
        </Card>
      )}
    </div>
  );
};

export default TextAnalysisSection;
