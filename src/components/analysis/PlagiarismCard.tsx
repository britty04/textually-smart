
import { Card } from "@/components/ui/card";

interface PlagiarismResult {
  phrase: string;
  matches: number;
}

interface PlagiarismCardProps {
  results?: PlagiarismResult[];
}

const PlagiarismCard = ({ results }: PlagiarismCardProps) => {
  return (
    <Card className="p-4">
      <h4 className="font-medium mb-2">Plagiarism Check Results</h4>
      {results?.length ? (
        <div className="space-y-2">
          <p className="text-sm mb-2">Potential matches found:</p>
          <ul className="list-disc list-inside text-sm">
            {results.map((result, index) => (
              <li key={index} className="flex items-center justify-between">
                <span>{result.phrase}</span>
                <span className={`ml-2 ${result.matches > 1000 ? 'text-red-500' : 'text-yellow-500'}`}>
                  {result.matches.toLocaleString()} matches
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Plagiarism analysis will appear here.
        </p>
      )}
    </Card>
  );
};

export default PlagiarismCard;
