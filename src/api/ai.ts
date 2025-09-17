import { GoogleGenerativeAI } from '@google/generative-ai';

// IMPORTANT: Replace with your actual Gemini API Key
// You can get one from Google AI Studio: https://aistudio.google.com/app/apikey
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY';

if (GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
  console.warn('GEMINI_API_KEY is not set. Please replace "YOUR_GEMINI_API_KEY" with your actual API key or set VITE_GEMINI_API_KEY in your environment variables.');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Initialize different models
const textModel = genAI.getGenerativeModel({ model: 'gemini-pro' });
const visionModel = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
const flashModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' }); // Added flash model
const flashLiteModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

export const fetchAIResponse = async (
  prompt: string,
  modelName: 'gemini-pro' | 'gemini-pro-vision' | 'gemini-2.5-flash' | 'gemini-2.5-flash-lite' = 'gemini-2.5-flash-lite' // Default to flash model
): Promise<string> => {
  console.log(`Fetching AI response for prompt: "${prompt}" using model: ${modelName}`);

  if (!prompt) {
    throw new Error('Prompt cannot be empty.');
  }

  let modelToUse;
  if (modelName === 'gemini-pro') {
    modelToUse = textModel;
  } else if (modelName === 'gemini-pro-vision') {
    modelToUse = visionModel;
  } else if (modelName === 'gemini-2.5-flash') { // Use flash model
    modelToUse = flashModel;
  }  else if (modelName === 'gemini-2.5-flash-lite') { // Use flash-lite model
    modelToUse = flashLiteModel;
  } 
  else {
    throw new Error(`Unsupported model: ${modelName}`);
  }

  try {
    const result = await modelToUse.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error(`Error fetching AI response from Gemini API using ${modelName}:`, error);
    throw new Error(`Failed to get response from AI using ${modelName}. Please try again.`);
  }
};