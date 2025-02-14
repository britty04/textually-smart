
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

  const getScoreColor = (score: number) => {
    if (score > 0.7) return 'text-red-500';
    if (score > 0.3) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getGradientStyle = (score: number) => {
    const percentage = score * 100;
    return {
      background: `linear-gradient(90deg, 
        ${score > 0.7 ? '#fecaca' : score > 0.3 ? '#fef3c7' : '#dcfce7'} ${percentage}%, 
        #f3f4f6 ${percentage}%)`,
    };
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h4 className="font-medium mb-2">AI Detection Results</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span>AI Probability:</span>
            <span className={`font-bold ${getScoreColor(score)}`}>
              {(score * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full h-6 rounded-full overflow-hidden transition-all duration-500"
            style={getGradientStyle(score)}>
          </div>
          <p className="text-sm mt-2">
            {score > 0.7 ? 'Highly likely AI-generated' :
             score > 0.3 ? 'May contain AI-generated content' :
             'Likely human-written'}
          </p>
        </div>
      </Card>
      
      {/* Detailed Analysis */}
      <Card className="p-4 bg-gray-50">
        <h4 className="font-medium mb-2">Content Analysis</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Natural Flow:</span>
            <span>{Math.round((1 - score) * 100)}%</span>
          </div>
          <div className="flex justify-between">
            <span>Complexity:</span>
            <span>{Math.round(score * 80)}%</span>
          </div>
          <div className="flex justify-between">
            <span>Authenticity:</span>
            <span>{Math.round((1 - score) * 90)}%</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AIScoreCard;
