import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

export const useUser = () => {
  const queryClient = useQueryClient();

  // Busca todos os usuários (Técnicos, Solicitantes, Admins)
  const { data: usuarios = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await api.get("/users");
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (dados) => api.post("/users", dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["opcoes"] }); // Atualiza os selects da Home
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/users/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  return {
    usuarios,
    loading: isLoading,
    createUser: createMutation.mutateAsync,
    deleteUser: deleteMutation.mutateAsync,
  };
};
