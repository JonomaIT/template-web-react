import { setupWorker } from "msw/browser";
import { createHandlers } from "./handlers";

/** `npm run dev`: answers the API at `apiUrl` from the browser itself (Mock Service Worker). */
export async function startMockApi(apiUrl: string) {
  await setupWorker(...createHandlers(apiUrl)).start({ onUnhandledFrame: "bypass", quiet: true });
}
