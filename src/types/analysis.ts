
import { LucideIcon } from 'lucide-react';

export interface AnalysisResults {
  aiScore?: number;
  humanizedText?: string;
  plagiarismResults?: Array<{ phrase: string; matches: number }>;
  rephrasedVersions?: string[];
}

export interface WritingStyle {
  icon: LucideIcon;
  label: string;
  description: string;
  color: string;
}
