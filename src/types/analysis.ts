
export interface AnalysisResults {
  aiScore?: number;
  humanizedText?: string;
  plagiarismResults?: Array<{ phrase: string; matches: number }>;
  rephrasedVersions?: string[];
}
