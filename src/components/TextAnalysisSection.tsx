import { useState } from "react";
import { Book, MessageSquare, Newspaper, Sparkles, Shield, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import InputSection from "./text-analysis/InputSection";
import ResultsSection from "./text-analysis/ResultsSection";
import WritingTips from "./text-analysis/WritingTips";
import TrustBadges from "./layout/TrustBadges";
import { getAIScore, processTextWithGemini, findPlagiarismPhrases } from "@/utils/analysis";
import type { AnalysisResults, WritingStyle } from "@/types/analysis";

const MAX_WORDS = 500;

const writingStyles: WritingStyle[] = [
  { icon: Book, label: "Academic", description: "Scholarly and research-oriented writing with formal language", color: "blue" },
  { icon: MessageSquare, label: "Casual", description: "Friendly and conversational tone for everyday content", color: "green" },
  { icon: Newspaper, label: "Professional", description: "Business-appropriate content with clear, formal tone", color: "purple" },
  { icon: Sparkles, label: "Creative", description: "Engaging and expressive writing with vivid language", color: "pink" },
];

const TextAnalysisSection = () => {
  const [text, setText] = useState("");
  const [results, setResults] = useState<AnalysisResults>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState("casual");
  const [improvementScore, setImprovementScore] = useState(0);
  const [activeTab, setActiveTab] = useState("detect");
  const [userCount] = useState(Math.floor(Math.random() * 5000) + 8000);
  const { toast } = useToast();

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).length;
  };

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

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    const wordCount = getWordCount(newText);
    if (wordCount > MAX_WORDS) {
      toast({
        title: "Word limit exceeded",
        description: `Please limit your text to ${MAX_WORDS} words. Current: ${wordCount} words.`,
        variant: "destructive",
        className: "rounded-lg border-2 border-red-200 bg-white/90 backdrop-blur shadow-lg",
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
        className: "rounded-lg border-2 border-red-200 bg-white/90 backdrop-blur shadow-lg",
      });
      return;
    }

    const wordCount = getWordCount(text);
    if (wordCount > MAX_WORDS) {
      toast({
        title: "Text too long",
        description: `Please limit your text to ${MAX_WORDS} words. Current: ${wordCount} words.`,
        variant: "destructive",
        className: "rounded-lg border-2 border-red-200 bg-white/90 backdrop-blur shadow-lg",
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
          newResults.humanizedText = await processTextWithGemini(text, 'humanize', selectedStyle) as string;
          break;
        case "plagiarism":
          newResults.plagiarismResults = findPlagiarismPhrases(text);
          break;
        case "rephrase":
          newResults.rephrasedVersions = await processTextWithGemini(text, 'rephrase', selectedStyle) as string[];
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
      <TrustBadges userCount={userCount} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InputSection
          text={text}
          wordCount={getWordCount(text)}
          maxWords={MAX_WORDS}
          selectedStyle={selectedStyle}
          isAnalyzing={isAnalyzing}
          activeTab={activeTab}
          writingStyles={writingStyles}
          onTextChange={handleTextChange}
          onStyleSelect={setSelectedStyle}
          onClear={() => setText("")}
          onAnalyze={analyzeText}
          onCopy={handleCopy}
          onFileUpload={handleFileUpload}
          onDrop={handleDrop}
          onDownload={handleDownload}
        />

        <ResultsSection
          activeTab={activeTab}
          results={results}
          improvementScore={improvementScore}
          onTabChange={setActiveTab}
          onCopy={handleCopy}
        />
      </div>

      {results.aiScore !== undefined && <WritingTips />}
    </div>
  );
};

export default TextAnalysisSection;
