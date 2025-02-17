
import { useState, useCallback } from "react";
import { Book, MessageSquare, Newspaper, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import InputSection from "./text-analysis/InputSection";
import ResultsSection from "./text-analysis/ResultsSection";
import SideBySideView from "./text-analysis/SideBySideView";
import SmartSynonyms from "./text-analysis/SmartSynonyms";
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
  const [isSideBySide, setIsSideBySide] = useState(false);
  const [selectedWord, setSelectedWord] = useState("");
  const [synonyms, setSynonyms] = useState<string[]>([]);
  const { toast } = useToast();

  const getWordCount = (text: string) => text.trim().split(/\s+/).length;
  const getCharCount = (text: string) => text.length;

  const handleWordClick = useCallback((word: string) => {
    setSelectedWord(word);
    setSynonyms([
      "alternative1",
      "alternative2",
      "alternative3",
      "alternative4",
    ]);
  }, []);

  const handleSynonymSelect = useCallback((synonym: string) => {
    const newText = text.replace(selectedWord, synonym);
    setText(newText);
    setSelectedWord("");
    setSynonyms([]);
    
    toast({
      title: "Word replaced",
      description: `Changed "${selectedWord}" to "${synonym}"`,
      className: "bg-green-50 border-green-200",
    });
  }, [text, selectedWord, toast]);

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
    a.download = "humanized-text.txt";
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
      });
      return;
    }
    setText(newText);

    // Update AI score in real-time
    if (newText.trim()) {
      const aiScore = getAIScore(newText);
      setResults(prev => ({ ...prev, aiScore }));
    }
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

    const wordCount = getWordCount(text);
    if (wordCount > MAX_WORDS) {
      toast({
        title: "Text too long",
        description: `Please limit your text to ${MAX_WORDS} words. Current: ${wordCount} words.`,
        variant: "destructive",
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
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-end gap-4">
        <button
          onClick={() => setIsSideBySide(!isSideBySide)}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          {isSideBySide ? "Switch to Tab View" : "Switch to Side-by-Side"}
        </button>
      </div>

      {isSideBySide && results.humanizedText ? (
        <SideBySideView
          originalText={text}
          humanizedText={results.humanizedText}
          changedWords={[]} // This would be populated with actual changed words
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InputSection
            text={text}
            wordCount={getWordCount(text)}
            charCount={getCharCount(text)}
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
      )}

      {selectedWord && (
        <SmartSynonyms
          word={selectedWord}
          synonyms={synonyms}
          onSelect={handleSynonymSelect}
        />
      )}
    </div>
  );
};

export default TextAnalysisSection;
