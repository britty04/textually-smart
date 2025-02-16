
import { useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Download, Copy, RefreshCcw, Wand2 } from "lucide-react";
import StyleSelector from "../layout/StyleSelector";
import { motion, AnimatePresence } from "framer-motion";
import type { WritingStyle } from "@/types/analysis";

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
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleActualDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    onDrop(e);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 bg-white/90 backdrop-blur shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
        <div className="flex justify-between items-center mb-4">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Input Text
            </h3>
            <p className="text-sm text-muted-foreground">
              Max {maxWords} words ({wordCount} used)
            </p>
          </div>
          <div className="flex gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <label className="cursor-pointer">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.docx"
                  onChange={onFileUpload}
                  className="hidden"
                />
                <Button variant="ghost" size="icon" className="hover:bg-blue-50">
                  <Upload className="w-4 h-4 text-blue-500" />
                </Button>
              </label>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={onDownload}
                disabled={!text}
                className="hover:bg-green-50"
              >
                <Download className="w-4 h-4 text-green-500" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onCopy(text)}
                disabled={!text}
                className="hover:bg-purple-50"
              >
                <Copy className="w-4 h-4 text-purple-500" />
              </Button>
            </motion.div>
          </div>
        </div>

        <motion.div 
          className={`border-2 border-dashed rounded-lg p-4 mb-6 transition-all duration-300 ${
            isDragging 
              ? "border-blue-400 bg-blue-50/50" 
              : "border-gray-200 hover:border-gray-300 bg-white"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleActualDrop}
          animate={{ scale: isDragging ? 1.02 : 1 }}
        >
          <Textarea
            placeholder="Enter or paste your text here, or drag & drop a file..."
            className="min-h-[400px] text-base border-none p-0 focus-visible:ring-0 bg-transparent placeholder:text-gray-400 resize-none"
            value={text}
            onChange={onTextChange}
          />
        </motion.div>

        <div className="space-y-6">
          <StyleSelector
            styles={writingStyles}
            selectedStyle={selectedStyle}
            onSelect={onStyleSelect}
          />

          <div className="flex justify-end gap-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                onClick={onClear}
                className="gap-2 hover:bg-gray-50"
              >
                <RefreshCcw className="w-4 h-4" />
                Clear
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                onClick={onAnalyze} 
                className="gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={isAnalyzing}
              >
                <Wand2 className="w-4 h-4" />
                <AnimatePresence mode="wait">
                  {isAnalyzing ? (
                    <motion.div
                      key="analyzing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center"
                    >
                      <span className="animate-pulse">Analyzing</span>
                      <span className="ml-2 animate-bounce">...</span>
                    </motion.div>
                  ) : (
                    <motion.span
                      key="analyze"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      Analyze {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default InputSection;
