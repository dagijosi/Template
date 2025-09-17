export interface Item {
  id: number;
  name: string;
}

let items: Item[] = [
  { id: 1, name: "Buy groceries (milk, eggs, bread)" },
  { id: 2, name: "Schedule dentist appointment" },
  { id: 3, name: "Read 'Dune' by Frank Herbert" },
  { id: 4, name: "Plan weekend trip to the mountains" },
  { id: 5, name: "Learn React Hooks (useState, useEffect)" },
  { id: 6, name: "Fix leaky faucet in bathroom" },
  { id: 7, name: "Call mom for her birthday" },
  { id: 8, name: "Research new coffee makers" },
  { id: 9, name: "Write blog post about AI tools" },
  { id: 10, name: "Go for a 30-minute run" },
];

export const getItems = (): Item[] => items;

export const getItem = (id: number): Item | undefined =>
  items.find((item) => item.id === id);

export const addItem = (name: string): Item => {
  const newItem: Item = {
    id: Math.max(0, ...items.map((i) => i.id)) + 1,
    name,
  };
  items.push(newItem);
  return newItem;
};

export const deleteItem = (id: number): void => {
  items = items.filter((item) => item.id !== id);
};

export const editItem = (id: number, name: string): Item | undefined => {
  const itemIndex = items.findIndex((item) => item.id === id);
  if (itemIndex > -1) {
    items[itemIndex].name = name;
    return items[itemIndex];
  }
  return undefined;
};