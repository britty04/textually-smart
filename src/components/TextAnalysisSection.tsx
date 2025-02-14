
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, RefreshCcw, Wand2, Upload, Download, Sparkles, Book, MessageSquare, Newspaper } from "lucide-react";
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

const TextAnalysisSection = () => {
  const [text, setText] = useState("");
  const [results, setResults] = useState<AnalysisResults>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState("casual");
  const [improvementScore, setImprovementScore] = useState(0);
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

      // Calculate improvement score
      const improvementScore = Math.min(100, (1 - aiScore) * 100);
      setImprovementScore(improvementScore);

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
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card className="p-6 bg-white/80 backdrop-blur shadow-lg border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Input Text</h3>
            <div className="flex gap-2">
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
          </div>

          <Textarea
            placeholder="Enter or paste your text here..."
            className="min-h-[400px] text-base mb-4"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          {/* Writing Style Selection */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            {writingStyles.map(({ icon: Icon, label, description }) => (
              <TooltipProvider key={label}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={selectedStyle === label.toLowerCase() ? "default" : "outline"}
                      className="w-full"
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
        </Card>

        {/* Results Section */}
        <Card className="p-6 bg-white/80 backdrop-blur shadow-lg border border-gray-100">
          <Tabs defaultValue="detect" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="detect">AI Detection</TabsTrigger>
              <TabsTrigger value="humanize">Humanize</TabsTrigger>
              <TabsTrigger value="plagiarism">Plagiarism</TabsTrigger>
              <TabsTrigger value="rephrase">Rephrase</TabsTrigger>
            </TabsList>

            {/* Progress Section */}
            {results.aiScore !== undefined && (
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
              <HumanizedTextCard text={results.humanizedText} />
            </TabsContent>

            <TabsContent value="plagiarism" className="mt-6">
              <PlagiarismCard results={results.plagiarismResults} />
            </TabsContent>

            <TabsContent value="rephrase" className="mt-6">
              <RephrasedVersionsCard versions={results.rephrasedVersions} />
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
          </ul>
        </Card>
      )}
    </div>
  );
};

export default TextAnalysisSection;
