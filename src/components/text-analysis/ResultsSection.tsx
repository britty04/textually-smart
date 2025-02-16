
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import AIScoreCard from "../analysis/AIScoreCard";
import HumanizedTextCard from "../analysis/HumanizedTextCard";
import PlagiarismCard from "../analysis/PlagiarismCard";
import RephrasedVersionsCard from "../analysis/RephrasedVersionsCard";
import { motion } from "framer-motion";
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Card className="p-6 bg-white/90 backdrop-blur shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 p-1 bg-gray-100/50 backdrop-blur rounded-lg">
            <TabsTrigger 
              value="detect"
              className="data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-300"
            >
              AI Detection
            </TabsTrigger>
            <TabsTrigger 
              value="humanize"
              className="data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-300"
            >
              Humanize
            </TabsTrigger>
            <TabsTrigger 
              value="plagiarism"
              className="data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-300"
            >
              Plagiarism
            </TabsTrigger>
            <TabsTrigger 
              value="rephrase"
              className="data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-300"
            >
              Rephrase
            </TabsTrigger>
          </TabsList>

          {results.aiScore !== undefined && activeTab === "detect" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Human-Like Score</span>
                <span className="text-sm font-medium">
                  {improvementScore.toFixed(1)}%
                </span>
              </div>
              <div className="relative">
                <Progress 
                  value={improvementScore} 
                  className="h-2 bg-gray-200"
                />
                <motion.div
                  className="absolute right-0 top-0 transform translate-x-1/2 -translate-y-full"
                  animate={{
                    x: `${improvementScore}%`,
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {improvementScore >= 90 ? "🎉" : improvementScore >= 70 ? "👍" : "💪"}
                </motion.div>
              </div>
            </motion.div>
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
    </motion.div>
  );
};

export default ResultsSection;
