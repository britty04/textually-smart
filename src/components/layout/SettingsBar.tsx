
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { motion } from "framer-motion";

interface SettingsBarProps {
  onToggleSideBySide: () => void;
  isSideBySide: boolean;
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
}

const SettingsBar = ({ onToggleSideBySide, isSideBySide, selectedLanguage, onLanguageChange }: SettingsBarProps) => {
  const languages = ["English", "French", "Spanish", "German"];

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between p-4 bg-white/80 backdrop-blur border border-gray-100 rounded-lg shadow-sm mb-4"
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Side-by-Side View</span>
          <Switch
            checked={isSideBySide}
            onCheckedChange={onToggleSideBySide}
          />
        </div>
        <div className="h-6 w-px bg-gray-200" />
        <div className="flex items-center gap-2">
          <Languages className="w-4 h-4 text-gray-500" />
          <select
            value={selectedLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="text-sm border-none bg-transparent focus:ring-0"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang.toLowerCase()}>
                {lang}
              </option>
            ))}
          </select>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsBar;
