import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { server, TEST_API_URL } from "../mocks/server";
import { ApiError, request } from "./client";

describe("request", () => {
  it("returns the data", async () => {
    const { data } = await request<{ items: unknown[] }>("/items");
    expect(data.items).toHaveLength(3);
  });

  it("turns an API error into ApiError with the API's message", async () => {
    await expect(request("/items", { method: "POST", body: { name: "" } })).rejects.toEqual(
      new ApiError(400, "name: text, 1 to 80 characters"),
    );
  });

  it("reports a network failure without leaking the raw error", async () => {
    server.use(http.get(`${TEST_API_URL}/items`, () => HttpResponse.error()));
    await expect(request("/items")).rejects.toMatchObject({
      status: 0,
      message: "the API could not be reached",
    });
  });

  it("gives up after the timeout", async () => {
    server.use(http.get(`${TEST_API_URL}/items`, () => new Promise<never>(() => {})));
    await expect(request("/items", { timeoutMs: 20 })).rejects.toMatchObject({ status: 0 });
  });
});
