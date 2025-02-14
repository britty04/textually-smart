
import { Card } from "@/components/ui/card";

interface RephrasedVersionsCardProps {
  versions?: string[];
}

const RephrasedVersionsCard = ({ versions }: RephrasedVersionsCardProps) => {
  return (
    <Card className="p-4">
      <h4 className="font-medium mb-2">Rephrased Versions</h4>
      {versions?.length ? (
        <div className="space-y-4">
          {versions.map((version, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="font-medium text-xs text-gray-500 mb-1">
                {index === 0 ? 'Casual Tone' : index === 1 ? 'Professional Tone' : 'Academic Tone'}
              </div>
              <p className="text-sm">{version}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Rephrased versions will appear here.
        </p>
      )}
    </Card>
  );
};

export default RephrasedVersionsCard;
