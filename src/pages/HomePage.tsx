import Box from "@cloudscape-design/components/box";
import Button from "@cloudscape-design/components/button";
import Container from "@cloudscape-design/components/container";
import ContentLayout from "@cloudscape-design/components/content-layout";
import Header from "@cloudscape-design/components/header";
import KeyValuePairs from "@cloudscape-design/components/key-value-pairs";
import SpaceBetween from "@cloudscape-design/components/space-between";
import { getConfig } from "../app/config";
import { useFollow } from "../app/navigation";

const STEPS = [
  "Troque o nome: APP_ID em src/app/appId.ts, name em package.json e em deploy/app.hcl (= nome do repo), e o time da squad na primeira linha de .github/CODEOWNERS.",
  "Troque os nomes públicos em deploy/env/production.tfvars.",
  "Aponte public/config.json para a sua API.",
  "Substitua o exemplo: src/features/items, as páginas de itens, as rotas e o mock da API.",
  "Rode npm test e abra o PR: o CI faz lint, typecheck, testes, build e o scan das dependências.",
];

export default function HomePage() {
  const follow = useFollow();
  const config = getConfig();

  return (
    <ContentLayout
      header={
        <Header
          variant="h1"
          description="Ponto de partida para os sites da JonomaIT: React, TypeScript, Vite e Cloudscape."
          actions={
            <Button variant="primary" href="/itens" onFollow={follow}>
              Ver o exemplo
            </Button>
          }
        >
          Comece aqui
        </Header>
      }
    >
      <SpaceBetween size="l">
        <Container header={<Header variant="h2">Para virar o seu app</Header>}>
          <SpaceBetween size="s">
            {STEPS.map((step, index) => (
              <Box key={step}>
                {index + 1}. {step}
              </Box>
            ))}
          </SpaceBetween>
        </Container>
        <Container
          header={
            <Header
              variant="h2"
              description="Lida de /config.json ao abrir: o mesmo build serve todo ambiente."
            >
              Configuração em uso
            </Header>
          }
        >
          <KeyValuePairs
            columns={2}
            items={[
              { label: "Ambiente", value: config.environment },
              { label: "API", value: config.apiUrl },
            ]}
          />
        </Container>
      </SpaceBetween>
    </ContentLayout>
  );
}
