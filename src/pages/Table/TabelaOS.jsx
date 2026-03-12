import React, { useState, useMemo } from "react";
import { useOS } from "../../hooks/useOS";
import { useUser } from "../../hooks/useUser";
import { useAuth } from "../../hooks/useAuth";
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

  // Hooks de Dados e Autenticação
  const { useDeleteOs, useUpdateInline } = useOS();
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

  // Estados de filtro
  const [filtros, setFiltros] = useState({
    buscaGlobal: "",
    setor: [],
    situacao: [],
    prioridade: [],
    executor: [],
    solicitante: [],
  });

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
    OBS: "obs", // Andamento / Processo
    DESC_FECHAMENTO: "desc_fechamento", // Relatório Final
    FECHAMENTO: "fechamento",
    PECAS: "pecas",
    VALOR: "valor",
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
        Swal.fire("Removido!", "O usuário foi excluído.", "success");
        setModalUsuarioAberto(false);
      } catch (err) {
        const msg = err.response?.data?.erro || "Não foi possível excluir.";
        Swal.fire("Erro", msg, "error");
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
        Swal.fire("Sucesso", "Usuário atualizado com sucesso!", "success");
      } else {
        await createUser(payload);
        Swal.fire("Sucesso", "Novo usuário cadastrado!", "success");
      }
      setModalUsuarioAberto(false);
    } catch (err) {
      const msg = err.response?.data?.erro || "Erro ao processar solicitação.";
      Swal.fire("Erro", msg, "error");
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
      if (colunasVisiveis.includes(IDS_COLUNAS.DESC_FECHAMENTO))
        linha["Relatório Final"] = os.descricaoFechamento || "-";
      if (colunasVisiveis.includes(IDS_COLUNAS.FECHAMENTO))
        linha["Data Fechamento"] = os.dataFechamento
          ? new Date(os.dataFechamento).toLocaleDateString()
          : "-";
      if (colunasVisiveis.includes(IDS_COLUNAS.PECAS))
        linha["Peças Utilizadas"] = os.pecasUtilizadas || "-";
      if (colunasVisiveis.includes(IDS_COLUNAS.VALOR))
        linha["Valor R$"] = os.valorPecas || "0,00";

      return linha;
    });

    const worksheet = XLSX.utils.json_to_sheet(dadosParaExportar);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Relatório OS");
    XLSX.writeFile(
      workbook,
      `Relatorio_OS_${new Date().toLocaleDateString().replace(/\//g, "-")}.xlsx`
    );
    Swal.fire("Sucesso", "Relatório exportado!", "success");
  };

  // --- BUSCA DE DADOS (React Query) ---
  const { data: ordens = [], isLoading } = useQuery({
    queryKey: ["ordens"],
    queryFn: async () => {
      const res = await api.get("/os");
      return res.data;
    },
    enabled: !!signed,
    refetchOnWindowFocus: false,
  });

  const { data: opcoes } = useQuery({
    queryKey: ["opcoes"],
    queryFn: async () => {
      const res = await api.get("/os/opcoes");
      return res.data;
    },
    enabled: !!signed,
    staleTime: 600000,
  });

  const handleLimparTudo = () => {
    setFiltros({
      buscaGlobal: "",
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

  const ordensFiltradas = useMemo(() => {
    return ordens.filter((os) => {
      const normalizar = (texto) => {
        if (!texto) return "";
        return texto
          .toString()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .trim();
      };

      const buscaLimpa = normalizar(filtros.buscaGlobal);
      const regex = new RegExp(buscaLimpa, "i");

      const matchBusca =
        !buscaLimpa ||
        regex.test(normalizar(os.numeroOS)) ||
        regex.test(normalizar(os.equipamento)) ||
        regex.test(normalizar(os.descricaoAbertura)) ||
        regex.test(normalizar(os.descricaoProcesso)) || // Pesquisa no andamento
        regex.test(normalizar(os.descricaoFechamento)) || // Pesquisa no fechamento
        regex.test(normalizar(os.setor)) ||
        regex.test(normalizar(os.solicitante)) ||
        regex.test(normalizar(os.executor));

      const matchSetor =
        filtros.setor.length === 0 ||
        filtros.setor.some((s) => normalizar(s) === normalizar(os.setor));
      const matchSituacao =
        filtros.situacao.length === 0 || filtros.situacao.includes(os.situacao);
      const matchExecutor =
        filtros.executor.length === 0 ||
        filtros.executor.some((e) => normalizar(e) === normalizar(os.executor));
      const matchSolicitante =
        filtros.solicitante.length === 0 ||
        filtros.solicitante.some(
          (s) => normalizar(s) === normalizar(os.solicitante)
        );
      const matchPrioridade =
        filtros.prioridade.length === 0 ||
        filtros.prioridade.some(
          (s) => normalizar(s) === normalizar(os.prioridade)
        );

      return (
        matchBusca &&
        matchSetor &&
        matchSituacao &&
        matchExecutor &&
        matchSolicitante &&
        matchPrioridade
      );
    });
  }, [ordens, filtros]);

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
    try {
      await useUpdateInline(id, { [campo]: valor });
    } catch (err) {
      const msg = err.response?.data?.erro || "Sem permissão para alterar.";
      Swal.fire({ title: "Acesso Negado", text: msg, icon: "error" });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Excluir esta OS?",
      text: "Você tem certeza disso?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Sim, deletar",
    });

    if (result.isConfirmed) {
      try {
        await useDeleteOs(id);
        Swal.fire("Sucesso", "Ordem de serviço removida.", "success");
      } catch (err) {
        Swal.fire(
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
      CANCELADA: { bg: "rgba(239, 68, 68, 0.15)", text: "#ef4444" },
    };
    return configs[status] || { bg: "#18181b", text: "#71717a" };
  };

  const getPriorityStyles = (p) => {
    if (p?.includes("Emergencia"))
      return { bg: "rgba(168, 85, 247, 0.15)", text: "#a855f7" };
    if (p?.includes("Alta"))
      return { bg: "rgba(239, 68, 68, 0.15)", text: "#ef4444" };
    return { bg: "rgba(113, 113, 122, 0.15)", text: "#a1a1aa" };
  };

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
                {/* LARGURA AUMENTADA PARA DESCRIÇÃO DE ABERTURA */}
                {colunasVisiveis.includes(IDS_COLUNAS.DESCRICAO) && (
                  <S.Th style={{ width: "450px" }}>Descrição</S.Th>
                )}
                {colunasVisiveis.includes(IDS_COLUNAS.STATUS) && (
                  <S.Th style={{ width: "160px" }}>Status</S.Th>
                )}
                {colunasVisiveis.includes(IDS_COLUNAS.PRIORIDADE) && (
                  <S.Th style={{ width: "160px" }}>Prioridade</S.Th>
                )}
                {colunasVisiveis.includes(IDS_COLUNAS.FOTO_INI) && (
                  <S.Th style={{ width: "80px" }}>Foto</S.Th>
                )}
                {/* LARGURA AUMENTADA PARA OBS TÉCNICA (ANDAMENTO) */}
                {colunasVisiveis.includes(IDS_COLUNAS.OBS) && (
                  <S.Th style={{ width: "400px" }}>
                    Obs. Técnica (Andamento)
                  </S.Th>
                )}
                {/* LARGURA AUMENTADA PARA DESCRIÇÃO DE FECHAMENTO */}
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
                {colunasVisiveis.includes(IDS_COLUNAS.FOTO_FIM) && (
                  <S.Th style={{ width: "80px" }}>Foto Fim</S.Th>
                )}
                {colunasVisiveis.includes(IDS_COLUNAS.ACOES) && (
                  <S.Th style={{ width: "80px" }}>Ações</S.Th>
                )}
              </S.TrHeader>
            </thead>
            <tbody>
              {ordensFiltradas.map((os) => {
                const sStyles = getStatusStyles(os.situacao);
                const pStyles = getPriorityStyles(os.prioridade);
                return (
                  <tr key={os._id}>
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
                      <S.TdSelect>
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
                              aoSelecionar={(v) =>
                                handleUpdate(os._id, "setor", v)
                              }
                              onClose={() => setPopoverAberto(null)}
                              acaoCriar={createSetor}
                              acaoDeletar={deleteSetor}
                            />
                          )}
                      </S.TdSelect>
                    )}
                    {colunasVisiveis.includes(IDS_COLUNAS.SOLICITANTE) && (
                      <S.TdSelect>
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
                              aoSelecionar={(v) =>
                                handleUpdate(os._id, "solicitante", v)
                              }
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
                      <S.TdSelect>
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
                              aoSelecionar={(v) =>
                                handleUpdate(os._id, "executor", v)
                              }
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
                      <S.TdSelect>
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
                              opcoes={["EM ABERTO", "EM PROCESSO", "CONCLUÍDO"]}
                              valorAtual={os.situacao}
                              aoSelecionar={(v) =>
                                handleUpdate(os._id, "situacao", v)
                              }
                              onClose={() => setPopoverAberto(null)}
                            />
                          )}
                      </S.TdSelect>
                    )}
                    {colunasVisiveis.includes(IDS_COLUNAS.PRIORIDADE) && (
                      <S.TdSelect>
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
                              aoSelecionar={(v) =>
                                handleUpdate(os._id, "prioridade", v)
                              }
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
                    {colunasVisiveis.includes(IDS_COLUNAS.DESC_FECHAMENTO) && (
                      <S.TdTexto>
                        <S.EditableTextarea
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
                      <S.Td>R$ {os.valorPecas || "0,00"}</S.Td>
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
                    {colunasVisiveis.includes(IDS_COLUNAS.ACOES) && (
                      <S.Td>
                        <S.ActionButton onClick={() => handleDelete(os._id)}>
                          ❌
                        </S.ActionButton>
                      </S.Td>
                    )}
                  </tr>
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
