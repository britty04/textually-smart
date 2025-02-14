
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
      <h4 className="font-medium mb-2">Rephrased Versions</h4>
      {versions?.length ? (
        <div className="space-y-4">
          {versions.map((version, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <div className="font-medium text-xs text-gray-500">
                  {index === 0 ? 'Casual Tone' : index === 1 ? 'Professional Tone' : 'Academic Tone'}
                </div>
                {onCopy && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onCopy(version)}
                    className="h-6"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                )}
              </div>
              <p className="text-sm">{version}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Click "Analyze Rephrase" to get different versions.
        </p>
      )}
    </Card>
  );
};

export default RephrasedVersionsCard;
