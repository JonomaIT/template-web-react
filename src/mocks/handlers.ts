import { delay, http, HttpResponse } from "msw";
import type { Item } from "../features/items/types";

// The example API simulated: the app runs and is tested with no backend. Replace it with your API's
// contract. Handlers match only the API address (config apiUrl), never a wildcard: in `npm run dev`
// the app itself is served from paths like /src/features/items/..., which "*/items/:id" would swallow.

const SEED: Item[] = [
  {
    id: "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed",
    name: "Caderno",
    description: "Capa dura, 200 folhas",
    created_at: "2026-10-20T13:00:00Z",
  },
  {
    id: "6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b",
    name: "Mochila",
    description: "",
    created_at: "2026-10-21T09:30:00Z",
  },
  {
    id: "c2f1e0d4-8a8e-4b5f-9a43-2e3f0c3b6d1a",
    name: "Teclado",
    description: "ABNT2",
    created_at: "2026-10-22T18:45:00Z",
  },
];

export const mockApi = {
  latencyMs: 150,
  items: new Map<string, Item>(),
  reset() {
    this.latencyMs = 150;
    this.items = new Map(SEED.map((item) => [item.id, item]));
  },
};
mockApi.reset();

const error = (status: number, message: string) => HttpResponse.json({ error: message }, { status });

export const createHandlers = (apiUrl: string) => [
  http.get(`${apiUrl}/items`, async () => {
    await delay(mockApi.latencyMs);
    return HttpResponse.json({ items: [...mockApi.items.values()] });
  }),

  http.get(`${apiUrl}/items/:id`, async ({ params }) => {
    await delay(mockApi.latencyMs);
    const item = mockApi.items.get(String(params.id));
    return item ? HttpResponse.json(item) : error(404, "item not found");
  }),

  http.post(`${apiUrl}/items`, async ({ request }) => {
    await delay(mockApi.latencyMs);
    const body = (await request.json().catch(() => null)) as { name?: unknown; description?: unknown } | null;
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    if (!name || name.length > 80) return error(400, "name: text, 1 to 80 characters");
    const description = typeof body?.description === "string" ? body.description.trim() : "";
    const item: Item = { id: crypto.randomUUID(), name, description, created_at: new Date().toISOString() };
    mockApi.items.set(item.id, item);
    return HttpResponse.json(item, { status: 201 });
  }),

  http.delete(`${apiUrl}/items/:id`, async ({ params }) => {
    await delay(mockApi.latencyMs);
    return mockApi.items.delete(String(params.id))
      ? new HttpResponse(null, { status: 204 })
      : error(404, "item not found");
  }),
];
