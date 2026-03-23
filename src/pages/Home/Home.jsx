import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useOS } from "../../hooks/useOS";
import { useServico } from "../../hooks/useServico.js";
import { useAuth } from "../../services/AuthProvider.jsx";
import ModalBase from "../../components/Modal/ModalBase";
import ModalExecutor from "../../components/ModalExecutor/ModalExecutor";
import * as S from "./styles";
import Swal from "sweetalert2";
import MenuGlobal from "../../components/MenuHamburguer/menu.jsx";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen.jsx";
import ModalAdicionarServico from "../../components/ModalAddServico/ModalAddServico.jsx";
import { Calendar, AlertCircle, CheckCircle, Plus } from "lucide-react";
export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signed, user, login, logout, loadingAuth } = useAuth();
  useEffect(() => {
    fetchServicos();
  }, []);
  useEffect(() => {
    if (!signed) {
      navigate("/login");
    }
  }, [signed, navigate]);
  const {
    ordens,
    loading,
    opcoes,
    nextNumber,
    useCreateOs,
    useUpdateOs,
    useLancarPecas,
    opcoesFiltros,
    isCreating,
    isUpdating,
    isLancingPecas,
  } = useOS();
  const { servicos, registrarExecucao, fetchServicos } = useServico();

  const [modalAberto, setModalAberto] = useState(false);
  const [modalFechamentoAberto, setModalFechamentoAberto] = useState(false);
  const [modalExecutorAberto, setModalExecutorAberto] = useState(false);
  const [podeFechar, setPodeFechar] = useState(false);

  const [osFiltradas, setOsFiltradas] = useState([]);
  const [executorNome, setExecutorNome] = useState("");
  const [isSolicitante, setIsSolicitante] = useState("");

  const [dadosModal, setDadosModal] = useState({});
  const [osAtual, setOsAtual] = useState(null);
  const [numeroOSParaBuscar, setNumeroOSParaBuscar] = useState("");
  const [menuAberto, setMenuAberto] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isModoFinalizacao, setIsModoFinalizacao] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [isModalOSOpen, setIsModalOSOpen] = useState(false);
  const [isModalFrequenteOpen, setIsModalFrequenteOpen] = useState(false);

  if (!signed) return null;
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });
  const swalConfig = {
    background: "#09090b",
    color: "#fafafa",
    confirmButtonColor: "#3b82f6",
    cancelButtonColor: "#27272a",
  };

  const handleNavigation = (path) => {
    if (location.pathname === path) {
      setMenuAberto(false);
      return;
    }
    setIsNavigating(true);
    setTimeout(() => navigate(path), 500);
  };
  const minhasRotinasPendentes = useMemo(() => {
    if (!servicos.length || !user?.nome) return [];

    const hoje = new Date();
    hoje.setHours(23, 59, 59, 999);

    return servicos.filter((s) => {
      const nomeLogado =
        user?.nome?.trim().toUpperCase() || "NOME_NAO_ENCONTRADO";
      const nomeExecutor =
        s.executorPadrao?.trim().toUpperCase() || "SEM_EXECUTOR";
      const eMeu = nomeExecutor === nomeLogado;
      const estaAtivo = s.ativo === true;

      const dataVencimento = new Date(s.proximaExecucao);
      const estaVencido = dataVencimento <= hoje;
      return eMeu;
    });
  }, [servicos, user?.nome]);
  const ajustarParaDiaUtil = (data) => {
    const novaData = new Date(data);
    const diaSemana = novaData.getDay();

    if (diaSemana === 0) {
      novaData.setDate(novaData.getDate() + 1);
    } else if (diaSemana === 6) {
      novaData.setDate(novaData.getDate() + 2);
    }
    return novaData;
  };

  const calcularDiasUteisEntre = (dataPlanejada, dataReferencia) => {
    const dataAlvo = new Date(dataPlanejada);
    const hoje = new Date(dataReferencia);

    dataAlvo.setHours(0, 0, 0, 0);
    hoje.setHours(0, 0, 0, 0);

    let contador = 0;
    let atual = new Date(dataAlvo);
    const reverso = atual < hoje;

    while (reverso ? atual < hoje : atual > hoje) {
      const dia = atual.getDay();
      if (dia !== 0 && dia !== 6) contador++;
      atual.setDate(atual.getDate() + (reverso ? 1 : -1));
    }

    return reverso ? contador : -contador;
  };
  const calcularDiasRestantes = (dataVencimento) => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const vencimento = new Date(dataVencimento);
    vencimento.setHours(0, 0, 0, 0);

    const diffTime = vencimento - hoje;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  const podeConcluirServico = (proximaExecucao, periodicidade) => {
    const hoje = new Date();
    const dataEsperada = new Date(proximaExecucao);

    const diasUteisDeDiferenca = calcularDiasUteisEntre(dataEsperada, hoje);
    const diasAbsolutos = Math.abs(diasUteisDeDiferenca);

    let margemPermitida = 0;
    if (periodicidade < 30) margemPermitida = 2;
    else if (periodicidade <= 31)
      margemPermitida = 5; // 5 dias ÚTEIS (uma semana cheia)
    else if (periodicidade <= 95)
      margemPermitida = 10; // 10 dias ÚTEIS (duas semanas)
    else if (periodicidade <= 185) margemPermitida = 20;
    else margemPermitida = 30;

    return {
      permitido: diasAbsolutos <= margemPermitida,
      margem: margemPermitida,
      atrasoReal: diasUteisDeDiferenca,
    };
  };

  const handleConcluirRotina = async (id, nome) => {
    const result = await registrarExecucao(id);
    if (result.success) {
      Swal.fire({
        ...swalConfig,
        icon: "success",
        title: "Serviço Concluído!",
        text: `A próxima execução de "${nome}" foi agendada.`,
        background: "#18181b",
        color: "#fff",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  const handleCriarServicoFrequente = async (dadosDaRotina) => {
    const isAdmin = user?.funcoes?.includes("ADMIN");
    const isExecutor = user?.funcoes?.includes("EXECUTOR");

    if (!isAdmin && !isExecutor) {
      return Swal.fire({
        ...swalConfig,
        title: "Acesso Negado",
        text: "Apenas administradores ou técnicos podem cadastrar serviços frequentes.",
        icon: "error",
      });
    }

    try {
      const result = await createServico(dadosDaRotina);

      if (result.success) {
        setIsModalFrequenteOpen(false);

        Swal.fire({
          ...swalConfig,
          title: "Rotina Cadastrada! 📅",
          text: `O serviço "${dadosDaRotina.nome}" foi agendado com sucesso.`,
          icon: "success",
          timer: 3000,
          showConfirmButton: false,
        });
        fetchServicos();
      }
    } catch (err) {
      console.error("Erro ao criar serviço frequente:", err);
    }
  };
  const handleCriar = async () => {
    if (isCreating) return;
    const nomeUsuarioLogado = user?.nome?.toUpperCase().trim();
    const isAdmin = user?.funcoes?.includes("ADMIN");
    const solicitanteSelecionado = dadosModal.solicitante?.toUpperCase().trim();

    if (!isAdmin && solicitanteSelecionado !== nomeUsuarioLogado) {
      return Swal.fire({
        ...swalConfig,
        title: "Ação Inválida",
        text: `Você só pode abrir ordens de serviço em seu próprio nome (${user?.nome}).`,
        icon: "error",
        confirmButtonColor: "#3b82f6",
      });
    }

    const obrigatorios = fieldsAbertura
      .filter((f) => f.type !== "file")
      .map((f) => f.name);

    const faltantes = obrigatorios.filter(
      (campo) =>
        !dadosModal[campo] || dadosModal[campo].toString().trim() === "",
    );

    if (faltantes.length > 0 || !dadosModal.arquivoAbertura) {
      Toast.fire({
        ...swalConfig,
        icon: "warning",
        title: !dadosModal.arquivoAbertura
          ? "A foto de abertura é obrigatória!"
          : "Preencha todos os campos!",
      });
      return;
    }

    try {
      const formData = new FormData();
      Object.keys(dadosModal).forEach((key) =>
        formData.append(key, dadosModal[key]),
      );

      const novaOSDoBanco = await useCreateOs(formData);
      setModalAberto(false);
      setDadosModal({});

      Swal.fire({
        ...swalConfig,
        title: "OS Aberta com Sucesso! 🚀",
        text: `A Ordem de Serviço #${
          novaOSDoBanco?.numeroOS || nextNumber
        } foi registrada.`,
        icon: "success",
        showCancelButton: false,
        confirmButtonColor: "#25D366",
        confirmButtonText: "Enviar WhatsApp",
      }).then((result) => {
        if (result.isConfirmed)
          window.open(enviarNovaOSWhatsApp(novaOSDoBanco), "_blank");
      });
    } catch (err) {
      const msg = err.response?.data?.erro || "Não foi possível abrir a OS.";
      Swal.fire({ ...swalConfig, title: "Erro", text: msg, icon: "error" });
    }
  };
  const gerarMensagemProcesso = (os, dados) => {
    const dataFormatada = dados.dataPrevista
      ? new Date(dados.dataPrevista).toLocaleDateString("pt-BR", {
          timeZone: "UTC",
        })
      : "Não informada";

    return (
      `👨‍🔧 *OS EM ANDAMENTO - #${os.numeroOS}* ⚙️\n\n` +
      `🛠️ *TÉCNICO:* ${user.nome}\n` +
      `⚙️ *EQUIPAMENTO:* ${os.equipamento}\n` +
      `📝 *STATUS:* Iniciamos a manutenção.\n` +
      `📅 *PREVISÃO DE ENTREGA:* ${dataFormatada}\n` +
      `----------------------------------\n` +
      `💬 *OBSERVAÇÕES:* ${
        dados.descricaoProcesso || "Equipamento em análise técnica."
      }`
    );
  };
  const gerarMensagemPronto = (os, dados) => {
    return (
      `✅ *OS PRONTA PARA CONFERÊNCIA - #${os.numeroOS}* 🛠️\n\n` +
      `👤 *SOLICITANTE:* ${os.solicitante}\n` +
      `⚙️ *EQUIPAMENTO:* ${os.equipamento}\n` +
      `----------------------------------\n` +
      `📝 *STATUS:* O serviço foi concluído e os custos foram lançados.\n\n` +
      `👉 *POR FAVOR:* Acesse o sistema para conferir os valores e finalizar a ordem.`
    );
  };
  const handleAtualizarStatus = async () => {
    if (isUpdating || isLancingPecas) return;

    const novaSituacao = dadosModal.situacao;
    const isAdmin = user?.funcoes?.includes("ADMIN");
    const isExecutor = user?.funcoes?.includes("EXECUTOR");
    const isSolicitanteLogado = user?.funcoes?.includes("SOLICITANTE");

    if (
      (novaSituacao === "EM PROCESSO" ||
        novaSituacao === "PRONTO PARA FINALIZAÇÃO") &&
      !isExecutor &&
      !isAdmin
    ) {
      return Swal.fire({
        ...swalConfig,
        title: "Acesso Negado",
        text: "Apenas técnicos podem atualizar o andamento desta OS.",
        icon: "error",
      });
    }

    if (novaSituacao === "CONCLUÍDO" && !isSolicitanteLogado && !isAdmin) {
      return Swal.fire({
        ...swalConfig,
        title: "Acesso Negado",
        text: "A conclusão da OS deve ser feita pelo solicitante após conferência.",
        icon: "error",
      });
    }

    try {
      if (novaSituacao === "PRONTO PARA FINALIZAÇÃO") {
        const { pecasUtilizadas, valorPecas, valorMaoDeObra, dataPrevista } =
          dadosModal;

        if (!pecasUtilizadas || !valorMaoDeObra) {
          return Toast.fire({
            icon: "warning",
            title: "Preencha Peças e MDO!",
          });
        }

        await useLancarPecas(osAtual.numeroOS, {
          peca: pecasUtilizadas,
          valorPeca: Number(valorPecas || 0),
          valorMaoDeObra: Number(valorMaoDeObra || 0),
        });

        const statusForm = new FormData();
        statusForm.append("situacao", novaSituacao);
        statusForm.append("executor", dadosModal.executor || osAtual.executor);

        statusForm.append("dataParaConcluir", new Date().toISOString());

        if (dataPrevista) {
          statusForm.append("dataPrevista", dataPrevista);
        }

        await useUpdateOs(osAtual._id, statusForm);

        Swal.fire({
          ...swalConfig,
          title: "Custos Lançados! 💰",
          text: "A OS agora aguarda conferência do solicitante para ser concluída.",
          icon: "success",
          showCancelButton: false,
          confirmButtonText: "📱 Avisar no WhatsApp",
          confirmButtonColor: "#25D366",
        }).then((result) => {
          if (result.isConfirmed) {
            const msg = gerarMensagemPronto(osAtual, dadosModal);
            if (navigator.share) {
              navigator.share({ text: msg });
            } else {
              window.open(
                `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`,
                "_blank",
              );
            }
          }
        });
      } else {
        const formData = new FormData();

        Object.keys(dadosModal).forEach((key) => {
          const valor = dadosModal[key];
          if (valor instanceof File) {
            formData.append(key, valor);
          } else if (valor !== null && valor !== undefined) {
            if (typeof valor !== "object" || key === "dataPrevista") {
              formData.append(key, valor);
            }
          }
        });

        const osAtualizada = await useUpdateOs(osAtual._id, formData);

        if (novaSituacao === "CONCLUÍDO") {
          const textoWpp =
            `✅ *OS FINALIZADA - #${osAtual.numeroOS}* ✅\n\n` +
            `⚙️ *EQUIPAMENTO:* ${osAtual.equipamento}\n` +
            `👤 *SOLICITANTE:* ${osAtual.solicitante}\n` +
            `📝 *RELATÓRIO:* ${dadosModal.descricaoFechamento || "Serviço OK"}`;

          Swal.fire({
            ...swalConfig,
            title: "Finalizada!",
            text: `A OS #${osAtual.numeroOS} foi concluída.`,
            icon: "success",
            confirmButtonText: "📱 Avisar no WhatsApp",
            confirmButtonColor: "#25D366",
          }).then((result) => {
            if (result.isConfirmed) {
              window.open(
                `https://api.whatsapp.com/send?text=${encodeURIComponent(
                  textoWpp,
                )}`,
                "_blank",
              );
            }
          });
        } else {
          Swal.fire({ ...swalConfig, title: "Atualizado!", icon: "success" });
        }
      }

      setModalFechamentoAberto(false);
      setDadosModal({});
      setNumeroOSParaBuscar("");
    } catch (err) {
      console.error("Erro no processamento:", err);
      Swal.fire({
        ...swalConfig,
        title: "Erro",
        text: err.response?.data?.erro || "Erro ao processar alteração.",
        icon: "error",
      });
    }
  };
  function abrirDetalhes(nome, tipo) {
    const isAdmin = user?.funcoes?.includes("ADMIN");
    const nomeLogado = user?.nome?.toUpperCase().trim();

    const filtradas = ordens.filter((os) => {
      const nomeSolicitanteOS = os.solicitante?.toUpperCase().trim();
      const nomeExecutorOS = os.executor?.toUpperCase().trim();
      const status = os.situacao?.toUpperCase().trim();

      const pertenceAoSelecionado =
        (tipo === "Executor" ? os.executor : os.solicitante) === nome;

      const isPendente = [
        "ABERTO",
        "EM ABERTO",
        "EM PROCESSO",
        "PRONTO PARA FINALIZAÇÃO",
      ].includes(status);

      let permissaoAcesso = isAdmin;

      if (!isAdmin) {
        if (tipo === "Executor") {
          permissaoAcesso = nomeExecutorOS === nomeLogado;
        } else {
          permissaoAcesso = nomeSolicitanteOS === nomeLogado;
        }
      }

      return pertenceAoSelecionado && isPendente && permissaoAcesso;
    });

    setOsFiltradas(filtradas);
    setExecutorNome(nome);
    setIsSolicitante(tipo);
    setModalExecutorAberto(true);
  }

  const prepararFechamento = () => {
    const osEncontrada = ordens.find((os) => os.numeroOS == numeroOSParaBuscar);

    if (!osEncontrada)
      return Toast.fire({ icon: "warning", title: "OS não encontrada!" });

    if (osEncontrada.situacao === "CONCLUÍDO")
      return Swal.fire({
        ...swalConfig,
        title: "Aviso",
        text: "Esta OS já está fechada!",
        icon: "info",
      });

    setOsAtual(osEncontrada);
    setDadosModal({ ...osEncontrada });
    setIsModoFinalizacao(false);
    setModalFechamentoAberto(true);
  };

  const calcularRanking = (campo) => {
    const mapa = ordens.reduce((acc, os) => {
      if (os.situacao === "CONCLUÍDO" || os.situacao === "CANCELADA")
        return acc;
      const nome =
        os[campo] || (campo === "executor" ? "Não Atribuído" : "Desconhecido");

      if (!acc[nome]) {
        acc[nome] = { aberto: 0, processo: 0, pronto: 0, total: 0 };
      }
      if (os.situacao === "EM ABERTO") {
        acc[nome].aberto++;
      } else if (os.situacao === "EM PROCESSO") {
        acc[nome].processo++;
      } else if (os.situacao === "PRONTO PARA FINALIZAÇÃO") {
        acc[nome].pronto++;
      }

      acc[nome].total++;
      return acc;
    }, {});

    return Object.entries(mapa)
      .map(([nome, stats]) => ({ nome, ...stats }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
  };

  const fieldsAbertura = [
    {
      name: "setor",
      label: "Setor",
      type: "select",
      options: (opcoes.setores || []).map((s) => ({ label: s, value: s })),
    },
    {
      name: "solicitante",
      label: "Solicitante",
      type: "select",
      options: (opcoes.solicitantes || []).map((s) => ({ label: s, value: s })),
    },
    {
      name: "executor",
      label: "Executor",
      type: "select",
      options: (opcoes.executores || []).map((e) => ({ label: e, value: e })),
    },
    {
      name: "prioridade",
      label: "Prioridade",
      type: "select",
      options: (opcoes.prioridades || []).map((p) => ({ label: p, value: p })),
    },
    { name: "equipamento", label: "Equipamento", type: "text" },
    {
      name: "descricaoAbertura",
      label: "Descrição do Problema",
      type: "textarea",
    },
    { name: "arquivoAbertura", label: "Anexar Foto", type: "file" },
  ];
  const isAdmin = user?.funcoes?.includes("ADMIN");
  const isExecutor = user?.funcoes?.includes("EXECUTOR");
  const isSolicitanteLogado = user?.funcoes?.includes("SOLICITANTE");

  const isDonoDaOS =
    user?.nome?.toUpperCase().trim() ===
    osAtual?.solicitante?.toUpperCase().trim();

  const fieldsFechamento = [
    {
      name: "situacao",
      label: "O que deseja fazer?",
      type: "select",
      options: [
        ...(!isModoFinalizacao && (isExecutor || isAdmin)
          ? [
              { label: "EM PROCESSO", value: "EM PROCESSO" },
              {
                label: "PRONTO PARA FINALIZAÇÃO",
                value: "PRONTO PARA FINALIZAÇÃO",
              },
            ]
          : []),
        ...(isModoFinalizacao && (isDonoDaOS || isAdmin)
          ? [{ label: "CONCLUÍDO", value: "CONCLUÍDO" }]
          : []),
      ],
    },

    ...(!isModoFinalizacao
      ? [
          {
            name: "executor",
            label: "Técnico Responsável",
            type: "select",
            options: (opcoes.executores || []).map((e) => ({
              label: e,
              value: e,
            })),
          },
        ]
      : []),

    ...(dadosModal.situacao === "EM PROCESSO"
      ? [
          {
            name: "descricaoProcesso",
            label: "Andamento / Observações Técnicas",
            type: "textarea",
          },
          {
            name: "dataPrevista",
            label: "Data Prevista de Entrega",
            type: "date",
          },
        ]
      : []),

    ...(dadosModal.situacao === "PRONTO PARA FINALIZAÇÃO"
      ? [
          { name: "pecasUtilizadas", label: "Peças Utilizadas", type: "text" },
          {
            name: "valorPecas",
            label: "Valor Total das Peças (R$)",
            type: "number",
          },
          {
            name: "valorMaoDeObra",
            label: "Valor da Mão de Obra (Obrigatório)",
            type: "number",
          },
        ]
      : []),

    ...(dadosModal.situacao === "CONCLUÍDO"
      ? [
          {
            name: "descricaoFechamento",
            label: "Relatório de Conferência (O que foi feito?)",
            type: "textarea",
          },
          {
            name: "arquivoFechamento",
            label: "Foto do Equipamento Funcionando",
            type: "file",
          },
        ]
      : []),
  ];

  const ossParaProcessar = useMemo(() => {
    if (isAdmin) return ordens;

    const nomeUser = user?.nome?.toUpperCase().trim();

    return ordens.filter((os) => {
      const nomeSolicitante = os.solicitante?.toUpperCase().trim();
      const nomeExecutor = os.executor?.toUpperCase().trim();

      return nomeSolicitante === nomeUser || nomeExecutor === nomeUser;
    });
  }, [ordens, user, isAdmin]);

  const rankingSolicitantesFiltrado = useMemo(() => {
    const nomeUser = user?.nome?.toUpperCase().trim();

    const agrupado = ossParaProcessar.reduce((acc, os) => {
      const nomeSolicitante = os.solicitante || "Sem Nome";
      const nomeSolicitanteUpper = nomeSolicitante.toUpperCase().trim();
      if (!isAdmin && nomeSolicitanteUpper !== nomeUser) return acc;

      if (!acc[nomeSolicitante])
        acc[nomeSolicitante] = {
          nome: nomeSolicitante,
          aberto: 0,
          processo: 0,
          pronto: 0,
        };

      const status = os.situacao?.toUpperCase().trim();
      if (status === "ABERTO" || status === "EM ABERTO")
        acc[nomeSolicitante].aberto++;
      if (status === "EM PROCESSO") acc[nomeSolicitante].processo++;
      if (status === "PRONTO PARA FINALIZAÇÃO") acc[nomeSolicitante].pronto++;

      return acc;
    }, {});

    return Object.values(agrupado).sort(
      (a, b) =>
        b.aberto + b.processo + b.pronto - (a.aberto + a.processo + a.pronto),
    );
  }, [ossParaProcessar, user, isAdmin]);

  const rankingExecutoresFiltrado = useMemo(() => {
    const nomeUser = user?.nome?.toUpperCase().trim();
    const agrupado = {};

    ossParaProcessar.forEach((os) => {
      const nomeExec = os.executor?.trim();
      const nomeExecUpper = nomeExec?.toUpperCase().trim();
      if (!nomeExec) return;

      if (!isAdmin && nomeExecUpper !== nomeUser) return;

      const status = os.situacao?.toUpperCase().trim();
      const isPendente = [
        "ABERTO",
        "EM ABERTO",
        "EM PROCESSO",
        "PRONTO PARA FINALIZAÇÃO",
      ].includes(status);
      if (!isPendente) return;

      if (!agrupado[nomeExec]) {
        agrupado[nomeExec] = {
          nome: nomeExec,
          aberto: 0,
          processo: 0,
          pronto: 0,
        };
      }

      if (status === "ABERTO" || status === "EM ABERTO")
        agrupado[nomeExec].aberto++;
      if (status === "EM PROCESSO") agrupado[nomeExec].processo++;
      if (status === "PRONTO PARA FINALIZAÇÃO") agrupado[nomeExec].pronto++;
    });

    return Object.values(agrupado);
  }, [ossParaProcessar, user, isAdmin]);

  const renderCardSolicitantes = (titulo) => (
    <S.Card>
      <h3>{titulo}</h3>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          marginBottom: "15px",
        }}
      >
        <small style={{ color: "#ef4444" }}>● Aberto</small>
        <small style={{ color: "#3b82f6" }}>● Em Processo</small>
        <small style={{ color: "#22c55e" }}>● Pronto para finalizar</small>
      </div>
      <S.RankingWrapper>
        {rankingSolicitantesFiltrado.map((item, idx) => (
          <S.RankingItem
            key={item.nome}
            onClick={() => abrirDetalhes(item.nome, "Solicitante")}
          >
            <span className="nome">
              {idx + 1}º {item.nome}
            </span>
            <div style={{ display: "flex", gap: "6px" }}>
              <S.Badge color="#ef4444">{item.aberto || 0}</S.Badge>
              <S.Badge color="#3b82f6">{item.processo || 0}</S.Badge>
              <S.Badge color="#22c55e">{item.pronto || 0}</S.Badge>
            </div>
          </S.RankingItem>
        ))}
      </S.RankingWrapper>
    </S.Card>
  );

  const renderCardExecutores = (titulo) => (
    <S.Card>
      <h3>{titulo}</h3>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          marginBottom: "15px",
        }}
      >
        <small style={{ color: "#ef4444" }}>● Aberto</small>
        <small style={{ color: "#3b82f6" }}>● Em Processo</small>
        <small style={{ color: "#22c55e" }}>● Pronto para finalizar</small>
      </div>
      <S.RankingWrapper>
        {rankingExecutoresFiltrado.map((item, idx) => (
          <S.RankingItem
            key={item.nome}
            onClick={() => abrirDetalhes(item.nome, "Executor")}
          >
            <span className="nome">
              {idx + 1}º {item.nome}
            </span>
            <div style={{ display: "flex", gap: "6px" }}>
              <S.Badge color="#ef4444">{item.aberto || 0}</S.Badge>
              <S.Badge color="#3b82f6">{item.processo || 0}</S.Badge>
              <S.Badge color="#22c55e">{item.pronto || 0}</S.Badge>
            </div>
          </S.RankingItem>
        ))}
      </S.RankingWrapper>
    </S.Card>
  );
  const enviarNovaOSWhatsApp = async (os) => {
    const linkFoto = os.arquivoAbertura
      ? `\n🖼️ *Link da Foto:* ${os.arquivoAbertura}`
      : "\n🖼️ *Foto:* Não anexada";

    const prioridadeCurta = os.prioridade
      ? os.prioridade.split(" ")[0].toUpperCase()
      : "NORMAL";

    const texto =
      `🚨 *NOVA ORDEM DE SERVIÇO - #${os.numeroOS}* 🚨\n\n` +
      `🔥 *PRIORIDADE:* ${prioridadeCurta}\n` +
      `----------------------------------\n` +
      `📍 *SETOR:* ${os.setor}\n` +
      `👤 *SOLICITANTE:* ${os.solicitante}\n` +
      `🛠️ *EXECUTOR:* ${os.executor || "A DEFINIR"}\n` +
      `⚙️ *EQUIPAMENTO:* ${os.equipamento}\n\n` +
      `📝 *DESCRIÇÃO DO PROBLEMA:* \n${os.descricaoAbertura}\n` +
      `----------------------------------` +
      linkFoto +
      `\n\n` +
      `📅 *DATA:* ${new Date().toLocaleDateString()} às ${new Date().toLocaleTimeString(
        [],
        { hour: "2-digit", minute: "2-digit" },
      )}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `OS #${os.numeroOS}`,
          text: texto,
        });
      } catch (err) {
        const urlFallback = `https://api.whatsapp.com/send?text=${encodeURIComponent(
          texto,
        )}`;
        window.open(urlFallback, "_blank");
      }
    } else {
      const urlDesktop = `https://api.whatsapp.com/send?text=${encodeURIComponent(
        texto,
      )}`;
      window.open(urlDesktop, "_blank");
    }
  };

  return (
    <div style={{ backgroundColor: "#09090b", minHeight: "100vh" }}>
      {(isNavigating || loading) && (
        <LoadingScreen message="Sincronizando base de dados..." />
      )}
      <MenuGlobal />

      <S.HomeContainer>
        {isAdmin && (
          <S.AlertSection>
            <div
              className="section-title"
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <S.StatusBadge status="EM PROCESSO">
                Cronograma de Manutenção Frequente
              </S.StatusBadge>

              <button
                onClick={() => setIsModalFrequenteOpen(true)}
                style={{
                  background: "transparent",
                  border: "1px dashed #3b82f6",
                  color: "#3b82f6",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <Plus size={14} /> Adicionar OS preventiva
              </button>
            </div>

            <S.GridAlertas>
              {minhasRotinasPendentes.map((rotina) => {
                const hoje = new Date();
                const diasDiferenca = calcularDiasUteisEntre(
                  rotina.proximaExecucao,
                  hoje,
                );

                let margem = 5;
                if (rotina.periodicidadeDias <= 31) margem = 5;
                else if (rotina.periodicidadeDias <= 95) margem = 10;
                else if (rotina.periodicidadeDias <= 185) margem = 20;
                else margem = 30;
                const muitoAdiantado = diasDiferenca < -margem;
                const muitoAtrasado = diasDiferenca > margem;
                const podeConcluir = !muitoAdiantado && !muitoAtrasado;

                return (
                  <S.AlertaCard key={rotina._id}>
                    <div className="info">
                      <div className="icon-box">
                        <Calendar size={20} />
                      </div>
                      <div>
                        <h4>{rotina.nome}</h4>
                        <p>
                          {rotina.setor} • {rotina.periodicidadeDias} dias
                        </p>

                        <div style={{ marginTop: "8px" }}>
                          <span
                            className={
                              diasDiferenca > 0 ? "atrasado" : "no-prazo"
                            }
                          >
                            {diasDiferenca === 0
                              ? "⚠️ Vence hoje!"
                              : diasDiferenca > 0
                                ? `🚨 Atrasado ${diasDiferenca} dias úteis`
                                : `⏳ Faltam ${Math.abs(diasDiferenca)} dias úteis`}
                          </span>

                          {rotina.ultimaExecucao && (
                            <span
                              style={{
                                display: "block",
                                fontSize: "10px",
                                color: "#71717a",
                                marginTop: "4px",
                              }}
                            >
                              Última execução:{" "}
                              {new Date(
                                rotina.ultimaExecucao,
                              ).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {muitoAdiantado && (
                      <p
                        style={{
                          color: "#3b82f6",
                          fontSize: "11px",
                          marginTop: "10px",
                        }}
                      >
                        Muito cedo para registrar. Disponível em{" "}
                        {Math.abs(diasDiferenca) - margem} dias.
                      </p>
                    )}

                    {muitoAtrasado && (
                      <p
                        style={{
                          color: "#ef4444",
                          fontSize: "11px",
                          marginTop: "10px",
                        }}
                      >
                        Prazo de conclusão expirado ({margem} dias excedidos).
                      </p>
                    )}
                    <button
                      className="btn-done"
                      disabled={!podeConcluir}
                      onClick={() =>
                        handleConcluirRotina(rotina._id, rotina.nome)
                      }
                      style={{
                        marginTop: "15px",
                        opacity: podeConcluir ? 1 : 0.5,
                        cursor: podeConcluir ? "pointer" : "not-allowed",
                      }}
                    >
                      Marcar como Concluído
                    </button>
                  </S.AlertaCard>
                );
              })}
            </S.GridAlertas>
          </S.AlertSection>
        )}
        {(isSolicitanteLogado || isAdmin) && (
          <S.Card>
            <h3>Abrir Nova OS</h3>
            <p>PRÓXIMA OS DISPONÍVEL:</p>
            <S.ProximaOS>#{nextNumber || "..."}</S.ProximaOS>

            <S.CardActionWrapper>
              <S.BotaoCard
                onClick={() => {
                  setDadosModal({});
                  setIsModalOSOpen(true);
                }}
              >
                Abrir Nova OS
              </S.BotaoCard>
            </S.CardActionWrapper>
          </S.Card>
        )}

        {isAdmin ? (
          <>
            {renderCardSolicitantes("Pendências por Solicitante")}
            {renderCardExecutores("Pendências por Executor")}
          </>
        ) : (
          <>
            {isExecutor && isSolicitanteLogado && (
              <>
                {renderCardExecutores("Minhas pendências como executor")}
                {renderCardSolicitantes("Minhas pendências como solicitante")}
              </>
            )}

            {isExecutor && !isSolicitanteLogado && (
              <>
                {renderCardExecutores("Minhas pendências")}
                {renderCardSolicitantes(
                  "Solicitantes referentes as minhas OS's",
                )}
              </>
            )}

            {isSolicitanteLogado && !isExecutor && (
              <>
                {renderCardSolicitantes("Minhas pendências")}
                {renderCardExecutores("Executores referentes as minhas OS's")}
              </>
            )}
          </>
        )}

        <ModalBase
          isOpen={isModalOSOpen}
          onClose={() => setIsModalOSOpen(false)}
          title="Nova OS"
          fields={fieldsAbertura}
          data={dadosModal}
          setData={setDadosModal}
          onSubmit={handleCriar}
          isLoading={isCreating}
        />
        <ModalBase
          isOpen={modalFechamentoAberto}
          onClose={() => setModalFechamentoAberto(false)}
          title={`OS #${osAtual?.numeroOS}`}
          subtitle={
            osAtual
              ? `Solicitante: ${osAtual.solicitante} | Setor: ${osAtual.setor}`
              : ""
          }
          fields={fieldsFechamento}
          data={dadosModal}
          setData={setDadosModal}
          onSubmit={handleAtualizarStatus}
          disableSubmit={
            dadosModal.situacao === "CONCLUÍDO" &&
            (!dadosModal.descricaoFechamento || !dadosModal.arquivoFechamento)
          }
          isLoading={isUpdating}
        />
        <ModalExecutor
          isOpen={modalExecutorAberto}
          onClose={() => setModalExecutorAberto(false)}
          title={`Pendências: ${executorNome}`}
          data={osFiltradas}
          status={isSolicitante}
          onFinalizar={(os) => {
            const isAdmin = user?.funcoes?.includes("ADMIN");
            const isExecutorLogado = user?.funcoes?.includes("EXECUTOR");
            const isDonoDaOS =
              user?.nome?.toUpperCase().trim() ===
              os.solicitante?.toUpperCase().trim();

            if (isSolicitante === "Executor" && (isExecutorLogado || isAdmin)) {
              setOsAtual(os);
              setDadosModal({ ...os });
              setIsModoFinalizacao(false);
              setModalExecutorAberto(false);
              setTimeout(() => setModalFechamentoAberto(true), 150);
              return;
            }

            if (isSolicitante === "Solicitante" || isDonoDaOS || isAdmin) {
              if (!isDonoDaOS && !isAdmin) {
                return Swal.fire({
                  ...swalConfig,
                  title: "Acesso Restrito",
                  text: "Apenas o solicitante ou gestor pode finalizar esta OS.",
                  icon: "info",
                });
              }

              setOsAtual(os);
              setDadosModal({
                ...os,
                situacao: "CONCLUÍDO",
                descricaoFechamento: "",
                arquivoFechamento: null,
              });
              setIsModoFinalizacao(true);
              setModalExecutorAberto(false);
              setTimeout(() => setModalFechamentoAberto(true), 150);
            }
          }}
        />
        <ModalAdicionarServico
          isOpen={isModalFrequenteOpen}
          onClose={() => setIsModalFrequenteOpen(false)}
          opcoes={opcoes || { setores: [], executores: [] }}
        />
      </S.HomeContainer>
    </div>
  );
}
