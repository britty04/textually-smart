
import { Card } from "@/components/ui/card";

interface AIScoreCardProps {
  score?: number;
}

const AIScoreCard = ({ score }: AIScoreCardProps) => {
  if (score === undefined) {
    return (
      <Card className="p-4">
        <h4 className="font-medium mb-2">AI Detection Results</h4>
        <p className="text-sm text-muted-foreground">
          Results will appear here after analysis.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h4 className="font-medium mb-2">AI Detection Results</h4>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span>AI Probability:</span>
          <span className={`font-bold ${
            score > 0.7 ? 'text-red-500' : 
            score > 0.3 ? 'text-yellow-500' : 
            'text-green-500'
          }`}>
            {(score * 100).toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 rounded-full h-2 transition-all duration-500"
            style={{ width: `${score * 100}%` }}
          />
        </div>
      </div>
    </Card>
  );
};

export default AIScoreCard;
