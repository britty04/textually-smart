
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

export const processTextWithGemini = async (text: string, mode: 'humanize' | 'rephrase'): Promise<string | string[]> => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured in environment variables');
  }

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro"});
  
  const prompts = {
    humanize: `Make this text sound more human and natural, while keeping the same meaning:
    "${text}"
    
    Rules:
    1. Keep the same information and meaning
    2. Make it more conversational
    3. Vary sentence structure
    4. Use simpler words when possible
    5. Keep it professional but friendly`,
    
    rephrase: `Provide 3 different versions of this text:
    1. Casual and friendly tone
    2. Professional and formal tone
    3. Academic and technical tone
    
    Original text: "${text}"`
  };

  const result = await model.generateContent(prompts[mode]);
  const response = await result.response;
  return mode === 'rephrase' ? response.text().split('\n\n') : response.text();
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
