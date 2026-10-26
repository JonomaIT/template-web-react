import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "../../api/client";
import { itemsApi } from "./api";
import type { NewItem } from "./types";

// Server state lives in TanStack Query: cache, loading and error states, retries and invalidation
// come from it, not from hand-written useEffect code.

export const itemsKey = ["items"] as const;
export const itemKey = (id: string) => ["items", id] as const;

export function useItems() {
  return useQuery({ queryKey: itemsKey, queryFn: async () => (await itemsApi.list()).data.items });
}

export function useItem(id: string) {
  return useQuery({ queryKey: itemKey(id), queryFn: async () => (await itemsApi.get(id)).data });
}

export function useCreateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: NewItem) => (await itemsApi.create(item)).data,
    onSuccess: (item) => {
      queryClient.setQueryData(itemKey(item.id), item);
      return queryClient.invalidateQueries({ queryKey: itemsKey, exact: true });
    },
  });
}

export function useDeleteItems() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const results = await Promise.allSettled(ids.map((id) => itemsApi.remove(id)));
      const failed = results.filter(
        (result) =>
          result.status === "rejected" &&
          !(result.reason instanceof ApiError && result.reason.status === 404),
      );
      if (failed.length) throw new ApiError(0, `${failed.length} de ${ids.length} itens não foram apagados`);
      return ids;
    },
    onSettled: (_, __, ids) => {
      ids.forEach((id) => queryClient.removeQueries({ queryKey: itemKey(id) }));
      return queryClient.invalidateQueries({ queryKey: itemsKey, exact: true });
    },
  });
}
