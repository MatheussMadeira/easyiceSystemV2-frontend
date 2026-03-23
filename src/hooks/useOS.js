import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

export const useOS = (filtrosAPI = {}) => {
  const queryClient = useQueryClient();

  // --- BUSCAS (Queries) ---

  const { data: ordens = [], isLoading: loadingOs } = useQuery({
    queryKey: ["ordens", filtrosAPI],
    queryFn: async () => {
      const res = await api.get("/os", { params: filtrosAPI });
      return res.data;
    },
    placeholderData: (previousData) => previousData,
    refetchInterval: 15000,
  });

  // 2. Buscar opções dos Selects
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
      queryClient.invalidateQueries({ queryKey: ["logs"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, formData }) => {
      const isFormData = formData instanceof FormData;
      const res = await api.put(`/os/${id}`, formData, {
        headers: {
          ...(isFormData ? { "Content-Type": "multipart/form-data" } : {}),
        },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ordens"] });
      queryClient.invalidateQueries({ queryKey: ["logs"] });
    },
  });

  const inlineMutation = useMutation({
    mutationFn: async ({ id, dados }) => {
      const res = await api.patch(`/os/${id}/inline`, dados);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ordens"] });
      queryClient.invalidateQueries({ queryKey: ["logs"] });
    },
  });
  const pecasMutation = useMutation({
    mutationFn: async ({ numeroOS, dados }) => {
      const res = await api.patch(`/os/numero/${numeroOS}/pecas`, dados);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ordens"] });
      queryClient.invalidateQueries({ queryKey: ["logs"] });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/os/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ordens"] });
      queryClient.invalidateQueries({ queryKey: ["nextNumber"] });

      console.log("✅ Cache de ordens e numeração atualizados!");
    },
  });

  return {
    ordens,
    opcoes,
    nextNumber,
    loading: loadingOs || loadingOptions,

    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isUpdatingInline: inlineMutation.isPending,
    isLancingPecas: pecasMutation.isPending,

    useCreateOs: createMutation.mutateAsync,
    useUpdateOs: (id, formData) => updateMutation.mutateAsync({ id, formData }),
    useUpdateInline: (id, dados) => inlineMutation.mutateAsync({ id, dados }),
    useDeleteOs: deleteMutation.mutateAsync,
    useGetOs: () => queryClient.invalidateQueries({ queryKey: ["ordens"] }),
    useLancarPecas: (numeroOS, dados) =>
      pecasMutation.mutateAsync({ numeroOS, dados }),
    useGetOptions: () =>
      queryClient.invalidateQueries({ queryKey: ["opcoes"] }),
    useGetNextNumber: () =>
      queryClient.invalidateQueries({ queryKey: ["nextNumber"] }),
  };
};
