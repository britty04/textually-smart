
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle } from "lucide-react";

interface AIScoreCardProps {
  score?: number;
  improvementScore: number;
  readabilityScore?: number;
  clarityScore?: number;
  suggestions?: string[];
}

const AIScoreCard = ({ 
  score, 
  improvementScore,
  readabilityScore,
  clarityScore,
  suggestions
}: AIScoreCardProps) => {
  const getScoreColor = (score: number) => {
    if (score < 0.3) return "text-green-500";
    if (score < 0.7) return "text-yellow-500";
    return "text-red-500";
  };

  const getProgressColor = (score: number) => {
    if (score < 0.3) return "bg-green-500";
    if (score < 0.7) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card className="p-4">
      <div className="space-y-6">
        <div>
          <h4 className="font-medium mb-2">AI Content Score</h4>
          {score !== undefined ? (
            <>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
                  {Math.round(score * 100)}%
                </span>
                <span className="text-sm text-gray-500">
                  AI Probability
                </span>
              </div>
              <Progress 
                value={score * 100} 
                className={`h-2 ${getProgressColor(score)}`}
              />
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Click "Analyze" to check AI probability
            </p>
          )}
        </div>

        {(readabilityScore !== undefined || clarityScore !== undefined) && (
          <div className="space-y-4 border-t pt-4">
            <div>
              <h5 className="text-sm font-medium mb-1">Readability Score</h5>
              <Progress 
                value={readabilityScore ? readabilityScore * 100 : 0}
                className="h-2 bg-blue-500"
              />
            </div>
            <div>
              <h5 className="text-sm font-medium mb-1">Clarity Score</h5>
              <Progress 
                value={clarityScore ? clarityScore * 100 : 0}
                className="h-2 bg-purple-500"
              />
            </div>
          </div>
        )}

        {suggestions && suggestions.length > 0 && (
          <div className="border-t pt-4">
            <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-500" />
              Improvement Suggestions
            </h5>
            <ul className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="text-sm text-gray-600">
                  • {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AIScoreCard;
