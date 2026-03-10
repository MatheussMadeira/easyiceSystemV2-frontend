import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useOS } from "../../hooks/useOS";
import { useAuth } from "../../hooks/useAuth";
import ModalBase from "../../components/Modal/ModalBase";
import ModalExecutor from "../../components/ModalExecutor/ModalExecutor";
import ModalLogin from "../Login/Login";
import * as S from "./styles";
import * as M from "../../components/MenuHamburguer/menu";
import Swal from "sweetalert2";

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  // LOGICA DE LOGIN
  const { signed, user, login, logout, loadingAuth } = useAuth();
  useEffect(() => {
    if (!signed) {
      navigate("/login");
    }
  }, [signed, navigate]);
  // 1. Pegamos os dados dinâmicos do hook useOS
  const { ordens, loading, opcoes, nextNumber, useCreateOs, useUpdateOs } =
    useOS();
  console.log("=== DEBUG OPÇÕES DO BANCO ===");
  console.log("Objeto opcoes inteiro:", opcoes);
  console.log("Solicitantes:", opcoes?.solicitantes);
  console.log("Executores:", opcoes?.executores);
  console.log("=============================");

  // Estados dos Modais
  const [modalAberto, setModalAberto] = useState(false);
  const [modalFechamentoAberto, setModalFechamentoAberto] = useState(false);
  const [modalExecutorAberto, setModalExecutorAberto] = useState(false);

  // Estados para o Modal de Detalhes (Ranking)
  const [osFiltradas, setOsFiltradas] = useState([]);
  const [executorNome, setExecutorNome] = useState("");
  const [isSolicitante, setIsSolicitante] = useState("");

  // Estados de UI e Formulário
  const [dadosModal, setDadosModal] = useState({});
  const [osAtual, setOsAtual] = useState(null);
  const [numeroOSParaBuscar, setNumeroOSParaBuscar] = useState("");
  const [menuAberto, setMenuAberto] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  if (!signed) return null;
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  // --- FUNÇÕES DE NAVEGAÇÃO E AÇÃO ---
  const handleNavigation = (path) => {
    if (location.pathname === path) {
      setMenuAberto(false);
      return;
    }
    setIsNavigating(true);
    setTimeout(() => navigate(path), 500);
  };

  const handleCriar = async () => {
    const obrigatorios = fieldsAbertura
      .filter((f) => f.type !== "file")
      .map((f) => f.name);
    const faltantes = obrigatorios.filter(
      (campo) =>
        !dadosModal[campo] || dadosModal[campo].toString().trim() === "",
    );

    if (faltantes.length > 0 || !dadosModal.arquivoAbertura) {
      Toast.fire({
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
        title: "OS Aberta com Sucesso! 🚀",
        text: `A Ordem de Serviço #${
          novaOSDoBanco?.numeroOS || nextNumber
        } foi registrada.`,
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#25D366",
        confirmButtonText: "Enviar WhatsApp",
      }).then((result) => {
        if (result.isConfirmed)
          window.open(
            gerarMensagemWhatsApp(novaOSDoBanco, "abertura"),
            "_blank",
          );
      });
    } catch (err) {
      Swal.fire("Erro", "Erro ao criar: " + err.message, "error");
    }
  };

  const handleAtualizarStatus = async () => {
    try {
      const formData = new FormData();
      Object.keys(dadosModal).forEach((key) =>
        formData.append(key, dadosModal[key]),
      );

      // 1. Salva o número da OS antes de limpar os estados
      const numeroDaOS = osAtual.numeroOS;
      const situacaoFinal = dadosModal.situacao;

      await useUpdateOs(osAtual._id, formData);

      // 2. Limpeza dos estados do modal
      setModalFechamentoAberto(false);
      setDadosModal({});
      setNumeroOSParaBuscar("");

      // 3. Lógica do Alerta Condicional
      if (situacaoFinal === "CONCLUÍDO") {
        const mensagemWpp = encodeURIComponent(
          `✅ *OS #${numeroDaOS} Finalizada*\n\nO técnico concluiu o serviço solicitado.\n*Status:* Concluído\n*Data:* ${new Date().toLocaleDateString()}`,
        );

        Swal.fire({
          title: "Finalizada!",
          text: `OS #${numeroDaOS} finalizada com sucesso.`,
          icon: "success",
          showCancelButton: true,
          confirmButtonText: "📱 Avisar no WhatsApp",
          cancelButtonText: "Fechar",
          confirmButtonColor: "#25D366", // Cor do WhatsApp
        }).then((result) => {
          if (result.isConfirmed) {
            window.open(`https://wa.me/?text=${mensagemWpp}`, "_blank");
          }
        });
      } else {
        // Alerta simples para "EM PROCESSO"
        Swal.fire(
          "Atualizado!",
          `A OS foi movida para: ${situacaoFinal}`,
          "success",
        );
      }
    } catch (err) {
      Swal.fire("Erro", err.message, "error");
    }
  };

  // --- LÓGICA DE DETALHES AO CLICAR NO RANKING ---
  function abrirDetalhes(nome, tipo) {
    const filtradas = ordens.filter(
      (os) =>
        (tipo === "Executor" ? os.executor : os.solicitante) === nome &&
        (os.situacao === "EM ABERTO" || os.situacao === "EM PROCESSO"),
    );
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
      return Swal.fire("Aviso", "Esta OS já está fechada!", "info");

    setOsAtual(osEncontrada);
    setDadosModal({ ...osEncontrada });
    setModalFechamentoAberto(true);
  };

  // --- LÓGICA DE RANKING (DINÂMICA E SEPARADA POR STATUS) ---
  const calcularRanking = (campo) => {
    const mapa = ordens.reduce((acc, os) => {
      if (os.situacao === "CONCLUÍDO" || os.situacao === "CANCELADA")
        return acc;
      const nome =
        os[campo] || (campo === "executor" ? "Não Atribuído" : "Desconhecido");
      if (!acc[nome]) acc[nome] = { aberto: 0, processo: 0, total: 0 };
      if (os.situacao === "EM ABERTO") acc[nome].aberto++;
      else if (os.situacao === "EM PROCESSO") acc[nome].processo++;
      acc[nome].total++;
      return acc;
    }, {});

    return Object.entries(mapa)
      .map(([nome, stats]) => ({ nome, ...stats }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
  };

  const rankingSolicitantes = calcularRanking("solicitante");
  const rankingExecutores = calcularRanking("executor");

  // --- CONFIGURAÇÃO DE CAMPOS USANDO DADOS DO BANCO ---
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

  const fieldsFechamento = [
    {
      name: "situacao",
      label: "O que deseja fazer?",
      type: "select",
      options: [
        { label: "EM PROCESSO", value: "EM PROCESSO" },
        { label: "CONCLUÍDO", value: "CONCLUÍDO" },
      ],
    },
    {
      name: "executor",
      label: "Técnico Responsável",
      type: "select",
      options: (opcoes.executores || []).map((e) => ({ label: e, value: e })),
    },
    ...(dadosModal.situacao === "EM PROCESSO"
      ? [{ name: "descricaoProcesso", label: "Andamento", type: "textarea" }]
      : []),
    ...(dadosModal.situacao === "CONCLUÍDO"
      ? [
          { name: "pecasUtilizadas", label: "Peças Utilizadas", type: "text" },
          {
            name: "descricaoFechamento",
            label: "Relatório Técnico Final",
            type: "textarea",
          },
          {
            name: "arquivoFechamento",
            label: "Foto da Conclusão",
            type: "file",
          },
        ]
      : []),
  ];

  const gerarMensagemWhatsApp = (os, tipo) => {
    const texto = `*OS #${os.numeroOS}* ❄️\n📍 Setor: ${os.setor}\n⚙️ Equip: ${os.equipamento}\n👤 Solicitante: ${os.solicitante}\n📝 Desc: ${os.descricaoAbertura}`;
    return `https://wa.me/?text=${encodeURIComponent(texto)}`;
  };

  return (
    <div style={{ backgroundColor: "#09090b", minHeight: "100vh" }}>
      {(isNavigating || loading) && (
        <M.TransitionOverlay>
          <S.Spinner />
          <h2>Sincronizando base de dados...</h2>
        </M.TransitionOverlay>
      )}

      <M.MenuToggle onClick={() => setMenuAberto(!menuAberto)}>
        {menuAberto ? "✕" : "☰"}
      </M.MenuToggle>

      <M.MenuOverlay isOpen={menuAberto} onClick={() => setMenuAberto(false)} />

      <M.Sidebar isOpen={menuAberto}>
        <M.MenuItem active onClick={() => handleNavigation("/")}>
          🗂️ Painel
        </M.MenuItem>
        <M.MenuItem onClick={() => handleNavigation("/tabela")}>
          📊 Tabela
        </M.MenuItem>
        <M.MenuItem onClick={logout}>❌ Logout</M.MenuItem>
      </M.Sidebar>

      <S.HomeContainer>
        {/* CARDS DE AÇÃO */}
        <S.Card>
          <h3>Abrir Nova OS</h3>
          <p>PRÓXIMA OS DISPONÍVEL:</p>
          <S.ProximaOS>#{nextNumber || "..."}</S.ProximaOS>
          <S.BotaoCard onClick={() => setModalAberto(true)}>
            Abrir Nova OS
          </S.BotaoCard>
        </S.Card>

        <S.Card>
          <h3>Fechar OS Existente</h3>
          <p>NÚMERO DA OS:</p>
          <input
            type="number"
            placeholder="Ex: 1020"
            value={numeroOSParaBuscar}
            onChange={(e) => setNumeroOSParaBuscar(e.target.value)}
          />
          <S.BotaoCard onClick={prepararFechamento}>
            Localizar e Finalizar
          </S.BotaoCard>
        </S.Card>

        {/* RANKINGS COM CONTADOR DUPLO (ABERTO/PROCESSO) */}
        <S.Card>
          <h3>Pendências por Solicitante</h3>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "12px",
              marginBottom: "10px",
              height: "20px",
            }}
          >
            <small style={{ color: "#ef4444" }}>● Aberto</small>
            <small style={{ color: "#3b82f6" }}>● Processo</small>
          </div>
          <S.RankingWrapper>
            {rankingSolicitantes.map((item, idx) => (
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
                </div>
              </S.RankingItem>
            ))}
          </S.RankingWrapper>
        </S.Card>

        {/* Substitua o bloco de Ranking de Técnicos por este: */}
        <S.Card>
          <h3>Pendências por Executor</h3>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "12px",
              marginBottom: "10px",
              height: "20px",
            }}
          >
            <small style={{ color: "#ef4444" }}>● Aberto</small>
            <small style={{ color: "#3b82f6" }}>● Processo</small>
          </div>
          <S.RankingWrapper>
            {rankingExecutores.map((item, idx) => (
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
                </div>
              </S.RankingItem>
            ))}
          </S.RankingWrapper>
        </S.Card>

        {/* COMPONENTES DE MODAL */}
        <ModalBase
          isOpen={modalAberto}
          onClose={() => setModalAberto(false)}
          title="Nova OS"
          fields={fieldsAbertura}
          data={dadosModal}
          setData={setDadosModal}
          onSubmit={handleCriar}
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
        />

        <ModalExecutor
          isOpen={modalExecutorAberto}
          onClose={() => {
            setModalExecutorAberto(false);
            setOsFiltradas([]);
          }}
          title={`Pendências: ${executorNome}`}
          data={osFiltradas}
          status={isSolicitante}
        />
      </S.HomeContainer>
    </div>
  );
}
