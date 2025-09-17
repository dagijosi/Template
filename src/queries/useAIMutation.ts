import { useMutation } from '@tanstack/react-query';
import { fetchAIResponse } from '../api/ai';
import { useChatStore } from '../store/useChatStore';

export const useAIMutation = (modelName: 'gemini-pro' | 'gemini-pro-vision' | 'gemini-2.5-flash' | 'gemini-2.5-flash-lite' = 'gemini-2.5-flash-lite') => {
  const { addMessage } = useChatStore();

  return useMutation<string, Error, string>({
    mutationFn: (prompt: string) => fetchAIResponse(prompt, modelName), // Pass modelName
    onSuccess: (data) => {
      addMessage({ text: data, sender: 'ai' });
    },
    onError: (error) => {
      addMessage({ text: `Error: ${error.message}`, sender: 'ai' });
    },
  });
};
