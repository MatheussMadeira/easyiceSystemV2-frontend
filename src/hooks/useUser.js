import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

export const useUser = () => {
  const queryClient = useQueryClient();

  // 1. Busca todos os usuários
  const { data: usuarios = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await api.get("/users");
      return res.data;
    },
  });

  // 2. Mutações padrão (Create, Update, Delete)
  const createMutation = useMutation({
    mutationFn: (dados) => api.post("/users", dados),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, dados }) => api.put(`/users/${id}`, dados),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/users/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  // 3. ADICIONADO: Mutação específica para Senha (com tratamento de erro)
  const passwordMutation = useMutation({
    mutationFn: async ({ userId, senhaAtual, novaSenha }) => {
      const res = await api.put(`/users/${userId}/senha`, {
        senhaAtual,
        novaSenha,
      });
      return res.data;
    },
  });

  // Função auxiliar para facilitar o uso no componente
  const updatePassword = async (userId, senhaAtual, novaSenha) => {
    try {
      const data = await passwordMutation.mutateAsync({
        userId,
        senhaAtual,
        novaSenha,
      });
      return { success: true, data };
    } catch (error) {
      const message = error.response?.data?.erro || "Erro ao atualizar senha.";
      return { success: false, error: message };
    }
  };

  return {
    usuarios,
    loading: isLoading || passwordMutation.isPending, // isLoading do Query + isPending da Senha
    updatePassword,
    createUser: createMutation.mutateAsync,
    updateUser: updateMutation.mutateAsync,
    deleteUser: deleteMutation.mutateAsync,
  };
};
