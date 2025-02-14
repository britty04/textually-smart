
import { useState } from "react";
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
import AIScoreCard from "./analysis/AIScoreCard";
import HumanizedTextCard from "./analysis/HumanizedTextCard";
import PlagiarismCard from "./analysis/PlagiarismCard";
import RephrasedVersionsCard from "./analysis/RephrasedVersionsCard";
import { getAIScore, processTextWithGemini, findPlagiarismPhrases } from "@/utils/analysis";
import type { AnalysisResults } from "@/types/analysis";

const TextAnalysisSection = () => {
  const [text, setText] = useState("");
  const [results, setResults] = useState<AnalysisResults>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
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
      <div className="flex justify-between items-center mb-4">
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
  );
};

export default TextAnalysisSection;
