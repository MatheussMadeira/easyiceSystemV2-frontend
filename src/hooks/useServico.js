import { useState, useCallback } from "react";
import api from "../services/api";
import Swal from "sweetalert2";
export const useServico = () => {
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);

  const swalConfig = {
    background: "#18181b",
    color: "#fff",
    confirmButtonColor: "#3b82f6",
  };
  const updateServico = async (id, dados) => {
    setLoading(true);
    try {
      const response = await api.put(`/servico/${id}`, dados);
      setServicos((prev) =>
        prev.map((s) => (s._id === id ? response.data : s))
      );
      return { success: true };
    } catch (error) {
      Swal.fire({ ...swalConfig, title: "Erro ao atualizar", icon: "error" });
      return { success: false };
    } finally {
      setLoading(false);
    }
  };
  const fetchServicos = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/servico");
      setServicos(response.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createServico = async (dados) => {
    setLoading(true);
    try {
      const response = await api.post("/servico", dados);
      setServicos((prev) => [...prev, response.data]);
      return { success: true, data: response.data };
    } catch (error) {
      Swal.fire({
        ...swalConfig,
        title: "Erro ao criar",
        text: error.response?.data?.erro || "Falha na comunicação com servidor",
        icon: "error",
      });
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const registrarExecucao = async (id) => {
    try {
      const response = await api.patch(`/servico/executar/${id}`);

      setServicos((prev) =>
        prev.map((s) => (s._id === id ? response.data : s))
      );

      return { success: true, data: response.data };
    } catch (error) {
      Swal.fire({
        ...swalConfig,
        title: "Erro ao registrar",
        text: "Não foi possível atualizar a próxima execução.",
        icon: "error",
      });
      return { success: false };
    }
  };

  const deleteServico = async (id) => {
    try {
      await api.delete(`/servico/${id}`);
      setServicos((prev) => prev.filter((s) => s._id !== id));
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  };
  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/servico/logs");
      setLogs(response.data);
    } catch (error) {
      console.error("Erro ao buscar logs:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    servicos,
    loading,
    logs,
    fetchLogs,
    fetchServicos,
    createServico,
    registrarExecucao,
    deleteServico,
    updateServico,
  };
};
