import { useState } from "react";
import api from "../services/api";

export const useOS = () => {
  const [ordens, setOrdens] = useState([]);
  const [osSelecionada, setOsSelecionada] = useState(null);
  const [loading, setLoading] = useState(false);
  const [nextNumber, setNextNumber] = useState(null);

  const [opcoes, setOpcoes] = useState({
    setores: [],
    solicitantes: [],
    executores: [],
    prioridades: [],
    situacoes: [],
  });

  const useGetNextNumber = async () => {
    try {
      const response = await api.get("/os/proximo-numero");
      setNextNumber(response.data.proximo);
    } catch (error) {
      console.error("Erro ao buscar próximo número:", error);
    }
  };

  const useUpdateInline = async (id, dados) => {
    try {
      const response = await api.patch(`/os/${id}/inline`, dados);
      
      setOrdens((prev) =>
        prev.map((os) => (os._id === id ? { ...os, ...response.data } : os))
      );
  
      return response.data;
    } catch (error) {
      console.error("Erro no update inline:", error);
      throw error;
    }
  };

  const useGetOs = async () => {
    setLoading(true);
    try {
      const response = await api.get("/os");
      setOrdens(response.data);
    } catch (error) {
      console.error(
        "Erro ao ler ordens:",
        error.response?.data?.erro || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const useGetOptions = async () => {
    try {
      const response = await api.get("/os/opcoes");
      setOpcoes(response.data);
    } catch (error) {
      console.error("Erro ao carregar opções:", error.response?.data?.erro);
    }
  };

  const useCreateOs = async (formData) => {
    try {
      const response = await api.post("/os", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      useGetOs();
      useGetNextNumber();
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.erro || "Erro ao criar OS");
    }
  };

  const useUpdateOs = async (id, formData) => {
    try {
      const response = await api.put(`/os/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      useGetOs();
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.erro || "Erro ao atualizar OS");
    }
  };

  const useFindById = async (id) => {
    try {
      const response = await api.get(`/os/${id}`);
      setOsSelecionada(response.data);
      return response.data;
    } catch (error) {
      console.error("OS não encontrada:", error.response?.data?.erro);
    }
  };

  const useDeleteOs = async (id) => {
    try {
      await api.delete(`/os/${id}`);
      setOrdens((prev) => prev.filter((os) => os._id !== id));
    } catch (error) {
      alert(error.response?.data?.erro || "Erro ao deletar OS");
    }
  };

  return {
    ordens,
    osSelecionada,
    opcoes,
    loading,
    useGetOs,
    useGetOptions,
    useCreateOs,
    useUpdateOs,
    useFindById,
    useDeleteOs,
    nextNumber,
    useGetNextNumber,
    useUpdateInline,
  };
};
