import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import * as S from "./styles";
import { X, Calendar, Search, Edit3 } from "lucide-react";
import { useServico } from "../../hooks/useServico";
import SeletorGrade from "../PopoverTable/PopoverTable";
import { useOS } from "../../hooks/useOS";

const ModalAdicionarServico = ({ isOpen, onClose, opcoes }) => {
  const {
    createServico,
    updateServico,
    fetchServicos,
    servicos,
    loading,
    fetchLogs,
  } = useServico();
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    setor: "",
    executorPadrao: "",
    periodicidadeDias: 15,
  });
  const { opcoesFiltros, fetchFiltros } = useOS();

  useEffect(() => {
    fetchServicos();
    fetchLogs();
    fetchFiltros;
  }, [fetchServicos, fetchLogs, fetchFiltros]);

  const [editandoId, setEditandoId] = useState(null);
  const [campoAberto, setCampoAberto] = useState(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const triggerRefs = useRef({});

  if (!isOpen) return null;

  const handleSelecionarParaEditar = (nomeServico) => {
    const servico = servicos.find((s) => s.nome === nomeServico);
    if (servico) {
      setEditandoId(servico._id);
      setFormData({
        nome: servico.nome,
        descricao: servico.descricao || "",
        setor: servico.setor,
        executorPadrao: servico.executorPadrao,
        periodicidadeDias: servico.periodicidadeDias,
      });
    }
  };

  const handleAbrirSeletor = (fieldName) => {
    if (loading) return;
    if (campoAberto === fieldName) {
      setCampoAberto(null);
    } else {
      const element = triggerRefs.current[fieldName];
      if (element) {
        const rect = element.getBoundingClientRect();
        setCoords({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
        });
        setCampoAberto(fieldName);
      }
    }
  };

  const limparForm = () => {
    setEditandoId(null);
    setFormData({
      nome: "",
      descricao: "",
      setor: "",
      executorPadrao: "",
      periodicidadeDias: 15,
    });
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Se tiver um ID, chama Update, se não, chama Create
    const result = editandoId
      ? await updateServico(editandoId, formData)
      : await createServico(formData);

    if (result.success) {
      limparForm();
      onClose();
    }
  };

  const sugestoesDias = ["7", "15", "30", "60", "90", "180", "365"];
  return (
    <S.Overlay onClick={loading ? null : onClose}>
      <S.ModalContainer onClick={(e) => e.stopPropagation()}>
        <S.Header>
          <h2>
            <Calendar size={20} color="#3b82f6" />
            {editandoId ? "Editar Serviço de Rotina" : "Novo Serviço Frequente"}
          </h2>
          <button
            onClick={() => {
              limparForm();
              onClose();
            }}
            disabled={loading}
          >
            &times;
          </button>
        </S.Header>

        <S.Form onSubmit={handleSubmit}>
          {/* SEÇÃO DE BUSCA PARA EDIÇÃO */}
          <S.InputGroup>
            <label
              style={{
                color: "#3b82f6",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <Search size={14} /> Deseja editar um serviço existente?
            </label>
            <S.SeletorTrigger
              ref={(el) => (triggerRefs.current["buscaServico"] = el)}
              type="button"
              onClick={() => handleAbrirSeletor("buscaServico")}
              disabled={loading}
              style={{
                borderStyle: "dashed",
                borderColor: editandoId ? "#3b82f6" : "#27272a",
              }}
            >
              <span>
                {editandoId
                  ? `Editando: ${formData.nome}`
                  : "Selecione para carregar os dados..."}
              </span>
              <span className="seta">▾</span>
            </S.SeletorTrigger>
            {editandoId && (
              <button
                type="button"
                onClick={limparForm}
                style={{
                  background: "none",
                  border: "none",
                  color: "#ef4444",
                  fontSize: "11px",
                  cursor: "pointer",
                  textAlign: "left",
                  marginTop: "5px",
                }}
              >
                ✕ Cancelar edição e criar novo
              </button>
            )}
          </S.InputGroup>

          <hr style={{ border: "0.5px solid #27272a", margin: "10px 0" }} />

          <S.InputGroup>
            <label>Nome do Serviço</label>
            <input
              name="nome"
              disabled={loading}
              placeholder="Ex: Limpeza de Ar"
              value={formData.nome}
              onChange={(e) => handleChange("nome", e.target.value)}
              required
            />
          </S.InputGroup>

          <S.InputGroup>
            <label>Periodicidade (Dias entre cada execução)</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="number"
                name="periodicidadeDias"
                placeholder="Ex: 15"
                min="1"
                value={formData.periodicidadeDias}
                onChange={(e) =>
                  handleChange("periodicidadeDias", e.target.value)
                }
                style={{ flex: 1 }}
              />
              <S.SeletorTrigger
                ref={(el) => (triggerRefs.current["periodicidadeDias"] = el)}
                type="button"
                onClick={() => handleAbrirSeletor("periodicidadeDias")}
                style={{ width: "140px" }}
              >
                <span>Sugestões</span>
                <span className="seta">▾</span>
              </S.SeletorTrigger>
            </div>
          </S.InputGroup>

          <S.InputGroup>
            <label>Setor Responsável</label>
            <S.SeletorTrigger
              ref={(el) => (triggerRefs.current["setor"] = el)}
              type="button"
              onClick={() => handleAbrirSeletor("setor")}
              $temValor={!!formData.setor}
              disabled={loading}
            >
              <span>{formData.setor || "Selecione o setor..."}</span>
              <span className="seta">▾</span>
            </S.SeletorTrigger>
          </S.InputGroup>

          <S.InputGroup>
            <label>Executor Padrão</label>
            <S.SeletorTrigger
              ref={(el) => (triggerRefs.current["executorPadrao"] = el)}
              type="button"
              onClick={() => handleAbrirSeletor("executorPadrao")}
              $temValor={!!formData.executorPadrao}
              disabled={loading}
            >
              <span>{formData.executorPadrao || "Selecione o técnico..."}</span>
              <span className="seta">▾</span>
            </S.SeletorTrigger>
          </S.InputGroup>

          <S.InputGroup>
            <label>Descrição</label>
            <textarea
              disabled={loading}
              value={formData.descricao}
              onChange={(e) => handleChange("descricao", e.target.value)}
              placeholder="Detalhes da rotina..."
            />
          </S.InputGroup>

          <S.Footer>
            <button
              type="button"
              className="btn-cancel"
              onClick={() => {
                limparForm();
                onClose();
              }}
              disabled={loading}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading
                ? "Salvando..."
                : editandoId
                  ? "Salvar Alterações"
                  : "Confirmar Criação"}
            </button>
          </S.Footer>
        </S.Form>

        {campoAberto &&
          createPortal(
            <S.PopoverWrapper
              style={{
                position: "absolute",
                top: coords.top + 4,
                left: coords.left,
                width: coords.width,
                zIndex: 10001,
              }}
            >
              <SeletorGrade
                opcoes={
                  campoAberto === "buscaServico"
                    ? servicos?.map((s) => s.nome) || []
                    : campoAberto === "periodicidadeDias"
                      ? sugestoesDias
                      : campoAberto === "setor"
                        ? opcoes?.setores || []
                        : (opcoes?.executores || [])?.map((e) =>
                            typeof e === "object" ? e.nome : e,
                          )
                }
                valorAtual={
                  campoAberto === "buscaServico" ? "" : formData[campoAberto]
                }
                aoSelecionar={(valor) => {
                  if (campoAberto === "buscaServico") {
                    handleSelecionarParaEditar(valor);
                  } else {
                    const valorFinal =
                      campoAberto === "periodicidadeDias"
                        ? parseInt(valor)
                        : valor;
                    handleChange(campoAberto, valorFinal);
                  }
                  setCampoAberto(null);
                }}
                onClose={() => setCampoAberto(null)}
              />
            </S.PopoverWrapper>,
            document.body,
          )}
      </S.ModalContainer>
    </S.Overlay>
  );
};

export default ModalAdicionarServico;
