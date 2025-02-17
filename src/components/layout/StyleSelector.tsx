
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { WritingStyle } from "@/types/analysis";

interface StyleSelectorProps {
  styles: WritingStyle[];
  selectedStyle: string;
  onSelect: (style: string) => void;
}

const StyleSelector = ({ styles, selectedStyle, onSelect }: StyleSelectorProps) => {
  return (
    <div className="flex items-center gap-2">
      <Select value={selectedStyle} onValueChange={onSelect}>
        <SelectTrigger className="w-[200px] bg-white">
          <SelectValue placeholder="Select writing style" />
        </SelectTrigger>
        <SelectContent>
          {styles.map(({ label, description, icon: Icon }) => (
            <SelectItem key={label.toLowerCase()} value={label.toLowerCase()}>
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-[200px]">
            <p className="text-sm">
              {styles.find(style => style.label.toLowerCase() === selectedStyle)?.description}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default StyleSelector;
