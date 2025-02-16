
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { WritingStyle } from "@/types/analysis";
import { motion } from "framer-motion";

interface StyleSelectorProps {
  styles: WritingStyle[];
  selectedStyle: string;
  onSelect: (style: string) => void;
}

const StyleSelector = ({ styles, selectedStyle, onSelect }: StyleSelectorProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {styles.map(({ icon: Icon, label, description, color }) => (
        <TooltipProvider key={label}>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant={selectedStyle === label.toLowerCase() ? "default" : "outline"}
                  className={`w-full h-full min-h-[48px] transition-all duration-300 ${
                    selectedStyle === label.toLowerCase()
                      ? `bg-${color}-500 text-white hover:bg-${color}-600 shadow-lg`
                      : "hover:bg-gray-50 shadow-sm"
                  }`}
                  onClick={() => onSelect(label.toLowerCase())}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent className="bg-white/90 backdrop-blur border-none shadow-lg p-3">
              <p>{description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};

export default StyleSelector;
