
import { LucideIcon } from 'lucide-react';

export interface AnalysisResults {
  aiScore?: number;
  humanizedText?: string;
  plagiarismResults?: Array<{ phrase: string; matches: number }>;
  rephrasedVersions?: string[];
  readabilityScore?: number;
  clarityScore?: number;
  suggestions?: string[];
  toneAnalysis?: {
    sentiment: 'positive' | 'neutral' | 'negative';
    score: number;
  };
  seoScore?: number;
  keywordDensity?: {
    [key: string]: number;
  };
  trustScore?: number;
  modifiedPercentage?: number;
  versionHistory?: {
    timestamp: number;
    text: string;
    style: string;
  }[];
}

export interface WritingStyle {
  icon: LucideIcon;
  label: string;
  description: string;
  color: string;
  characteristics?: string[];
}

export interface AIPreferences {
  toneStrength: number;
  creativityLevel: number;
  preserveKeywords: boolean;
  enhanceSEO: boolean;
}
