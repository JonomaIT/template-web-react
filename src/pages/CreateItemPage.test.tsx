import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { mockApi } from "../mocks/handlers";
import { renderApp } from "../test/render";

describe("new item", () => {
  it("says what to fix before calling the API", async () => {
    const { user } = renderApp("/itens/novo");
    await user.click(await screen.findByRole("button", { name: "Criar item" }));
    expect(await screen.findByText("Informe o nome.")).toBeInTheDocument();
    expect(mockApi.items.size).toBe(3);
  });

  it("creates the item and opens it", async () => {
    const { user, router } = renderApp("/itens/novo");
    await user.type(await screen.findByRole("textbox", { name: "Nome" }), "Caneta");
    await user.type(screen.getByRole("textbox", { name: /Descrição/ }), "Azul");
    await user.click(screen.getByRole("button", { name: "Criar item" }));

    await waitFor(() => expect(router.state.location.pathname).toMatch(/^\/itens\/[0-9a-f-]{36}$/));
    expect(await screen.findByRole("heading", { name: "Caneta" })).toBeInTheDocument();
    expect(screen.getByText("Item Caneta criado.")).toBeInTheDocument();
    expect(mockApi.items.size).toBe(4);
  });
});
