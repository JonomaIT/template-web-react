import { screen, waitFor, within } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { mockApi } from "../mocks/handlers";
import { server, TEST_API_URL } from "../mocks/server";
import { renderApp } from "../test/render";

describe("items list", () => {
  it("lists the items from the API", async () => {
    renderApp("/itens");
    expect(await screen.findByText("Caderno")).toBeInTheDocument();
    expect(screen.getByText("(3)")).toBeInTheDocument();
  });

  it("filters as the person types", async () => {
    const { user } = renderApp("/itens");
    await screen.findByText("Caderno");
    await user.type(screen.getByRole("searchbox", { name: "Buscar itens" }), "mochi");
    await waitFor(() => expect(screen.queryByText("Caderno")).not.toBeInTheDocument());
    expect(screen.getByText("Mochila")).toBeInTheDocument();
  });

  it("deletes the selected items after confirming", async () => {
    const { user } = renderApp("/itens");
    await user.click(await screen.findByRole("checkbox", { name: "Selecionar Teclado" }));
    await user.click(screen.getByRole("button", { name: "Apagar os itens selecionados" }));
    await user.click(within(await screen.findByRole("dialog")).getByRole("button", { name: "Apagar" }));

    expect(await screen.findByText("1 item(ns) apagado(s).")).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText("Teclado")).not.toBeInTheDocument());
    expect(mockApi.items.size).toBe(2);
  });

  it("offers a retry when the API fails", async () => {
    server.use(
      http.get(`${TEST_API_URL}/items`, () => HttpResponse.json({ error: "boom" }, { status: 500 })),
    );
    renderApp("/itens");
    expect(await screen.findByText("Não foi possível carregar os itens")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tentar de novo" })).toBeInTheDocument();
  });
});
