import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderApp } from "../test/render";

describe("home", () => {
  it("shows what to change and the configuration in use", async () => {
    renderApp("/");
    expect(await screen.findByRole("heading", { name: "Comece aqui" })).toBeInTheDocument();
    expect(screen.getByText("https://api.test")).toBeInTheDocument();
  });

  it("lands unknown addresses on a friendly page", async () => {
    renderApp("/nao-existe");
    expect(await screen.findByText("Página não encontrada")).toBeInTheDocument();
  });
});
