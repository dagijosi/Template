import { useMutation } from '@tanstack/react-query';
import { fetchAIResponse } from '../api/ai';
import { useChatStore } from '../store/useChatStore';
import {
  addItem,
  deleteItem,
  editItem,
  getItem,
  getItems,
} from '../data/items';

const getSystemPrompt = () => {
  const items = getItems();
  return `You are a helpful assistant with access to tools for managing a list of items. When the user wants to manipulate items, you must respond with a JSON object representing a tool call.

The JSON object must have a "tool" property (the name of the tool) and an "args" property (an object with the arguments for the tool).

Available tools:
- getItems(): Lists all items.
  - Example: { "tool": "getItems", "args": {} }
- getItemById(id: number): Gets a single item by its ID.
  - Example: { "tool": "getItemById", "args": { "id": 1 } }
- addItem(name: string): Adds a new item.
  - Example: { "tool": "addItem", "args": { "name": "Buy milk" } }
- editItem(id: number, name: string): Edits an item's name.
  - Example: { "tool": "editItem", "args": { "id": 1, "name": "Buy bread" } }
- deleteItem(id: number): Deletes an item by its ID.
  - Example: { "tool": "deleteItem", "args": { "id": 1 } }

Current items for context (do not display this list to the user unless asked):
${JSON.stringify(items, null, 2)}

If the user is not asking to use a tool, just have a normal conversation. Do not return a tool call JSON for a normal conversation.
`;
};

export const useAIMutation = (
  modelName:
    | 'gemini-pro'
    | 'gemini-pro-vision'
    | 'gemini-2.5-flash'
    | 'gemini-2.5-flash-lite' = 'gemini-2.5-flash'
) => {
  const { addMessage } = useChatStore();

  return useMutation<string, Error, string>({
    mutationFn: async (prompt: string) => {
      const fullPrompt = `${getSystemPrompt()}\n\nUser query: "${prompt}"`;
      const aiResponse = await fetchAIResponse(fullPrompt, modelName);

      try {
        // Sanitize response to handle markdown code blocks
        const sanitizedResponse = aiResponse.replace(/```json\n|```/g, '').trim();
        const toolCall = JSON.parse(sanitizedResponse);

        if (toolCall.tool) {
          switch (toolCall.tool) {
            case 'getItems': {
              const items = getItems();
              if (items.length === 0) {
                return 'You have no items.';
              }
              return `Here are your items:\n${items
                .map((i) => `- (ID: ${i.id}) ${i.name}`)
                .join('\n')}`;
            }
            case 'getItemById': {
              const item = getItem(toolCall.args.id);
              return item
                ? `Item (ID: ${item.id}): ${item.name}`
                : `Error: Item with ID ${toolCall.args.id} not found.`;
            }
            case 'addItem': {
              if (!toolCall.args.name) {
                return 'Error: Please provide a name for the item.';
              }
              const newItem = addItem(toolCall.args.name);
              return `Successfully added item: "${newItem.name}" (ID: ${newItem.id})`;
            }
            case 'editItem': {
              if (!toolCall.args.id || !toolCall.args.name) {
                return 'Error: Please provide an item ID and a new name.';
              }
              const updatedItem = editItem(toolCall.args.id, toolCall.args.name);
              return updatedItem
                ? `Successfully updated item (ID: ${updatedItem.id}) to "${updatedItem.name}"`
                : `Error: Item with ID ${toolCall.args.id} not found.`;
            }
            case 'deleteItem': {
              if (!toolCall.args.id) {
                return 'Error: Please provide an item ID to delete.';
              }
              const itemToDelete = getItem(toolCall.args.id);
              if (itemToDelete) {
                deleteItem(toolCall.args.id);
                return `Successfully deleted item: "${itemToDelete.name}" (ID: ${itemToDelete.id})`;
              }
              return `Error: Item with ID ${toolCall.args.id} not found.`;
            }
            default:
              // Unrecognized tool
              return aiResponse;
          }
        }
        return aiResponse; // Not a tool call
      } catch  {
        return aiResponse; // Not JSON, just a regular response
      }
    },
    onSuccess: (data) => {
      addMessage({ text: data, sender: 'ai' });
    },
    onError: (error) => {
      addMessage({ text: `Error: ${error.message}`, sender: 'ai' });
    },
  });
};
