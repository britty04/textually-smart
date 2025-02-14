
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

interface HumanizedTextCardProps {
  text?: string;
  onCopy?: (text: string) => void;
}

const HumanizedTextCard = ({ text, onCopy }: HumanizedTextCardProps) => {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium">Humanized Text</h4>
        {text && onCopy && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCopy(text)}
            className="h-8"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
        )}
      </div>
      {text ? (
        <p className="text-sm whitespace-pre-wrap">{text}</p>
      ) : (
        <p className="text-sm text-muted-foreground">
          Click "Analyze Humanize" to get your humanized version.
        </p>
      )}
    </Card>
  );
};

export default HumanizedTextCard;
