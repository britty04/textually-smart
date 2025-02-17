
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Copy } from "lucide-react";
import { motion } from "framer-motion";
import AIScoreCard from "../analysis/AIScoreCard";
import HumanizedTextCard from "../analysis/HumanizedTextCard";
import PlagiarismCard from "../analysis/PlagiarismCard";
import RephrasedVersionsCard from "../analysis/RephrasedVersionsCard";

interface ResultsSectionProps {
  activeTab: string;
  results: {
    aiScore?: number;
    humanizedText?: string;
    plagiarismResults?: Array<{ phrase: string; matches: number }>;
    rephrasedVersions?: string[];
    readabilityScore?: number;
    clarityScore?: number;
    suggestions?: string[];
  };
  improvementScore: number;
  onTabChange: (tab: string) => void;
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
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={onTabChange}>
          <TabsList className="grid grid-cols-4 gap-4 bg-muted/50 p-1">
            <TabsTrigger value="detect" className="data-[state=active]:bg-white">
              AI Detection
            </TabsTrigger>
            <TabsTrigger value="humanize" className="data-[state=active]:bg-white">
              Humanize
            </TabsTrigger>
            <TabsTrigger value="plagiarism" className="data-[state=active]:bg-white">
              Plagiarism
            </TabsTrigger>
            <TabsTrigger value="rephrase" className="data-[state=active]:bg-white">
              Rephrase
            </TabsTrigger>
          </TabsList>

          <div className="mt-6 space-y-6">
            <TabsContent value="detect">
              <AIScoreCard 
                score={results.aiScore}
                improvementScore={improvementScore}
                readabilityScore={results.readabilityScore}
                clarityScore={results.clarityScore}
                suggestions={results.suggestions}
              />
            </TabsContent>

            <TabsContent value="humanize">
              <HumanizedTextCard 
                text={results.humanizedText}
                onCopy={onCopy}
              />
            </TabsContent>

            <TabsContent value="plagiarism">
              <PlagiarismCard 
                results={results.plagiarismResults}
              />
            </TabsContent>

            <TabsContent value="rephrase">
              <RephrasedVersionsCard 
                versions={results.rephrasedVersions}
                onCopy={onCopy}
              />
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </motion.div>
  );
};

export default ResultsSection;
