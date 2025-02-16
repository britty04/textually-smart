
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface SmartSynonymsProps {
  word: string;
  synonyms: string[];
  onSelect: (synonym: string) => void;
}

const SmartSynonyms = ({ word, synonyms, onSelect }: SmartSynonymsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute z-50 mt-2"
    >
      <Card className="p-3 bg-white shadow-lg border border-gray-100 w-48">
        <h4 className="text-sm font-medium mb-2">Synonyms for "{word}"</h4>
        <div className="space-y-1">
          {synonyms.map((synonym, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              className="w-full justify-start text-left text-sm hover:bg-gray-50"
              onClick={() => onSelect(synonym)}
            >
              {synonym}
            </Button>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export default SmartSynonyms;
