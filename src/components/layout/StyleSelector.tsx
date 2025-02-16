
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
                      ? `from-${color}-500 to-${color}-600 bg-gradient-to-r text-white hover:from-${color}-600 hover:to-${color}-700 shadow-lg`
                      : "hover:bg-gray-50 text-gray-700 hover:text-gray-900 shadow-sm border-2"
                  }`}
                  onClick={() => onSelect(label.toLowerCase())}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  <span className="font-medium">{label}</span>
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-white/90 backdrop-blur border-none shadow-lg p-3">
              <p className="text-sm">{description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};

export default StyleSelector;
