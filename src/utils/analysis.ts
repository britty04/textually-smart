
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

const getPromptByStyle = (text: string, style: string, mode: 'humanize' | 'rephrase') => {
  const prompts = {
    academic: {
      humanize: `Transform this text into an academic style while maintaining its core message. Use scholarly language, formal tone, and proper citations where relevant: "${text}"

      Guidelines:
      - Use academic vocabulary and complex sentence structures
      - Maintain objective and analytical tone
      - Include transitional phrases common in academic writing
      - Focus on clarity and precision`,
      
      rephrase: `Rephrase this text in an academic style suitable for scholarly publications:
      "${text}"
      
      Requirements:
      - Use academic terminology
      - Employ formal sentence structures
      - Maintain scholarly tone
      - Ensure logical flow`
    },
    casual: {
      humanize: `Make this text sound more conversational and friendly while keeping its meaning. Add a warm, approachable tone: "${text}"

      Guidelines:
      - Use everyday language
      - Add conversational elements
      - Keep sentences short and engaging
      - Make it feel like a friendly chat`,
      
      rephrase: `Rephrase this text in a casual, friendly tone that's easy to read:
      "${text}"
      
      Requirements:
      - Use conversational language
      - Keep it simple and relatable
      - Add natural flow
      - Make it engaging`
    },
    professional: {
      humanize: `Transform this text into a professional business style while maintaining its message. Use clear, concise language suitable for a business context: "${text}"

      Guidelines:
      - Use business-appropriate vocabulary
      - Maintain professional tone
      - Be clear and direct
      - Focus on actionable content`,
      
      rephrase: `Rephrase this text in a professional business style:
      "${text}"
      
      Requirements:
      - Use business terminology
      - Keep it concise and clear
      - Maintain professional tone
      - Ensure clarity and impact`
    },
    creative: {
      humanize: `Transform this text into a creative, engaging style while keeping its core message. Add descriptive elements and vivid language: "${text}"

      Guidelines:
      - Use colorful, descriptive language
      - Add creative elements
      - Make it engaging and memorable
      - Include sensory details`,
      
      rephrase: `Rephrase this text in a creative, engaging style:
      "${text}"
      
      Requirements:
      - Use vivid language
      - Add artistic elements
      - Make it memorable
      - Include descriptive details`
    }
  };

  return prompts[style as keyof typeof prompts][mode];
};

export const processTextWithGemini = async (text: string, mode: 'humanize' | 'rephrase', style: string = 'casual'): Promise<string | string[]> => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured in environment variables');
  }

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro"});
  
  const prompt = getPromptByStyle(text, style, mode);
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
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
