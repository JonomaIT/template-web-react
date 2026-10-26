import Alert from "@cloudscape-design/components/alert";
import Button from "@cloudscape-design/components/button";
import Container from "@cloudscape-design/components/container";
import ContentLayout from "@cloudscape-design/components/content-layout";
import CopyToClipboard from "@cloudscape-design/components/copy-to-clipboard";
import Header from "@cloudscape-design/components/header";
import KeyValuePairs from "@cloudscape-design/components/key-value-pairs";
import StatusIndicator from "@cloudscape-design/components/status-indicator";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ApiError } from "../api/client";
import { useFollow } from "../app/navigation";
import { useNotify } from "../app/notify";
import { ConfirmDelete } from "../components/ConfirmDelete";
import { formatDateTime } from "../features/items/format";
import { useDeleteItems, useItem } from "../features/items/hooks";

export default function ItemDetailPage() {
  const { itemId = "" } = useParams();
  const follow = useFollow();
  const navigate = useNavigate();
  const notify = useNotify();
  const item = useItem(itemId);
  const remove = useDeleteItems();
  const [confirming, setConfirming] = useState(false);

  if (item.isPending) return <StatusIndicator type="loading">Carregando o item</StatusIndicator>;

  if (item.isError) {
    const missing = item.error instanceof ApiError && item.error.status === 404;
    return (
      <Alert
        type={missing ? "warning" : "error"}
        header={missing ? "Item não encontrado" : "Não foi possível carregar o item"}
        action={
          <Button href="/itens" onFollow={follow}>
            Voltar aos itens
          </Button>
        }
      >
        {missing ? "Ele pode ter sido apagado." : item.error.message}
      </Alert>
    );
  }

  const data = item.data;

  function confirmDelete() {
    remove.mutate([data.id], {
      onSuccess: () => {
        notify({ type: "success", content: `Item ${data.name} apagado.` });
        void navigate("/itens");
      },
      onError: (err) => notify({ type: "error", header: "Não foi possível apagar", content: err.message }),
      onSettled: () => setConfirming(false),
    });
  }

  return (
    <ContentLayout
      header={
        <Header variant="h1" actions={<Button onClick={() => setConfirming(true)}>Apagar</Button>}>
          {data.name}
        </Header>
      }
    >
      <Container header={<Header variant="h2">Detalhes</Header>}>
        <KeyValuePairs
          columns={3}
          items={[
            {
              label: "ID",
              value: (
                <CopyToClipboard
                  variant="inline"
                  textToCopy={data.id}
                  copyButtonAriaLabel="Copiar o ID"
                  copySuccessText="ID copiado"
                  copyErrorText="Não foi possível copiar"
                />
              ),
            },
            { label: "Descrição", value: data.description || "—" },
            { label: "Criado em", value: formatDateTime(data.created_at) },
          ]}
        />
      </Container>
      <ConfirmDelete
        title="Apagar o item?"
        visible={confirming}
        loading={remove.isPending}
        onCancel={() => setConfirming(false)}
        onConfirm={confirmDelete}
      >
        Esta ação não pode ser desfeita.
      </ConfirmDelete>
    </ContentLayout>
  );
}
