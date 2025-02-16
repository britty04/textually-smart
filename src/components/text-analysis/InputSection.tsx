
import { useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Download, Copy, RefreshCcw, Wand2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { WritingStyle } from "@/types/analysis";

interface InputSectionProps {
  text: string;
  wordCount: number;
  maxWords: number;
  selectedStyle: string;
  isAnalyzing: boolean;
  activeTab: string;
  writingStyles: WritingStyle[];
  onTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onStyleSelect: (style: string) => void;
  onClear: () => void;
  onAnalyze: () => void;
  onCopy: (text: string) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  onDownload: () => void;
}

const InputSection = ({
  text,
  wordCount,
  maxWords,
  selectedStyle,
  isAnalyzing,
  activeTab,
  writingStyles,
  onTextChange,
  onStyleSelect,
  onClear,
  onAnalyze,
  onCopy,
  onFileUpload,
  onDrop,
  onDownload,
}: InputSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Card className="p-6 bg-white/80 backdrop-blur shadow-lg border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Input Text</h3>
          <p className="text-sm text-muted-foreground">
            Max {maxWords} words ({wordCount} used)
          </p>
        </div>
        <div className="flex gap-2">
          <label className="cursor-pointer">
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt"
              onChange={onFileUpload}
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
            onClick={onDownload}
            disabled={!text}
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onCopy(text)}
            disabled={!text}
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div 
        className="border-2 border-dashed border-gray-200 rounded-lg p-4 mb-4 hover:border-gray-300 transition-colors bg-white"
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
      >
        <Textarea
          placeholder="Enter or paste your text here, or drag & drop a file..."
          className="min-h-[400px] text-base border-none p-0 focus-visible:ring-0 bg-transparent placeholder:text-gray-400"
          value={text}
          onChange={onTextChange}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        {writingStyles.map(({ icon: Icon, label, description, color }) => (
          <TooltipProvider key={label}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={selectedStyle === label.toLowerCase() ? "default" : "outline"}
                  className={`w-full transition-all duration-200 ${
                    selectedStyle === label.toLowerCase() 
                      ? `bg-${color}-500 text-white hover:bg-${color}-600`
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => onStyleSelect(label.toLowerCase())}
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
          onClick={onClear}
          className="gap-2 hover:bg-gray-50"
        >
          <RefreshCcw className="w-4 h-4" />
          Clear
        </Button>
        <Button 
          onClick={onAnalyze} 
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
  );
};

export default InputSection;
