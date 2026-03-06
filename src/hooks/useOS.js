import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

export const useOS = () => {
  const queryClient = useQueryClient();

  // --- BUSCAS (Queries) ---

  // 1. Buscar todas as OS
  const { data: ordens = [], isLoading: loadingOs } = useQuery({
    queryKey: ["ordens"],
    queryFn: async () => {
      const res = await api.get("/os");
      return res.data;
    },
    refetchInterval: 15000,
  });

  // 2. Buscar opções dos Selects (Setores, etc)
  const {
    data: opcoes = {
      setores: [],
      solicitantes: [],
      executores: [],
      prioridades: [],
    },
    isLoading: loadingOptions,
  } = useQuery({
    queryKey: ["opcoes"],
    queryFn: async () => {
      const res = await api.get("/os/opcoes");
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  // 3. Buscar próximo número sequencial
  const { data: nextNumber = null } = useQuery({
    queryKey: ["nextNumber"],
    queryFn: async () => {
      const res = await api.get("/os/proximo-numero");
      return res.data.proximo;
    },
  });

  // --- AÇÕES (Mutations) ---

  // 4. Criar nova OS
  const createMutation = useMutation({
    mutationFn: async (formData) => {
      const res = await api.post("/os", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ordens"] });
      queryClient.invalidateQueries({ queryKey: ["nextNumber"] });
    },
  });

  // 5. Atualizar OS (Fechamento/Processo)
  const updateMutation = useMutation({
    mutationFn: async ({ id, formData }) => {
      const res = await api.put(`/os/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ordens"] });
    },
  });

  // 6. Update Inline (Status rápido na tabela)
  const inlineMutation = useMutation({
    mutationFn: async ({ id, dados }) => {
      const res = await api.patch(`/os/${id}/inline`, dados);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ordens"] });
    },
  });

  // 7. Deletar OS
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/os/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ordens"] });
    },
  });

  return {
    ordens,
    opcoes,
    nextNumber,
    loading: loadingOs || loadingOptions,

    useCreateOs: createMutation.mutateAsync,
    useUpdateOs: (id, formData) => updateMutation.mutateAsync({ id, formData }),
    useUpdateInline: (id, dados) => inlineMutation.mutateAsync({ id, dados }),
    useDeleteOs: deleteMutation.mutateAsync,
    useGetOs: () => queryClient.invalidateQueries({ queryKey: ["ordens"] }),
    useGetOptions: () =>
      queryClient.invalidateQueries({ queryKey: ["opcoes"] }),
    useGetNextNumber: () =>
      queryClient.invalidateQueries({ queryKey: ["nextNumber"] }),
  };
};
