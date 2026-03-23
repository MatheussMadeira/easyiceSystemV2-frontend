import React, { useState, useMemo, useEffect } from "react";
import { useOS } from "../../hooks/useOS";
import { useUser } from "../../hooks/useUser";
import { useAuth } from "../../services/AuthProvider.jsx";
import { useSettings } from "../../hooks/useSettings";
import * as S from "./styles";
import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";
import { useNavigate, useLocation } from "react-router-dom";
import * as H from "../../components/MenuHamburguer/menu";
import SeletorGrade from "../../components/PopoverTable/PopoverTable";
import ModalBase from "../../components/Modal/ModalBase";
import Swal from "sweetalert2";
import MenuGlobal from "../../components/MenuHamburguer/menu.jsx";
import FiltroAvancado from "../../components/FiltroAvancado/FiltroAvancado.jsx";
import * as XLSX from "xlsx";
import SeletorColunas from "../../components/SeletorColunas/SeletorColunas.jsx";

const TabelaOS = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [filtros, setFiltros] = useState({
    buscaGlobal: "",
    numeroOS: "",
    setor: [],
    situacao: [],
    prioridade: [],
    executor: [],
    solicitante: [],
  });

  const prepararFiltrosParaAPI = useMemo(() => {
    const params = {};
    Object.keys(filtros).forEach((key) => {
      const valor = filtros[key];

      const queryKey = key === "buscaGlobal" ? "busca" : key;

      if (Array.isArray(valor) && valor.length > 0) {
        params[queryKey] = valor.join(",");
      } else if (typeof valor === "string" && valor.trim() !== "") {
        params[queryKey] = valor;
      }
    });
    return params;
  }, [filtros]);

  const {
    ordens,
    useDeleteOs,
    useUpdateInline,
    isDeleting,
    isUpdatingInline,
    isLoading,
  } = useOS(prepararFiltrosParaAPI);

  const swalConfig = {
    background: "#09090b",
    color: "#fafafa",
    confirmButtonColor: "#3b82f6",
    cancelButtonColor: "#27272a",
  };

  const { signed, user, logout } = useAuth();
  const { usuarios, createUser, updateUser, deleteUser } = useUser();
  const { create: createSetor, remove: deleteSetor } = useSettings("setores");

  // Estados de Interface
  const [isNavigating, setIsNavigating] = useState(false);
  const [popoverAberto, setPopoverAberto] = useState(null);

  // Estados para Gestão de Usuário
  const [modalUsuarioAberto, setModalUsuarioAberto] = useState(false);
  const [usuarioParaEditar, setUsuarioParaEditar] = useState(null);
  const [dadosUsuario, setDadosUsuario] = useState({
    nome: "",
    email: "",
    password: "",
    funcoes: [],
  });

  const handleLimparTudo = () => {
    setFiltros({
      buscaGlobal: "",
      numeroOS: "",
      setor: [],
      situacao: [],
      prioridade: [],
      executor: [],
      solicitante: [],
    });
    setColunasVisiveis(Object.values(IDS_COLUNAS));
    setAbaFiltroAberta(false);
    setSeletorAberto(false);
  };
  const formatarDataEntrega = (dataString) => {
    if (!dataString) return "-";
    const data = new Date(dataString);
    return data.toLocaleDateString("pt-BR", { timeZone: "UTC" });
  };
  const IDS_COLUNAS = {
    NUMERO: "numeroOS",
    ABERTURA: "abertura",
    SETOR: "setor",
    SOLICITANTE: "solicitante",
    EXECUTOR: "executor",
    EQUIPAMENTO: "equipamento",
    DESCRICAO: "descricao",
    STATUS: "status",
    PRIORIDADE: "prioridade",
    FOTO_INI: "foto_inicio",
    OBS: "obs",
    DATA_PREVISTA: "data_prevista",
    PRONTO_EM: "pronto_em",
    DESC_FECHAMENTO: "desc_fechamento",
    FECHAMENTO: "fechamento",
    PECAS: "pecas",
    VALOR: "valor",
    MAO_DE_OBRA: "valorMaoDeObra",
    VALOR_TOTAL: "valorTotal",
    FOTO_FIM: "foto_fim",
    ACOES: "acoes",
  };

  const [abaFiltroAberta, setAbaFiltroAberta] = useState(false);
  const [seletorAberto, setSeletorAberto] = useState(false);
  const [colunasVisiveis, setColunasVisiveis] = useState(
    Object.values(IDS_COLUNAS)
  );

  // --- LOGICA DE USUÁRIOS ---
  const handleDeletarUsuario = async () => {
    if (!usuarioParaEditar) return;
    const result = await Swal.fire({
      ...swalConfig,
      title: `Remover ${usuarioParaEditar.nome}?`,
      text: "Isso excluirá o acesso deste usuário ao sistema.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deleteUser(usuarioParaEditar._id);
        Swal.fire(
          ...swalConfig,
          "Removido!",
          "O usuário foi excluído.",
          "success"
        );
        setModalUsuarioAberto(false);
      } catch (err) {
        const msg = err.response?.data?.erro || "Não foi possível excluir.";
        Swal.fire(...swalConfig, "Erro", msg, "error");
      }
    }
  };

  const prepararEdicao = (nomeDoUsuario) => {
    const userEncontrado = usuarios.find(
      (u) => u.nome.toLowerCase().trim() === nomeDoUsuario.toLowerCase().trim()
    );
    if (userEncontrado) {
      setUsuarioParaEditar(userEncontrado);
      setDadosUsuario({
        nome: userEncontrado.nome,
        email: userEncontrado.email,
        funcoes: userEncontrado.funcoes.join(", "),
        password: "",
      });
      setModalUsuarioAberto(true);
      setPopoverAberto(null);
    }
  };

  const handleSalvarUsuario = async () => {
    try {
      const funcoesArray =
        typeof dadosUsuario.funcoes === "string"
          ? dadosUsuario.funcoes.split(",").map((f) => f.trim().toUpperCase())
          : dadosUsuario.funcoes;

      const payload = { ...dadosUsuario, funcoes: funcoesArray };

      if (usuarioParaEditar) {
        await updateUser({ id: usuarioParaEditar._id, dados: payload });
        Swal.fire(
          ...swalConfig,
          "Sucesso",
          "Usuário atualizado com sucesso!",
          "success"
        );
      } else {
        await createUser(payload);
        Swal.fire(
          ...swalConfig,
          "Sucesso",
          "Novo usuário cadastrado!",
          "success"
        );
      }
      setModalUsuarioAberto(false);
    } catch (err) {
      const msg = err.response?.data?.erro || "Erro ao processar solicitação.";
      Swal.fire(...swalConfig, "Erro", msg, "error");
    }
  };

  const toggleColuna = (id) => {
    setColunasVisiveis((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleExportarExcel = () => {
    if (ordensFiltradas.length === 0) {
      return Swal.fire(
        ...swalConfig,
        "Aviso",
        "Não há dados filtrados para exportar.",
        "info"
      );
    }

    const dadosParaExportar = ordensFiltradas.map((os) => {
      const linha = {};
      if (colunasVisiveis.includes(IDS_COLUNAS.NUMERO))
        linha["Nº OS"] = os.numeroOS;
      if (colunasVisiveis.includes(IDS_COLUNAS.ABERTURA))
        linha["Data Abertura"] = new Date(os.createdAt).toLocaleDateString();
      if (colunasVisiveis.includes(IDS_COLUNAS.SETOR))
        linha["Setor"] = os.setor;
      if (colunasVisiveis.includes(IDS_COLUNAS.SOLICITANTE))
        linha["Solicitante"] = os.solicitante;
      if (colunasVisiveis.includes(IDS_COLUNAS.EXECUTOR))
        linha["Executor"] = os.executor || "Não Atribuído";
      if (colunasVisiveis.includes(IDS_COLUNAS.EQUIPAMENTO))
        linha["Equipamento"] = os.equipamento;
      if (colunasVisiveis.includes(IDS_COLUNAS.DESCRICAO))
        linha["Descrição"] = os.descricaoAbertura;
      if (colunasVisiveis.includes(IDS_COLUNAS.STATUS))
        linha["Status"] = os.situacao;
      if (colunasVisiveis.includes(IDS_COLUNAS.PRIORIDADE))
        linha["Prioridade"] = os.prioridade;
      if (colunasVisiveis.includes(IDS_COLUNAS.OBS))
        linha["Obs Técnica (Andamento)"] = os.descricaoProcesso || "-";
      if (colunasVisiveis.includes(IDS_COLUNAS.DATA_PREVISTA))
        linha["Data prevista para finalização"] = os.dataPrevista || "-";
      if (colunasVisiveis.includes(IDS_COLUNAS.PRONTO_EM)) {
        linha["Pronto para Finalizar em"] = os.dataParaConcluir
          ? new Date(os.dataParaConcluir).toLocaleDateString()
          : "-";
      }
      if (colunasVisiveis.includes(IDS_COLUNAS.DESC_FECHAMENTO))
        linha["Relatório Final"] = os.descricaoFechamento || "-";
      if (colunasVisiveis.includes(IDS_COLUNAS.FECHAMENTO))
        linha["Data Fechamento"] = os.dataFechamento
          ? new Date(os.dataFechamento).toLocaleDateString()
          : "-";
      if (colunasVisiveis.includes(IDS_COLUNAS.PECAS))
        linha["Peças Utilizadas"] = os.pecasUtilizadas || "-";

      if (colunasVisiveis.includes(IDS_COLUNAS.VALOR)) {
        linha["Valor Peças R$"] = Number(os.valorPecas || 0).toLocaleString(
          "pt-BR",
          {
            minimumFractionDigits: 2,
          }
        );
      }

      if (colunasVisiveis.includes(IDS_COLUNAS.MAO_DE_OBRA)) {
        const valorMDO = Number(os.valorMaoDeObra || 0);
        linha["Valor Mão de Obra R$"] = valorMDO.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        });
      }

      if (colunasVisiveis.includes(IDS_COLUNAS.VALOR_TOTAL)) {
        const total =
          Number(os.valorPecas || 0) + Number(os.valorMaoDeObra || 0);
        linha["Valor Total R$"] = total.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        });
      }

      return linha;
    });

    const worksheet = XLSX.utils.json_to_sheet(dadosParaExportar);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Relatório OS");
    XLSX.writeFile(
      workbook,
      `Relatorio_OS_${new Date().toLocaleDateString().replace(/\//g, "-")}.xlsx`
    );
    Swal.fire(...swalConfig, "Sucesso", "Relatório exportado!", "success");
  };

  const { data: opcoes } = useQuery({
    queryKey: ["opcoes"],
    queryFn: async () => {
      const res = await api.get("/os/opcoes");
      return res.data;
    },
    enabled: !!signed,
    staleTime: 600000,
  });

  const ordensFiltradas = ordens;

  const toggleFiltro = (categoria, valor) => {
    setFiltros((prev) => {
      const listaAtual = prev[categoria];
      const novaLista = listaAtual.includes(valor)
        ? listaAtual.filter((item) => item !== valor)
        : [...listaAtual, valor];
      return { ...prev, [categoria]: novaLista };
    });
  };

  const handleUpdate = async (id, campo, valor) => {
    if (isUpdatingInline) return;
    try {
      await useUpdateInline(id, { [campo]: valor });
      setPopoverAberto(null);
    } catch (err) {
      const msg = err.response?.data?.erro || "Sem permissão para alterar.";
      Swal.fire({
        ...swalConfig,
        title: "Acesso Negado",
        text: msg,
        icon: "error",
      });
    }
  };

  const handleDelete = async (id) => {
    if (isDeleting) return;
    const result = await Swal.fire({
      ...swalConfig,
      title: "Excluir esta OS?",
      text: "Você tem certeza disso?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, deletar",
    });

    if (result.isConfirmed) {
      try {
        await useDeleteOs(id);
        Swal.fire(
          ...swalConfig,
          "Sucesso",
          "Ordem de serviço removida.",
          "success"
        );
      } catch (err) {
        Swal.fire(
          ...swalConfig,
          "Acesso Negado",
          err.response?.data?.erro || "Erro ao deletar",
          "error"
        );
      }
    }
  };

  const getStatusStyles = (status) => {
    const configs = {
      CONCLUÍDO: { bg: "rgba(16, 185, 129, 0.15)", text: "#10b981" },
      "EM PROCESSO": { bg: "rgba(59, 130, 246, 0.15)", text: "#3b82f6" },
      "EM ABERTO": { bg: "rgba(245, 158, 11, 0.15)", text: "#f59e0b" },
      "PRONTO PARA FINALIZAÇÃO": {
        bg: "rgba(153, 197, 86, 0.15)",
        text: "#97c552",
      },
    };
    return configs[status] || { bg: "#18181b", text: "#71717a" };
  };

  const getPriorityStyles = (p) => {
    const priority = p?.toUpperCase() || "";

    if (priority.includes("EMERGENCIA"))
      return { bg: "rgba(168, 85, 247, 0.15)", text: "#a855f7" };

    if (priority.includes("ALTA"))
      return { bg: "rgba(239, 68, 68, 0.15)", text: "#ef4444" };

    return { bg: "rgba(0, 217, 255, 0.15)", text: "#01d9ff" };
  };
  useEffect(() => {
    const handleClickFora = (event) => {
      if (event.target.closest(".seletor-container")) {
        return;
      }

      setPopoverAberto(null);
    };

    if (popoverAberto) {
      document.addEventListener("click", handleClickFora);
    }

    return () => {
      document.removeEventListener("click", handleClickFora);
    };
  }, [popoverAberto]);
  return (
    <div style={{ backgroundColor: "#09090b", minHeight: "100vh" }}>
      {(isLoading || isNavigating) && (
        <H.TransitionOverlay>
          <H.Spinner />
          <h2>Sincronizando base de dados...</h2>
        </H.TransitionOverlay>
      )}
      <MenuGlobal />
      <S.PaginaContainer>
        <S.HeaderFixo>
          <div
            style={{
              display: "flex",
              gap: "15px",
              alignItems: "center",
              width: "100%",
              position: "relative",
            }}
          >
            <S.InputBusca
              placeholder="Pesquisar..."
              value={filtros.buscaGlobal}
              onChange={(e) =>
                setFiltros({ ...filtros, buscaGlobal: e.target.value })
              }
              style={{ width: "300px" }}
            />
            <button
              onClick={() => setAbaFiltroAberta(!abaFiltroAberta)}
              style={{
                background: abaFiltroAberta ? "#3b82f6" : "#18181b",
                color: "#fff",
                border: "1px solid #27272a",
                padding: "8px 16px",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>🔍</span> Filtros
              {Object.values(filtros)
                .flat()
                .filter((v) => v !== filtros.buscaGlobal && v.length > 0)
                .length > 0 && (
                <span
                  style={{
                    background: "#fff",
                    color: "#3b82f6",
                    borderRadius: "50%",
                    width: "18px",
                    height: "18px",
                    fontSize: "11px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {
                    Object.values(filtros)
                      .flat()
                      .filter((v) => v !== filtros.buscaGlobal && v.length > 0)
                      .length
                  }
                </span>
              )}
            </button>
            {abaFiltroAberta && (
              <FiltroAvancado
                opcoes={opcoes}
                filtros={filtros}
                toggleFiltro={toggleFiltro}
                onClose={() => setAbaFiltroAberta(false)}
                setFiltros={setFiltros}
              />
            )}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setSeletorAberto(!seletorAberto)}
                style={{
                  background: "#18181b",
                  color: "#fff",
                  border: "1px solid #27272a",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>⚙️</span> Colunas
              </button>
              {seletorAberto && (
                <SeletorColunas
                  colunasVisiveis={colunasVisiveis}
                  toggleColuna={toggleColuna}
                  IDS_COLUNAS={IDS_COLUNAS}
                  onClose={() => setSeletorAberto(false)}
                />
              )}
            </div>
            <button
              style={{
                background: "#f64e3b",
                color: "#fff",
                border: "1px solid #27272a",
                padding: "8px 16px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
              onClick={handleLimparTudo}
            >
              Limpar tudo
            </button>
          </div>
          <button
            onClick={handleExportarExcel}
            style={{
              background: "#16a34a",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              marginLeft: "auto",
              marginRight: "20px",
            }}
          >
            📊 Exportar
          </button>
          <div style={{ color: "#71717a", fontSize: "14px" }}>
            Exibindo <strong>{ordensFiltradas.length}</strong> de{" "}
            {ordens.length}
          </div>
        </S.HeaderFixo>

        <S.TabelaWrapper>
          <S.TabelaStyled>
            <thead>
              <S.TrHeader>
                {colunasVisiveis.includes(IDS_COLUNAS.NUMERO) && (
                  <S.Th style={{ width: "100px" }}>Nº OS</S.Th>
                )}
                {colunasVisiveis.includes(IDS_COLUNAS.ABERTURA) && (
                  <S.Th style={{ width: "120px" }}>Abertura</S.Th>
                )}
                {colunasVisiveis.includes(IDS_COLUNAS.SETOR) && (
                  <S.Th style={{ width: "200px" }}>Setor</S.Th>
                )}
                {colunasVisiveis.includes(IDS_COLUNAS.SOLICITANTE) && (
                  <S.Th style={{ width: "180px" }}>Solicitante</S.Th>
                )}
                {colunasVisiveis.includes(IDS_COLUNAS.EXECUTOR) && (
                  <S.Th style={{ width: "180px" }}>Executor</S.Th>
                )}
                {colunasVisiveis.includes(IDS_COLUNAS.EQUIPAMENTO) && (
                  <S.Th style={{ width: "200px" }}>Equipamento</S.Th>
                )}
                {colunasVisiveis.includes(IDS_COLUNAS.DESCRICAO) && (
                  <S.Th style={{ width: "450px" }}>Descrição</S.Th>
                )}
                {colunasVisiveis.includes(IDS_COLUNAS.STATUS) && (
                  <S.Th style={{ width: "250px" }}>Status</S.Th>
                )}
                {colunasVisiveis.includes(IDS_COLUNAS.PRIORIDADE) && (
                  <S.Th style={{ width: "160px" }}>Prioridade</S.Th>
                )}
                {colunasVisiveis.includes(IDS_COLUNAS.FOTO_INI) && (
                  <S.Th style={{ width: "80px" }}>Foto</S.Th>
                )}
                {colunasVisiveis.includes(IDS_COLUNAS.OBS) && (
                  <S.Th style={{ width: "400px" }}>
                    Obs. Técnica (Andamento)
                  </S.Th>
                )}
                {colunasVisiveis.includes(IDS_COLUNAS.DATA_PREVISTA) && (
                  <S.Th style={{ width: "120px" }}>
                    Data Prevista para Finazalização
                  </S.Th>
                )}
                {colunasVisiveis.includes(IDS_COLUNAS.DESC_FECHAMENTO) && (
                  <S.Th style={{ width: "400px" }}>Descrição Fechamento</S.Th>
                )}
                {colunasVisiveis.includes(IDS_COLUNAS.FECHAMENTO) && (
                  <S.Th style={{ width: "120px" }}>Fechamento</S.Th>
                )}
                {colunasVisiveis.includes(IDS_COLUNAS.PECAS) && (
                  <S.Th style={{ width: "200px" }}>Peças</S.Th>
                )}
                {colunasVisiveis.includes(IDS_COLUNAS.VALOR) && (
                  <S.Th style={{ width: "120px" }}>Valor R$</S.Th>
                )}
                {colunasVisiveis.includes(IDS_COLUNAS.MAO_DE_OBRA) && (
                  <S.Th style={{ width: "120px" }}>Valor Mao de Obra R$</S.Th>
                )}
                {colunasVisiveis.includes(IDS_COLUNAS.VALOR_TOTAL) && (
                  <S.Th style={{ width: "120px" }}>Valor Total R$</S.Th>
                )}
                {colunasVisiveis.includes(IDS_COLUNAS.FOTO_FIM) && (
                  <S.Th style={{ width: "80px" }}>Foto Fim</S.Th>
                )}
                {colunasVisiveis.includes(IDS_COLUNAS.PRONTO_EM) && (
                  <S.Th style={{ width: "120px" }}>Técnico Finalizou em</S.Th>
                )}
                {colunasVisiveis.includes(IDS_COLUNAS.ACOES) && (
                  <S.Th style={{ width: "80px" }}>Ações</S.Th>
                )}
              </S.TrHeader>
            </thead>
            <tbody>
              {ordensFiltradas.map((os) => {
                const processando = isDeleting || isUpdatingInline;
                const sStyles = getStatusStyles(os.situacao);
                const pStyles = getPriorityStyles(os.prioridade);
                return (
                  <S.TrCorpo key={os._id} $isPending={processando}>
                    {colunasVisiveis.includes(IDS_COLUNAS.NUMERO) && (
                      <S.Td style={{ fontWeight: "600", color: "#3b82f6" }}>
                        #{os.numeroOS}
                      </S.Td>
                    )}
                    {colunasVisiveis.includes(IDS_COLUNAS.ABERTURA) && (
                      <S.Td style={{ color: "#52525b" }}>
                        {new Date(os.createdAt).toLocaleDateString()}
                      </S.Td>
                    )}
                    {colunasVisiveis.includes(IDS_COLUNAS.SETOR) && (
                      <S.TdSelect
                        disabled={processando}
                        className="seletor-container"
                      >
                        <div
                          onClick={() =>
                            setPopoverAberto({ id: os._id, field: "setor" })
                          }
                          style={{
                            cursor: "pointer",
                            padding: "8px",
                            background: "#1f1f23",
                            borderRadius: "4px",
                          }}
                        >
                          {os.setor}
                        </div>
                        {popoverAberto?.id === os._id &&
                          popoverAberto?.field === "setor" && (
                            <SeletorGrade
                              tipo="setor"
                              opcoes={opcoes?.setores}
                              valorAtual={os.setor}
                              aoSelecionar={(v) => {
                                handleUpdate(os._id, "setor", v);
                              }}
                              onClose={() => setPopoverAberto(null)}
                              acaoCriar={createSetor}
                              acaoDeletar={deleteSetor}
                            />
                          )}
                      </S.TdSelect>
                    )}
                    {colunasVisiveis.includes(IDS_COLUNAS.SOLICITANTE) && (
                      <S.TdSelect
                        disabled={processando}
                        className="seletor-container"
                      >
                        <div
                          onClick={() =>
                            setPopoverAberto({
                              id: os._id,
                              field: "solicitante",
                            })
                          }
                          style={{
                            cursor: "pointer",
                            padding: "6px",
                            background: "rgba(59, 130, 246, 0.1)",
                            color: "#3b82f6",
                            borderRadius: "4px",
                          }}
                        >
                          {os.solicitante}
                        </div>
                        {popoverAberto?.id === os._id &&
                          popoverAberto?.field === "solicitante" && (
                            <SeletorGrade
                              tipo="solicitante"
                              opcoes={opcoes?.solicitantes}
                              valorAtual={os.solicitante}
                              aoSelecionar={(v) => {
                                handleUpdate(os._id, "solicitante", v);
                              }}
                              onClose={() => setPopoverAberto(null)}
                              acaoCriarUsuario={() => {
                                setModalUsuarioAberto(true);
                                setUsuarioParaEditar(null);
                              }}
                              acaoEditarUsuario={prepararEdicao}
                            />
                          )}
                      </S.TdSelect>
                    )}
                    {colunasVisiveis.includes(IDS_COLUNAS.EXECUTOR) && (
                      <S.TdSelect
                        disabled={processando}
                        className="seletor-container"
                      >
                        <div
                          onClick={() =>
                            setPopoverAberto({ id: os._id, field: "executor" })
                          }
                          style={{
                            cursor: "pointer",
                            padding: "6px",
                            background: os.executor
                              ? "rgba(16, 185, 129, 0.1)"
                              : "#18181b",
                            color: os.executor ? "#10b981" : "#71717a",
                            borderRadius: "4px",
                          }}
                        >
                          {os.executor || "Não Atribuído"}
                        </div>
                        {popoverAberto?.id === os._id &&
                          popoverAberto?.field === "executor" && (
                            <SeletorGrade
                              tipo="executor"
                              opcoes={opcoes?.executores}
                              valorAtual={os.executor}
                              aoSelecionar={(v) => {
                                handleUpdate(os._id, "executor", v);
                              }}
                              onClose={() => setPopoverAberto(null)}
                              acaoCriarUsuario={() => {
                                setModalUsuarioAberto(true);
                                setUsuarioParaEditar(null);
                              }}
                              acaoEditarUsuario={prepararEdicao}
                            />
                          )}
                      </S.TdSelect>
                    )}
                    {colunasVisiveis.includes(IDS_COLUNAS.EQUIPAMENTO) && (
                      <S.TdTexto>
                        <S.EditableTextarea
                          disabled={processando}
                          defaultValue={os.equipamento}
                          onBlur={(e) =>
                            handleUpdate(os._id, "equipamento", e.target.value)
                          }
                        />
                      </S.TdTexto>
                    )}
                    {colunasVisiveis.includes(IDS_COLUNAS.DESCRICAO) && (
                      <S.TdTexto>
                        <S.EditableTextarea
                          disabled={processando}
                          defaultValue={os.descricaoAbertura}
                          onBlur={(e) =>
                            handleUpdate(
                              os._id,
                              "descricaoAbertura",
                              e.target.value
                            )
                          }
                        />
                      </S.TdTexto>
                    )}
                    {colunasVisiveis.includes(IDS_COLUNAS.STATUS) && (
                      <S.TdSelect
                        disabled={processando}
                        className="seletor-container"
                      >
                        <div
                          onClick={() =>
                            setPopoverAberto({ id: os._id, field: "situacao" })
                          }
                          style={{
                            cursor: "pointer",
                            padding: "6px",
                            background: sStyles.bg,
                            color: sStyles.text,
                            borderRadius: "4px",
                            fontWeight: "600",
                          }}
                        >
                          {os.situacao}
                        </div>
                        {popoverAberto?.id === os._id &&
                          popoverAberto?.field === "situacao" && (
                            <SeletorGrade
                              opcoes={[
                                "EM ABERTO",
                                "EM PROCESSO",
                                "CONCLUÍDO",
                                "PRONTO PARA FINALIZAR",
                              ]}
                              valorAtual={os.situacao}
                              aoSelecionar={(v) => {
                                handleUpdate(os._id, "situacao", v);
                              }}
                              onClose={() => setPopoverAberto(null)}
                            />
                          )}
                      </S.TdSelect>
                    )}
                    {colunasVisiveis.includes(IDS_COLUNAS.PRIORIDADE) && (
                      <S.TdSelect
                        disabled={processando}
                        className="seletor-container"
                      >
                        <div
                          onClick={() =>
                            setPopoverAberto({
                              id: os._id,
                              field: "prioridade",
                            })
                          }
                          style={{
                            cursor: "pointer",
                            padding: "6px",
                            background: pStyles.bg,
                            color: pStyles.text,
                            borderRadius: "4px",
                          }}
                        >
                          {os.prioridade?.split(" ")[0]}
                        </div>
                        {popoverAberto?.id === os._id &&
                          popoverAberto?.field === "prioridade" && (
                            <SeletorGrade
                              opcoes={[
                                "Normal (Sequência de execução)",
                                "Alta (No decorrer do dia)",
                                "Emergencia (Atendimento Imediato)",
                              ]}
                              valorAtual={os.prioridade}
                              aoSelecionar={(v) => {
                                handleUpdate(os._id, "prioridade", v);
                              }}
                              onClose={() => setPopoverAberto(null)}
                            />
                          )}
                      </S.TdSelect>
                    )}
                    {colunasVisiveis.includes(IDS_COLUNAS.FOTO_INI) && (
                      <S.Td>
                        <S.FotoWrapper>
                          {os.arquivoAbertura ? (
                            <a
                              href={os.arquivoAbertura}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <S.FotoThumbnail>
                                <img
                                  src={`${os.arquivoAbertura}?t=${new Date(
                                    os.createdAt
                                  ).getTime()}`}
                                  alt="Foto"
                                />
                              </S.FotoThumbnail>
                            </a>
                          ) : (
                            <S.FotoThumbnail className="vazio" />
                          )}
                        </S.FotoWrapper>
                      </S.Td>
                    )}
                    {colunasVisiveis.includes(IDS_COLUNAS.OBS) && (
                      <S.TdTexto>
                        <S.EditableTextarea
                          disabled={processando}
                          placeholder="Andamento..."
                          defaultValue={os.descricaoProcesso || ""}
                          onBlur={(e) =>
                            handleUpdate(
                              os._id,
                              "descricaoProcesso",
                              e.target.value
                            )
                          }
                        />
                      </S.TdTexto>
                    )}
                    {colunasVisiveis.includes(IDS_COLUNAS.DATA_PREVISTA) && (
                      <S.Td>
                        {os.dataPrevista ? (
                          (() => {
                            const dataAjustada = new Date(os.dataPrevista);
                            dataAjustada.setMinutes(
                              dataAjustada.getMinutes() +
                                dataAjustada.getTimezoneOffset()
                            );
                            const isAtrasada =
                              new Date(dataAjustada).setHours(0, 0, 0, 0) <
                                new Date().setHours(0, 0, 0, 0) &&
                              os.situacao !== "CONCLUÍDO";
                            return (
                              <div
                                style={{
                                  color: isAtrasada ? "#ef4444" : "#f97316", // Vermelho se atrasado, Laranja se no prazo
                                  fontWeight: "600",
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "2px",
                                }}
                              >
                                {dataAjustada.toLocaleDateString("pt-BR")}
                                {isAtrasada && (
                                  <span
                                    style={{
                                      fontSize: "9px",
                                      color: "#ef4444",
                                      fontWeight: "800",
                                    }}
                                  >
                                    ⚠️ ATRASADA
                                  </span>
                                )}
                              </div>
                            );
                          })()
                        ) : (
                          <span style={{ color: "#71717a" }}>-</span>
                        )}
                      </S.Td>
                    )}
                    {colunasVisiveis.includes(IDS_COLUNAS.DESC_FECHAMENTO) && (
                      <S.TdTexto>
                        <S.EditableTextarea
                          disabled={processando}
                          placeholder="Relatório final..."
                          defaultValue={os.descricaoFechamento || ""}
                          onBlur={(e) =>
                            handleUpdate(
                              os._id,
                              "descricaoFechamento",
                              e.target.value
                            )
                          }
                        />
                      </S.TdTexto>
                    )}
                    {colunasVisiveis.includes(IDS_COLUNAS.FECHAMENTO) && (
                      <S.Td>
                        {os.dataFechamento
                          ? new Date(os.dataFechamento).toLocaleDateString()
                          : "-"}
                      </S.Td>
                    )}
                    {colunasVisiveis.includes(IDS_COLUNAS.PECAS) && (
                      <S.TdTexto>
                        <S.EditableTextarea
                          disabled={processando}
                          defaultValue={os.pecasUtilizadas}
                          onBlur={(e) =>
                            handleUpdate(
                              os._id,
                              "pecasUtilizadas",
                              e.target.value
                            )
                          }
                        />
                      </S.TdTexto>
                    )}
                    {colunasVisiveis.includes(IDS_COLUNAS.VALOR) && (
                      <S.Td style={{ fontWeight: "bold" }}>
                        R${" "}
                        {Number(os.valorPecas || 0).toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </S.Td>
                    )}

                    {colunasVisiveis.includes(IDS_COLUNAS.MAO_DE_OBRA) && (
                      <S.Td style={{ fontWeight: "bold" }}>
                        R${" "}
                        {Number(os.valorMaoDeObra || 0).toLocaleString(
                          "pt-BR",
                          {
                            minimumFractionDigits: 2,
                          }
                        )}
                      </S.Td>
                    )}

                    {colunasVisiveis.includes(IDS_COLUNAS.VALOR_TOTAL) && (
                      <S.Td
                        style={{
                          color: "#3b82f6",
                          fontWeight: "bold",
                        }}
                      >
                        R${" "}
                        {(
                          Number(os.valorPecas || 0) +
                          Number(os.valorMaoDeObra || 0)
                        ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </S.Td>
                    )}
                    {colunasVisiveis.includes(IDS_COLUNAS.FOTO_FIM) && (
                      <S.Td>
                        <S.FotoWrapper>
                          {os.arquivoFechamento ? (
                            <a
                              href={os.arquivoFechamento}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <S.FotoThumbnail>
                                <img
                                  src={`${os.arquivoFechamento}?t=${new Date(
                                    os.updatedAt
                                  ).getTime()}`}
                                  alt="Foto"
                                />
                              </S.FotoThumbnail>
                            </a>
                          ) : (
                            <S.FotoThumbnail className="vazio" />
                          )}
                        </S.FotoWrapper>
                      </S.Td>
                    )}
                    {colunasVisiveis.includes(IDS_COLUNAS.PRONTO_EM) && (
                      <S.Td>
                        {os.dataParaConcluir ? (
                          (() => {
                            const dataPronto = new Date(os.dataParaConcluir);
                            const agora = new Date();

                            const diffHoras =
                              Math.abs(agora - dataPronto) / (1000 * 60 * 60);

                            const aguardandoMuito =
                              diffHoras > 24 &&
                              os.situacao === "PRONTO PARA FINALIZAR";

                            return (
                              <div
                                style={{
                                  color: aguardandoMuito
                                    ? "#ef4444"
                                    : "#22c55e",
                                  fontWeight: "600",
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "2px",
                                }}
                              >
                                {dataPronto.toLocaleDateString("pt-BR")}
                                {aguardandoMuito && (
                                  <span
                                    style={{
                                      fontSize: "9px",
                                      color: "#ef4444",
                                      fontWeight: "800",
                                    }}
                                  >
                                    ⏳ AGUARDANDO SOLICITANTE (
                                    {Math.floor(diffHoras)}h)
                                  </span>
                                )}
                              </div>
                            );
                          })()
                        ) : (
                          <span style={{ color: "#71717a" }}>-</span>
                        )}
                      </S.Td>
                    )}
                    {colunasVisiveis.includes(IDS_COLUNAS.ACOES) && (
                      <S.Td>
                        <S.ActionButton
                          onClick={() => handleDelete(os._id)}
                          disabled={processando}
                        >
                          {isDeleting ? "⏳" : "❌"}
                        </S.ActionButton>
                      </S.Td>
                    )}
                  </S.TrCorpo>
                );
              })}
            </tbody>
          </S.TabelaStyled>
        </S.TabelaWrapper>
      </S.PaginaContainer>

      <ModalBase
        isOpen={modalUsuarioAberto}
        onClose={() => setModalUsuarioAberto(false)}
        title={usuarioParaEditar ? "Editar Usuário" : "Novo Usuário"}
        data={dadosUsuario}
        setData={setDadosUsuario}
        onSubmit={handleSalvarUsuario}
        fields={[
          { name: "nome", label: "Nome Completo", type: "text" },
          { name: "email", label: "E-mail", type: "email" },
          {
            name: "password",
            label: usuarioParaEditar ? "Senha (vazio para manter)" : "Senha",
            type: "password",
          },
          {
            name: "funcoes",
            label: "Funções (ADMIN, SOLICITANTE, EXECUTOR)",
            type: "text",
          },
        ]}
        footerActions={
          usuarioParaEditar && (
            <button
              onClick={handleDeletarUsuario}
              style={{
                backgroundColor: "#ef4444",
                color: "white",
                padding: "8px 16px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                marginRight: "auto",
              }}
            >
              Excluir Usuário
            </button>
          )
        }
      />
    </div>
  );
};

export default TabelaOS;
