
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import AIScoreCard from "../analysis/AIScoreCard";
import HumanizedTextCard from "../analysis/HumanizedTextCard";
import PlagiarismCard from "../analysis/PlagiarismCard";
import RephrasedVersionsCard from "../analysis/RephrasedVersionsCard";
import type { AnalysisResults } from "@/types/analysis";

interface ResultsSectionProps {
  activeTab: string;
  results: AnalysisResults;
  improvementScore: number;
  onTabChange: (value: string) => void;
  onCopy: (text: string) => void;
}

const ResultsSection = ({
  activeTab,
  results,
  improvementScore,
  onTabChange,
  onCopy,
}: ResultsSectionProps) => {
  return (
    <Card className="p-6 bg-white/80 backdrop-blur shadow-lg border border-gray-100">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="detect">AI Detection</TabsTrigger>
          <TabsTrigger value="humanize">Humanize</TabsTrigger>
          <TabsTrigger value="plagiarism">Plagiarism</TabsTrigger>
          <TabsTrigger value="rephrase">Rephrase</TabsTrigger>
        </TabsList>

        {results.aiScore !== undefined && activeTab === "detect" && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Improvement Score</span>
              <span className="text-sm font-medium">{improvementScore.toFixed(1)}%</span>
            </div>
            <Progress value={improvementScore} className="h-2" />
          </div>
        )}

        <TabsContent value="detect" className="mt-6">
          <AIScoreCard score={results.aiScore} />
        </TabsContent>

        <TabsContent value="humanize" className="mt-6">
          <HumanizedTextCard 
            text={results.humanizedText} 
            onCopy={onCopy}
          />
        </TabsContent>

        <TabsContent value="plagiarism" className="mt-6">
          <PlagiarismCard results={results.plagiarismResults} />
        </TabsContent>

        <TabsContent value="rephrase" className="mt-6">
          <RephrasedVersionsCard 
            versions={results.rephrasedVersions}
            onCopy={onCopy}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ResultsSection;
