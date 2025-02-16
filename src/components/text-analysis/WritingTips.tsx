
import { Card } from "@/components/ui/card";

const WritingTips = () => {
  return (
    <Card className="mt-6 p-4 bg-blue-50 border-blue-100">
      <h4 className="font-medium mb-2">Writing Tips</h4>
      <ul className="list-disc list-inside text-sm space-y-2">
        <li>Try varying your sentence structure for more natural flow</li>
        <li>Use more personal pronouns to sound more conversational</li>
        <li>Include transition words to improve readability</li>
        <li>Avoid repetitive phrases and sentence structures</li>
        <li>Use active voice for more engaging content</li>
      </ul>
    </Card>
  );
};

export default WritingTips;
