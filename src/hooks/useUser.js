import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

export const useUser = () => {
  const queryClient = useQueryClient();

  // Busca todos os usuários (Objetos completos com ID, Nome, Email, Funções)
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
      queryClient.invalidateQueries({ queryKey: ["opcoes"] });
    },
  });

  // ADICIONADO: Mutação para Editar
  const updateMutation = useMutation({
    mutationFn: ({ id, dados }) => api.put(`/users/${id}`, dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["opcoes"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["opcoes"] });
    },
  });

  return {
    usuarios, // Lista completa para usarmos o .find()
    loading: isLoading,
    createUser: createMutation.mutateAsync,
    updateUser: updateMutation.mutateAsync, // Exportando o update
    deleteUser: deleteMutation.mutateAsync,
  };
};
