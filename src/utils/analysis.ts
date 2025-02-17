
import nlp from 'compromise';
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const getAIScore = (text: string): number => {
  const doc = nlp(text);
  
  const sentenceLength = doc.sentences().length;
  const wordCount = doc.terms().length;
  const avgWordsPerSentence = wordCount / sentenceLength;
  
  const formalWords = doc.match('(therefore|hence|thus|consequently|furthermore|moreover)').length;
  const passiveVoice = doc.match('#Noun (was|were|has been|have been) #Verb').length;
  
  const uniqueWords = new Set(doc.terms().out('array')).size;
  const repetitionScore = 1 - (uniqueWords / wordCount);
  
  const complexityScore = Math.min((avgWordsPerSentence / 20), 1);
  const formalityScore = Math.min((formalWords / sentenceLength) * 2, 1);
  const passiveScore = Math.min((passiveVoice / sentenceLength) * 2, 1);
  
  const finalScore = (complexityScore + formalityScore + passiveScore + repetitionScore) / 4;
  return Math.min(Math.max(finalScore, 0), 1);
};

export const getToneAnalysis = (text: string) => {
  const doc = nlp(text);
  const positive = doc.match('(great|good|excellent|amazing|wonderful|fantastic|beautiful|love|happy|perfect)').length;
  const negative = doc.match('(bad|terrible|awful|horrible|hate|sad|poor|worst|annoying)').length;
  
  const total = positive + negative;
  const score = total === 0 ? 0.5 : positive / total;
  
  return {
    sentiment: score > 0.6 ? 'positive' : score < 0.4 ? 'negative' : 'neutral' as 'positive' | 'neutral' | 'negative',
    score
  };
};

export const getKeywordDensity = (text: string) => {
  const doc = nlp(text);
  const words = doc.terms().out('array');
  const wordCount = words.length;
  const density: { [key: string]: number } = {};
  
  words.forEach(word => {
    if (word.length > 3) {
      density[word.toLowerCase()] = (density[word.toLowerCase()] || 0) + 1;
    }
  });
  
  Object.keys(density).forEach(key => {
    density[key] = +(density[key] / wordCount).toFixed(3);
  });
  
  return density;
};

const getPromptByStyle = (text: string, style: string, mode: 'humanize' | 'rephrase') => {
  const prompts = {
    academic: {
      humanize: `Transform this text into scholarly writing while maintaining its core message: "${text}"

      Guidelines:
      - Use academic vocabulary and formal sentence structures
      - Include proper citations and references where needed
      - Maintain objective and analytical tone
      - Focus on clarity and precision
      - Add transitional phrases common in academic writing`,
      
      rephrase: `Rephrase this text in an academic style:
      "${text}"
      
      Requirements:
      - Use sophisticated academic terminology
      - Employ complex sentence structures
      - Maintain scholarly objectivity
      - Ensure logical flow
      - Add academic transitions`
    },
    casual: {
      humanize: `Make this text sound more conversational and friendly: "${text}"

      Guidelines:
      - Use everyday language and expressions
      - Keep sentences short and engaging
      - Add conversational elements
      - Make it feel like a natural chat
      - Include relatable examples`,
      
      rephrase: `Rephrase this text in a casual, friendly tone:
      "${text}"
      
      Requirements:
      - Use conversational language
      - Keep it simple and relatable
      - Add natural flow
      - Make it engaging
      - Include informal expressions`
    },
    professional: {
      humanize: `Transform this text into polished business writing: "${text}"

      Guidelines:
      - Use clear, professional vocabulary
      - Maintain formal business tone
      - Focus on actionable content
      - Ensure clarity and conciseness
      - Add business-appropriate transitions`,
      
      rephrase: `Rephrase this text in a professional business style:
      "${text}"
      
      Requirements:
      - Use business terminology
      - Keep it concise and clear
      - Maintain professional tone
      - Ensure impact
      - Add business context`
    },
    creative: {
      humanize: `Transform this text into engaging, creative writing: "${text}"

      Guidelines:
      - Use vivid, descriptive language
      - Add creative elements and metaphors
      - Make it memorable and unique
      - Include sensory details
      - Create emotional connections`,
      
      rephrase: `Rephrase this text in a creative, engaging style:
      "${text}"
      
      Requirements:
      - Use colorful language
      - Add artistic elements
      - Make it memorable
      - Include vivid descriptions
      - Create emotional impact`
    }
  };

  return prompts[style as keyof typeof prompts][mode];
};

export const processTextWithGemini = async (
  text: string, 
  mode: 'humanize' | 'rephrase', 
  style: string = 'casual',
  preferences?: AIPreferences
): Promise<string | string[]> => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured');
  }

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    
    let prompt = getPromptByStyle(text, style, mode);
    
    if (preferences) {
      prompt += `\nAdditional Preferences:
      - Tone Strength: ${preferences.toneStrength}/100
      - Creativity Level: ${preferences.creativityLevel}/100
      - ${preferences.preserveKeywords ? 'Preserve key phrases and terminology' : 'Allow flexible word choice'}
      - ${preferences.enhanceSEO ? 'Optimize for SEO' : 'Focus on natural flow'}`;
    }
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const processedText = response.text();
    
    return mode === 'rephrase' ? [processedText] : processedText;
  } catch (error) {
    console.error('Error processing with Gemini:', error);
    throw error;
  }
};

export const findPlagiarismPhrases = (text: string) => {
  const phrases = [];
  const doc = nlp(text);
  const sentences = doc.sentences().out('array');
  
  for (let sentence of sentences) {
    const words = sentence.split(' ');
    if (words.length >= 5) {
      const keyPhrase = words.slice(0, 5).join(' ');
      const commonality = doc.match(keyPhrase).length;
      phrases.push({
        phrase: keyPhrase,
        matches: commonality * 100
      });
    }
  }
  
  return phrases.sort((a, b) => b.matches - a.matches).slice(0, 5);
};

export const calculateTrustScore = (
  aiScore: number,
  readabilityScore: number,
  clarityScore: number,
  plagiarismResults: Array<{ matches: number }> = []
) => {
  const plagiarismImpact = plagiarismResults.length > 0 
    ? Math.min(1, plagiarismResults.reduce((acc, curr) => acc + curr.matches, 0) / 1000)
    : 0;

  const baseScore = (
    (1 - aiScore) * 0.4 +
    readabilityScore * 0.3 +
    clarityScore * 0.3
  );

  return Math.max(0, Math.min(100, baseScore * (1 - plagiarismImpact) * 100));
};
