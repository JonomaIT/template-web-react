import { useCollection } from "@cloudscape-design/collection-hooks";
import Alert from "@cloudscape-design/components/alert";
import Button from "@cloudscape-design/components/button";
import CollectionPreferences, {
  type CollectionPreferencesProps,
} from "@cloudscape-design/components/collection-preferences";
import Header from "@cloudscape-design/components/header";
import Link from "@cloudscape-design/components/link";
import Pagination from "@cloudscape-design/components/pagination";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Table, { type TableProps } from "@cloudscape-design/components/table";
import TextFilter from "@cloudscape-design/components/text-filter";
import { useMemo, useState } from "react";
import { APP_ID } from "../app/appId";
import { useFollow } from "../app/navigation";
import { useNotify } from "../app/notify";
import { usePersistentState } from "../app/storage";
import { ConfirmDelete } from "../components/ConfirmDelete";
import { EmptyState } from "../components/EmptyState";
import { formatDateTime, shortId } from "../features/items/format";
import { useDeleteItems, useItems } from "../features/items/hooks";
import type { Item } from "../features/items/types";

// Which columns show and how many rows per page: the person's choice, remembered per browser.
const DEFAULT_PREFERENCES: CollectionPreferencesProps.Preferences = {
  pageSize: 10,
  contentDisplay: [
    { id: "id", visible: true },
    { id: "name", visible: true },
    { id: "description", visible: true },
    { id: "created_at", visible: true },
  ],
};

export default function ItemsPage() {
  const follow = useFollow();
  const notify = useNotify();
  const items = useItems();
  const remove = useDeleteItems();
  const [confirming, setConfirming] = useState(false);
  const [preferences, setPreferences] = usePersistentState(`${APP_ID}:items-table`, DEFAULT_PREFERENCES);

  const columns = useMemo<TableProps.ColumnDefinition<Item>[]>(
    () => [
      {
        id: "id",
        header: "ID",
        isRowHeader: true,
        sortingField: "id",
        cell: (item) => (
          <Link href={`/itens/${item.id}`} onFollow={follow}>
            {shortId(item.id)}
          </Link>
        ),
      },
      { id: "name", header: "Nome", minWidth: 160, sortingField: "name", cell: (item) => item.name },
      { id: "description", header: "Descrição", cell: (item) => item.description || "—" },
      {
        id: "created_at",
        header: "Criado em",
        sortingField: "created_at",
        cell: (item) => formatDateTime(item.created_at),
      },
    ],
    [follow],
  );

  const all = items.data ?? [];
  const {
    items: page,
    actions,
    collectionProps,
    filterProps,
    filteredItemsCount,
    paginationProps,
  } = useCollection(all, {
    filtering: {
      fields: ["id", "name", "description"],
      empty: (
        <EmptyState
          title="Nenhum item ainda"
          action={
            <Button href="/itens/novo" onFollow={follow}>
              Criar item
            </Button>
          }
        />
      ),
      noMatch: <EmptyState title="Nenhum item encontrado">Ajuste ou limpe a busca.</EmptyState>,
    },
    sorting: { defaultState: { sortingColumn: { sortingField: "created_at" }, isDescending: true } },
    pagination: { pageSize: preferences.pageSize },
    selection: { trackBy: "id" },
  });

  const selected = collectionProps.selectedItems ?? [];

  function deleteSelected() {
    const ids = selected.map((item) => item.id);
    remove.mutate(ids, {
      onSuccess: () => notify({ type: "success", content: `${ids.length} item(ns) apagado(s).` }),
      onError: (err) => notify({ type: "error", header: "Não foi possível apagar", content: err.message }),
      onSettled: () => {
        setConfirming(false);
        actions.setSelectedItems([]);
      },
    });
  }

  if (items.isError) {
    return (
      <Alert
        type="error"
        header="Não foi possível carregar os itens"
        action={<Button onClick={() => void items.refetch()}>Tentar de novo</Button>}
      >
        {items.error.message}
      </Alert>
    );
  }

  return (
    <>
      <Table
        {...collectionProps}
        items={page}
        columnDefinitions={columns}
        columnDisplay={preferences.contentDisplay}
        selectionType="multi"
        trackBy="id"
        variant="full-page"
        stickyHeader
        loading={items.isPending}
        loadingText="Carregando itens"
        ariaLabels={{
          selectionGroupLabel: "Seleção de itens",
          allItemsSelectionLabel: () => "Selecionar todos",
          itemSelectionLabel: (_, item) => `Selecionar ${item.name}`,
        }}
        header={
          <Header
            variant="awsui-h1-sticky"
            counter={selected.length ? `(${selected.length}/${all.length})` : `(${all.length})`}
            description="Exemplo de lista: busca, ordenação, paginação, preferências e ações em lote."
            actions={
              <SpaceBetween direction="horizontal" size="xs">
                <Button
                  disabled={!selected.length}
                  ariaLabel="Apagar os itens selecionados"
                  onClick={() => setConfirming(true)}
                >
                  Apagar
                </Button>
                <Button variant="primary" href="/itens/novo" onFollow={follow}>
                  Criar item
                </Button>
              </SpaceBetween>
            }
          >
            Itens
          </Header>
        }
        filter={
          <TextFilter
            {...filterProps}
            filteringPlaceholder="Buscar por nome, descrição ou ID"
            filteringAriaLabel="Buscar itens"
            countText={`${filteredItemsCount ?? 0} resultado(s)`}
          />
        }
        pagination={<Pagination {...paginationProps} />}
        preferences={
          <CollectionPreferences
            title="Preferências"
            confirmLabel="Confirmar"
            cancelLabel="Cancelar"
            preferences={preferences}
            onConfirm={({ detail }) => setPreferences(detail)}
            pageSizePreference={{
              title: "Itens por página",
              options: [10, 25, 50].map((value) => ({ value, label: `${value} itens` })),
            }}
            contentDisplayPreference={{
              title: "Colunas",
              options: columns.map((column) => ({
                id: column.id ?? "",
                label: String(column.header),
                alwaysVisible: column.id === "id",
              })),
            }}
          />
        }
      />
      <ConfirmDelete
        title={selected.length === 1 ? "Apagar o item?" : `Apagar ${selected.length} itens?`}
        visible={confirming}
        loading={remove.isPending}
        onCancel={() => setConfirming(false)}
        onConfirm={deleteSelected}
      >
        Esta ação não pode ser desfeita.
      </ConfirmDelete>
    </>
  );
}
