import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
export const useSettings = (recurso) => {
  const queryClient = useQueryClient();

  const { data: itens = [], isLoading } = useQuery({
    queryKey: [recurso],
    queryFn: async () => {
      const res = await api.get(`/${recurso}`);
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (novo) => api.post(`/${recurso}`, novo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [recurso] });
      queryClient.invalidateQueries({ queryKey: ["opcoes"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/${recurso}/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [recurso] }),
  });

  return {
    itens,
    loading: isLoading,
    create: createMutation.mutateAsync,
    remove: deleteMutation.mutateAsync,
  };
};
