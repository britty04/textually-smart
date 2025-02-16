
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

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
        <h3 className="text-sm font-medium mb-2">Original Text</h3>
        <div className="text-sm">{highlightChangedWords(originalText)}</div>
      </Card>
      
      <Card className="p-4 bg-white">
        <h3 className="text-sm font-medium mb-2">Humanized Text</h3>
        <div className="text-sm">{highlightChangedWords(humanizedText)}</div>
      </Card>
    </motion.div>
  );
};

export default SideBySideView;
