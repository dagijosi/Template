export interface Item {
  id: number;
  name: string;
}

let items: Item[] = [
  { id: 1, name: "Item 1" },
  { id: 2, name: "Item 2" },
  { id: 3, name: "Item 3" },
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