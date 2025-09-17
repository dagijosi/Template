
import { useQuery } from "@tanstack/react-query";
import { fetchAIResponse } from "@/api/ai";

export const useAIResponse = (prompt: string) => {
  return useQuery({
    queryKey: ["ai-response", prompt],
    queryFn: () => fetchAIResponse(prompt),
    enabled: !!prompt, // Only run the query if the prompt is not empty
  });
};
