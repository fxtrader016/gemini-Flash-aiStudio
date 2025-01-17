import { GoogleGenerativeAI } from '@google/generative-ai';
import { getApiKeys } from './theme/palette';

// Get API keys from the color palette
const API_KEYS = getApiKeys();

let currentKeyIndex = 0;

const getNextApiKey = () => {
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
  return API_KEYS[currentKeyIndex];
};

// Initialize with v1beta API version
const createGenAI = (apiKey: string) => new GoogleGenerativeAI(apiKey, {
  apiVersion: 'v1beta'
});

export const getGeminiResponse = async (prompt: string, history: { role: string; content: string }[]) => {
  if (!prompt.trim()) {
    throw new Error('Prompt cannot be empty');
  }

  // Rotate API key for each new chat session
  const apiKey = getNextApiKey();
  const genAI = createGenAI(apiKey);

  let attempts = 0;
  const maxAttempts = API_KEYS.length;

  while (attempts < maxAttempts) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      // Format history into a chat-like context
      const contextPrompt = history.map(msg => 
        `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
      ).join('\n');
      
      // Combine context with new prompt
      const fullPrompt = history.length > 0 
        ? `${contextPrompt}\n\nUser: ${prompt}\n\nAssistant: Please provide a response using markdown formatting where appropriate.`
        : `${prompt}\n\nPlease provide a response using markdown formatting where appropriate.`;

      const result = await model.generateContent(fullPrompt);

      if (!result || !result.response) {
        throw new Error('No response received from Gemini API');
      }

      const response = await result.response;
      const text = response.text();
      
      if (!text) {
        throw new Error('Empty response received from Gemini API');
      }

      return text;
    } catch (error) {
      console.error('Gemini API Error:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        error
      });
      
      // Rotate to next API key
      currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
      attempts++;

      if (attempts === maxAttempts) {
        throw new Error(
          error instanceof Error 
            ? error.message 
            : 'An error occurred while processing your request'
        );
      }
    }
  }

  throw new Error('All API keys exhausted');
};