import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

export const useLogs = () => {
  const queryClient = useQueryClient();

  // --- BUSCAS (Queries) ---

  // 1. Buscar todos os Logs
  const {
    data: logs = [],
    isLoading: loadingLogs,
    isRefetching: refetchingLogs,
    error: errorLogs,
  } = useQuery({
    queryKey: ["logs"],
    queryFn: async () => {
      const res = await api.get("/logs");
      return res.data;
    },
    // Logs não mudam com tanta frequência, então 1 minuto de staleTime está ótimo
    staleTime: 1000 * 60 * 1,
  });

  return {
    logs,
    loadingLogs,
    refetchingLogs,
    errorLogs,
    // Função para forçar a atualização dos logs manualmente se precisar
    refreshLogs: () => queryClient.invalidateQueries({ queryKey: ["logs"] }),
  };
};
