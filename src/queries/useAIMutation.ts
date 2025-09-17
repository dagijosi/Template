import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { fetchAIResponse } from "../api/ai";
import { useChatStore } from "../store/useChatStore";
import {
  addItem,
  deleteItem,
  editItem,
  getItem,
  getItems,
} from "../data/items";

// ---------------------- Types ----------------------
type ToolName =
  | "navigate"
  | "getItems"
  | "getItemById"
  | "addItem"
  | "addItems"
  | "editItem"
  | "editItems"
  | "deleteItem"
  | "deleteItems"
  | "generateItemName"; // Added new tool

type ToolArgs =
  | { path: string }
  | object
  | { name: string }
  | { names: string[] }
  | { id: number; name: string }
  | { items: Array<{ id: number; name: string }> }
  | { id: number }
  | { ids: number[] };

interface ToolCall {
  tool: ToolName;
  args: ToolArgs;
}

// ---------------------- Slash Command Parser ----------------------
const parseUserCommand = (userPrompt: string): ToolCall | null => {
  userPrompt = userPrompt.trim();

  if (!userPrompt.startsWith("/")) return null;

  const parts = userPrompt
    .split(" ")
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
  const command = parts[0];

  switch (command) {
    case "/navigate": {
      let path = parts[1];
      if (!path) return null;
      if (!path.startsWith("/")) path = "/" + path; // make absolute
      return { tool: "navigate", args: { path } };
    }

    case "/getItems":
      return { tool: "getItems", args: {} };
    case "/addItem": {
      const name = parts.slice(1).join(" ");
      if (name) return { tool: "addItem", args: { name } };
      return null;
    }
    case "/addItems": {
      const names = parts.slice(1).join(" ").split(',').map(name => name.trim()).filter(name => name.length > 0);
      if (names.length > 0) return { tool: "addItems", args: { names } };
      return null;
    }
    case "/editItem": {
      const id = parseInt(parts[1]);
      const name = parts.slice(2).join(" ");
      if (!isNaN(id) && name) return { tool: "editItem", args: { id, name } };
      return null;
    }
    case "/editItems": {
      const itemPairs = parts.slice(1).join(" ").split(',').map(pair => pair.trim()).filter(pair => pair.length > 0);
      const items: Array<{ id: number; name: string }> = [];
      itemPairs.forEach(pair => {
        const [idStr, name] = pair.split(':').map(s => s.trim());
        const id = parseInt(idStr);
        if (!isNaN(id) && name) {
          items.push({ id, name });
        }
      });
      if (items.length > 0) return { tool: "editItems", args: { items } };
      return null;
    }
    case "/deleteItem": {
      const id = parseInt(parts[1]);
      if (!isNaN(id)) return { tool: "deleteItem", args: { id } };
      return null;
    }
    case "/deleteItems": {
      const ids = parts.slice(1).join(" ").split(',').map(idStr => parseInt(idStr.trim())).filter(id => !isNaN(id));
      if (ids.length > 0) return { tool: "deleteItems", args: { ids } };
      return null;
    }
    case "/generateItemName": {
      return { tool: "generateItemName", args: {} };
    }
    default:
      return null;
  }
};

// ---------------------- System Prompt ----------------------
const getSystemPrompt = () => {
  const items = getItems();
  return `You are a helpful assistant with access to tools for managing a list of items. You can analyze, summarize, and answer questions about the current items. You can also suggest new items or names. When the user wants to manipulate items, you must respond with a JSON object representing a tool call.

The JSON object must have a "tool" property (the name of the tool) and an "args" property (an object with the arguments for the tool).

Available tools:
- getItems(): Lists all items.
  - Example: { "tool": "getItems", "args": {} }
- getItemById(id: number): Gets a single item by its ID.
  - Example: { "tool": "getItemById", "args": { "id": 1 } }
- addItem(name: string): Adds a new item.
  - Example: { "tool": "addItem", "args": { "name": "Buy milk" } }
- addItems(names: string[]): Adds multiple new items. Provide a comma-separated list of item names.
  - Example: { "tool": "addItems", "args": { "names": ["Buy milk", "Buy eggs"] } }
- editItem(id: number, name: string): Edits an item's name.
  - Example: { "tool": "editItem", "args": { "id": 1, "name": "Buy bread" } }
- editItems(items: Array<{ id: number; name: string }>): Edits multiple items. Provide a comma-separated list of 'id:name' pairs.
  - Example: { "tool": "editItems", "args": { "items": [{ "id": 1, "name": "Buy bread" }, { "id": 2, "name": "Buy cheese" }] } }
- deleteItem(id: number): Deletes an item by its ID.
  - Example: { "tool": "deleteItem", "args": { "id": 1 } }
- deleteItems(ids: number[]): Deletes multiple items by their IDs. Provide a comma-separated list of item IDs.
  - Example: { "tool": "deleteItems", "args": { "ids": [1, 2] } }
- generateItemName(): Generates a creative name for a new item.
  - Example: { "tool": "generateItemName", "args": {} }
- navigate(path: string): Navigates to a different page. Valid paths are "/", "/items", "/ai-demo".
  - Example: { "tool": "navigate", "args": { "path": "/items" } }

Current items for context (do not display this list to the user unless asked):
${JSON.stringify(items, null, 2)}

If the user is not asking to use a tool, just have a normal conversation. Do not return a tool call JSON for a normal conversation.
`;
};


// ---------------------- useAIMutation Hook ----------------------
export const useAIMutation = (
  modelName: 
    | "gemini-pro"
    | "gemini-pro-vision"
    | "gemini-2.5-flash"
    | "gemini-2.5-flash-lite" = "gemini-2.5-flash"
) => {
  const { addMessage, messages } = useChatStore(); // Get messages from store
  const navigate = useNavigate();

  return useMutation<string, Error, string>({

    mutationFn: async (prompt: string) => {
      const parsedToolCall = parseUserCommand(prompt);

      // ---------------------- User-friendly slash commands ----------------------
      if (parsedToolCall) {
        const toolCall = parsedToolCall;
        switch (toolCall.tool) {
          case "getItems": {
            const items = getItems();
            if (items.length === 0) return "You have no items.";
            return `You have ${items.length} items:\n${items
              .map((i) => `- (ID: ${i.id}) ${i.name}`)
              .join("\n")}`;
          }
          case "getItemById": {
            const id = (toolCall.args as { id: number }).id;
            const item = getItem(id);
            return item
              ? `Item (ID: ${item.id}): ${item.name}`
              : `Error: Item with ID ${id} not found.`;
          }
          case "addItem": {
            const name = (toolCall.args as { name: string }).name;
            const newItem = addItem(name);
            return `Successfully added item: "${newItem.name}" (ID: ${newItem.id})`;
          }
          case "addItems": {
            const names = (toolCall.args as { names: string[] }).names;
            const newItems = names.map(name => addItem(name));
            return `Successfully added items: ${newItems.map(item => `"${item.name}" (ID: ${item.id})`).join(", ")}`;
          }
          case "editItem": {
            const { id, name } = toolCall.args as { id: number; name: string };
            const updatedItem = editItem(id, name);
            return updatedItem
              ? `Successfully updated item (ID: ${updatedItem.id}) to "${updatedItem.name}"`
              : `Error: Item with ID ${id} not found.`;
          }
          case "editItems": {
            const itemsToEdit = (toolCall.args as { items: Array<{ id: number; name: string }> }).items;
            const updatedItems: string[] = [];
            const notFoundItems: string[] = [];
            itemsToEdit.forEach(({ id, name }) => {
              const updatedItem = editItem(id, name);
              if (updatedItem) {
                updatedItems.push(`"${updatedItem.name}" (ID: ${updatedItem.id})`);
              } else {
                notFoundItems.push(`ID: ${id}`);
              }
            });
            let message = "";
            if (updatedItems.length > 0) {
              message += `Successfully updated items: ${updatedItems.join(", ")}.`;
            }
            if (notFoundItems.length > 0) {
              message += ` Error: Items with ${notFoundItems.join(", ")} not found or could not be updated.`;
            }
            return message.trim();
          }
          case "deleteItem": {
            const id = (toolCall.args as { id: number }).id;
            const itemToDelete = getItem(id);
            if (itemToDelete) {
              deleteItem(id);
              return `Successfully deleted item: "${itemToDelete.name}" (ID: ${itemToDelete.id})`;
            }
            return `Error: Item with ID ${id} not found.`;
          }
          case "deleteItems": {
            const ids = (toolCall.args as { ids: number[] }).ids;
            const deletedItems: string[] = [];
            const notFoundIds: number[] = [];
            ids.forEach(id => {
              const itemToDelete = getItem(id);
              if (itemToDelete) {
                deleteItem(id);
                deletedItems.push(`"${itemToDelete.name}" (ID: ${itemToDelete.id})`);
              } else {
                notFoundIds.push(id);
              }
            });
            let message = "";
            if (deletedItems.length > 0) {
              message += `Successfully deleted items: ${deletedItems.join(", ")}.`;
            }
            if (notFoundIds.length > 0) {
              message += ` Error: Items with IDs ${notFoundIds.join(", ")} not found.`;
            }
            return message.trim();
          }
          case "navigate": {
            const path = (toolCall.args as { path: string }).path;
            setTimeout(() => navigate(path), 100);
            return `Navigating to ${path}...`;
          }
          default:
            return `Error: Unrecognized slash command: ${toolCall.tool}`;
        }
      }

      // ---------------------- AI Response ----------------------
      const messageHistory = messages.slice(-5).map(msg => `${msg.sender === 'user' ? 'User' : 'AI'}: ${msg.text}`).join('\n');
      const fullPrompt = `${getSystemPrompt()}\n\n--- Conversation History ---\n${messageHistory}\n\nUser query: "${prompt}"`;
      const aiResponse = await fetchAIResponse(fullPrompt, modelName);

      try {
        const sanitized = aiResponse.replace(/```json\n|```/g, "").trim();
        const toolCall: ToolCall = JSON.parse(sanitized);

        switch (toolCall.tool) {
          case "getItems": {
            const items = getItems();
            if (items.length === 0) return "You have no items.";
            return `You have ${items.length} items:\n${items
              .map((i) => `- (ID: ${i.id}) ${i.name}`)
              .join("\n")}`;
          }
          case "getItemById": {
            const id = (toolCall.args as { id: number }).id;
            const item = getItem(id);
            return item
              ? `Item (ID: ${item.id}): ${item.name}`
              : `Error: Item with ID ${id} not found.`;
          }
          case "addItem": {
            const name = (toolCall.args as { name: string }).name;
            const newItem = addItem(name);
            return `Successfully added item: "${newItem.name}" (ID: ${newItem.id})`;
          }
          case "addItems": {
            const names = (toolCall.args as { names: string[] }).names;
            const newItems = names.map(name => addItem(name));
            return `Successfully added items: ${newItems.map(item => `"${item.name}" (ID: ${item.id})`).join(", ")}`;
          }
          case "editItem": {
            const { id, name } = toolCall.args as { id: number; name: string };
            const updatedItem = editItem(id, name);
            return updatedItem
              ? `Successfully updated item (ID: ${updatedItem.id}) to "${updatedItem.name}"`
              : `Error: Item with ID ${id} not found.`;
          }
          case "editItems": {
            const itemsToEdit = (toolCall.args as { items: Array<{ id: number; name: string }> }).items;
            const updatedItems: string[] = [];
            const notFoundItems: string[] = [];
            itemsToEdit.forEach(({ id, name }) => {
              const updatedItem = editItem(id, name);
              if (updatedItem) {
                updatedItems.push(`"${updatedItem.name}" (ID: ${updatedItem.id})`);
              } else {
                notFoundItems.push(`ID: ${id}`);
              }
            });
            let message = "";
            if (updatedItems.length > 0) {
              message += `Successfully updated items: ${updatedItems.join(", ")}.`;
            }
            if (notFoundItems.length > 0) {
              message += ` Error: Items with ${notFoundItems.join(", ")} not found or could not be updated.`;
            }
            return message.trim();
          }
          case "deleteItem": {
            const id = (toolCall.args as { id: number }).id;
            const itemToDelete = getItem(id);
            if (itemToDelete) {
              deleteItem(id);
              return `Successfully deleted item: "${itemToDelete.name}" (ID: ${itemToDelete.id})`;
            }
            return `Error: Item with ID ${id} not found.`;
          }
          case "deleteItems": {
            const ids = (toolCall.args as { ids: number[] }).ids;
            const deletedItems: string[] = [];
            const notFoundIds: number[] = [];
            ids.forEach(id => {
              const itemToDelete = getItem(id);
              if (itemToDelete) {
                deleteItem(id);
                deletedItems.push(`"${itemToDelete.name}" (ID: ${itemToDelete.id})`);
              } else {
                notFoundIds.push(id);
              }
            });
            let message = "";
            if (deletedItems.length > 0) {
              message += `Successfully deleted items: ${deletedItems.join(", ")}.`;
            }
            if (notFoundIds.length > 0) {
              message += ` Error: Items with IDs ${notFoundIds.join(", ")} not found.`;
            }
            return message.trim();
          }
          case "navigate": {
            const path = (toolCall.args as { path: string }).path;
            setTimeout(() => navigate(path), 100);
            return `Navigating to ${path}...`;
          }
          default:
            return aiResponse;
          case "generateItemName": {
            const aiSuggestedName = await fetchAIResponse('Suggest a single, creative name for a new item. Respond with only the name, no other text.', modelName);
            return `AI suggested name: "${aiSuggestedName.replace(/["'.]/g, '').trim()}"`;
          }
        }
      } catch {
        return aiResponse; // Regular response, not a tool call
      }
    },
    onSuccess: (data) => addMessage({ text: data, sender: "ai" }),
    onError: (error) =>
      addMessage({ text: `Error: ${error.message}`, sender: "ai" }),
  });
};