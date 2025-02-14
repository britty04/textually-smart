
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

interface RephrasedVersionsCardProps {
  versions?: string[];
  onCopy?: (text: string) => void;
}

const RephrasedVersionsCard = ({ versions, onCopy }: RephrasedVersionsCardProps) => {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-medium">Rephrased Version</h4>
        {versions?.[0] && onCopy && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCopy(versions[0])}
            className="h-8"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
        )}
      </div>
      {versions?.length ? (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-sm whitespace-pre-wrap">{versions[0]}</p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Select a writing style and click "Analyze Rephrase" to get your rephrased version.
        </p>
      )}
    </Card>
  );
};

export default RephrasedVersionsCard;
