
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Copy, Download } from "lucide-react";

interface SideBySideViewProps {
  originalText: string;
  humanizedText: string;
  changedWords: string[];
}

const SideBySideView = ({ originalText, humanizedText, changedWords }: SideBySideViewProps) => {
  const highlightChangedWords = (text: string) => {
    return text.split(' ').map((word, index) => (
      <span
        key={index}
        className={`${
          changedWords.includes(word.toLowerCase())
            ? 'bg-yellow-100 px-1 rounded'
            : ''
        }`}
      >
        {word}{' '}
      </span>
    ));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-2 gap-4"
    >
      <Card className="p-4 bg-gray-50">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium">Original Text</h3>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">
              <Copy className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="text-sm">{highlightChangedWords(originalText)}</div>
      </Card>
      
      <Card className="p-4 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium">Humanized Text</h3>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">
              <Copy className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="text-sm">{highlightChangedWords(humanizedText)}</div>
      </Card>
    </motion.div>
  );
};

export default SideBySideView;
