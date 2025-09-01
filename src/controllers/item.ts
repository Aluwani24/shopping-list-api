import { Item } from "../types/item";

// In-memory storage
let items: Item[] = [];
let nextId = 1;

// GET all items
export const getAllItems = (): Item[] => [...items];

// GET item by ID
export const getItemById = (id: number): Item | undefined =>
  items.find((it) => it.id === id);

// ADD new item
export const addItem = (name: string, quantity: number): Item => {
  const newItem: Item = { id: nextId++, name, quantity, purchased: false };
  items.push(newItem);
  return newItem;
};

// UPDATE item
export const updateItem = (
  id: number,
  data: Partial<Omit<Item, "id">>
): Item | undefined => {
  const item = getItemById(id);
  if (!item) return undefined;

  if (data.name && typeof data.name === "string") {
    item.name = data.name.trim();
  }
  if (data.quantity && typeof data.quantity === "number") {
    item.quantity = data.quantity;
  }
  if (typeof data.purchased === "boolean") {
    item.purchased = data.purchased;
  }

  return item;
};

// DELETE item
export const deleteItem = (id: number): boolean => {
  const idx = items.findIndex((it) => it.id === id);
  if (idx === -1) return false;
  items.splice(idx, 1);
  return true;
};
