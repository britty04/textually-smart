
import { Card } from "@/components/ui/card";

interface HumanizedTextCardProps {
  text?: string;
}

const HumanizedTextCard = ({ text }: HumanizedTextCardProps) => {
  return (
    <Card className="p-4">
      <h4 className="font-medium mb-2">Humanized Text</h4>
      {text ? (
        <p className="text-sm whitespace-pre-wrap">{text}</p>
      ) : (
        <p className="text-sm text-muted-foreground">
          Humanized version will appear here.
        </p>
      )}
    </Card>
  );
};

export default HumanizedTextCard;
