import { request } from "../../api/client";
import type { Item, NewItem } from "./types";

export const itemsApi = {
  list: () => request<{ items: Item[] }>("/items"),
  get: (id: string) => request<Item>(`/items/${encodeURIComponent(id)}`),
  create: (item: NewItem) => request<Item>("/items", { method: "POST", body: item }),
  remove: (id: string) => request<void>(`/items/${encodeURIComponent(id)}`, { method: "DELETE" }),
};
