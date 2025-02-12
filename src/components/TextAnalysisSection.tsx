
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, RefreshCcw, Wand2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const TextAnalysisSection = () => {
  const [text, setText] = useState("");

  const handleAnalyze = () => {
    // Will implement API calls in next iteration
    console.log("Analyzing text:", text);
  };

  return (
    <Card className="w-full max-w-4xl p-6 glass card-shadow">
      <Tabs defaultValue="detect" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="detect">AI Detection</TabsTrigger>
          <TabsTrigger value="humanize">Humanize</TabsTrigger>
          <TabsTrigger value="plagiarism">Plagiarism</TabsTrigger>
          <TabsTrigger value="rephrase">Rephrase</TabsTrigger>
        </TabsList>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Enter your text</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <AlertCircle className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Paste your text here for analysis</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <Textarea
            placeholder="Enter or paste your text here..."
            className="min-h-[200px] text-base"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => setText("")}
              className="gap-2"
            >
              <RefreshCcw className="w-4 h-4" />
              Clear
            </Button>
            <Button onClick={handleAnalyze} className="gap-2">
              <Wand2 className="w-4 h-4" />
              Analyze
            </Button>
          </div>
        </div>

        <TabsContent value="detect" className="mt-6">
          <Card className="p-4">
            <h4 className="font-medium mb-2">AI Detection Results</h4>
            <p className="text-sm text-muted-foreground">
              Results will appear here after analysis.
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="humanize" className="mt-6">
          <Card className="p-4">
            <h4 className="font-medium mb-2">Humanized Text</h4>
            <p className="text-sm text-muted-foreground">
              Humanized version will appear here.
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="plagiarism" className="mt-6">
          <Card className="p-4">
            <h4 className="font-medium mb-2">Plagiarism Check Results</h4>
            <p className="text-sm text-muted-foreground">
              Plagiarism analysis will appear here.
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="rephrase" className="mt-6">
          <Card className="p-4">
            <h4 className="font-medium mb-2">Rephrased Text</h4>
            <p className="text-sm text-muted-foreground">
              Rephrased version will appear here.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default TextAnalysisSection;
