import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOS } from "../../hooks/useOS";
import ModalBase from "../../components/Modal/ModalBase";
import ModalExecutor from "../../components/ModalExecutor/ModalExecutor";
import * as S from "./styles";

export default function Home() {
  const navigate = useNavigate();
  const {
    ordens,
    loading,
    opcoes,
    nextNumber,
    useGetNextNumber,
    useGetOs,
    useGetOptions,
    useCreateOs,
    useUpdateOs, // Importante para o fechamento
  } = useOS();

  // Estados dos Modais
  const [modalAberto, setModalAberto] = useState(false);
  const [modalFechamentoAberto, setModalFechamentoAberto] = useState(false);
  const [modalExecutorAberto, setModalExecutorAberto] = useState(false);
  const [osFiltradas, setOsFiltradas] = useState([]);
  const [executorNome, setExecutorNome] = useState("");

  // Função que filtra e abre o modal
  const abrirDetalhes = (nome) => {
    const filtradas = ordens.filter(
      (os) =>
        os.executor === nome &&
        (os.situacao === "EM ABERTO" || os.situacao === "EM ANDAMENTO")
    );
    setOsFiltradas(filtradas);
    setExecutorNome(nome);
    setModalExecutorAberto(true);
  };

  // Estados de Dados
  const [dadosModal, setDadosModal] = useState({});
  const [osAtual, setOsAtual] = useState(null);
  const [numeroOSParaBuscar, setNumeroOSParaBuscar] = useState("");

  useEffect(() => {
    useGetOs();
    useGetOptions();
    useGetNextNumber();
  }, []);

  // Lógica de contagem e próxima OS
  const osAbertas = ordens.filter(
    (os) => os.situacao === "EM ABERTO" || os.situacao === "EM ANDAMENTO"
  );
  const numAbertas = osAbertas.length;

  const proximaOS =
    ordens.reduce((max, os) => Math.max(max, os.numeroOS || 0), 0) + 1;

  // --- CONFIGURAÇÃO DOS CAMPOS ---
  const fieldsAbertura = [
    {
      name: "setor",
      label: "Setor",
      type: "select",
      options: opcoes.setores?.map((s) => ({ label: s, value: s })) || [],
    },
    {
      name: "solicitante",
      label: "Solicitante",
      type: "select",
      options: opcoes.solicitantes?.map((s) => ({ label: s, value: s })) || [],
    },
    {
      name: "prioridade",
      label: "Prioridade",
      type: "select",
      options: opcoes.prioridades?.map((p) => ({ label: p, value: p })) || [],
    },
    { name: "equipamento", label: "Equipamento", type: "text" },
    { name: "descricaoAbertura", label: "Descrição", type: "textarea" },
    { name: "arquivoAbertura", label: "Anexar Foto", type: "file" },
  ];

  const fieldsFechamento = [
    {
      name: "executor",
      label: "Técnico Executor",
      type: "select",
      options: opcoes.executores?.map((e) => ({ label: e, value: e })) || [],
    },
    { name: "pecasUtilizadas", label: "Peças Utilizadas", type: "text" },
    { name: "valorPecas", label: "Valor das Peças", type: "number" },
    {
      name: "descricaoFechamento",
      label: "Relatório Técnico (O que foi feito?)",
      type: "textarea",
    },
    {
      name: "arquivoFechamento",
      label: "Foto do Serviço Finalizado",
      type: "file",
    },
  ];

  // --- FUNÇÕES DE AÇÃO ---
  const handleCriar = async () => {
    try {
      const formData = new FormData();
      Object.keys(dadosModal).forEach((key) => {
        if (key !== "arquivoAbertura") {
          formData.append(key, dadosModal[key]);
        }
      });
      if (dadosModal.arquivoAbertura) {
        formData.append("arquivoAbertura", dadosModal.arquivoAbertura);
      }

      await useCreateOs(formData);

      setModalAberto(false);
      setDadosModal({});
      useGetOs();
      alert("OS aberta com sucesso!");
    } catch (err) {
      alert("Erro ao criar OS: " + err.message);
    }
  };

  const handleFechar = async () => {
    try {
      const formData = new FormData();
      Object.keys(dadosModal).forEach((key) => {
        if (key !== "arquivoFechamento") {
          formData.append(key, dadosModal[key]);
        }
      });

      if (dadosModal.arquivoFechamento) {
        formData.append("arquivoFechamento", dadosModal.arquivoFechamento);
      }
      await useUpdateOs(osAtual._id, formData);

      setModalFechamentoAberto(false);
      setDadosModal({});
      setNumeroOSParaBuscar("");
      useGetOs();
      alert("OS finalizada com sucesso!");
    } catch (err) {
      alert("Erro ao fechar OS: " + err.message);
    }
  };

  const prepararFechamento = () => {
    const osEncontrada = ordens.find((os) => os.numeroOS == numeroOSParaBuscar);

    if (!osEncontrada) {
      alert("Ordem de Serviço não encontrada!");
      return;
    }

    if (
      osEncontrada.situacao !== "EM ABERTO" &&
      osEncontrada.situacao !== "EM ANDAMENTO"
    ) {
      alert(`Esta OS não pode ser fechada pois está: ${osEncontrada.situacao}`);
      return;
    }

    setOsAtual(osEncontrada);
    setDadosModal({ ...osEncontrada });
    setModalFechamentoAberto(true);
  };

  const osParaRanking = ordens.filter(
    (os) =>
      (os.situacao === "EM ABERTO" || os.situacao === "EM ANDAMENTO") &&
      os.executor
  );

  const contagemPorExecutor = osParaRanking.reduce((acc, os) => {
    acc[os.executor] = (acc[os.executor] || 0) + 1;
    return acc;
  }, {});

  const rankingData = Object.entries(contagemPorExecutor)
    .map(([nome, total]) => ({ nome, total }))
    .sort((a, b) => b.total - a.total);

  if (loading)
    return (
      <S.HomeContainer>
        <h1 style={{ color: "white" }}>Carregando...</h1>
      </S.HomeContainer>
    );

  return (
    <S.HomeContainer>
      <S.Card style={{ borderTop: "4px solid #0073ea" }}>
        <h3>Gestão de Dados</h3>
        <p>
          Visualize e edite todas as Ordens de Serviço na visualização de
          tabela:
        </p>
        <S.BotaoCard
          onClick={() => navigate("/tabela")}
          style={{ backgroundColor: "#0073ea", marginTop: "10px" }}
        >
          Acessar Tabela de OS
        </S.BotaoCard>
      </S.Card>
      {/* CARD ABERTURA */}
      <S.Card>
        <h3>EasyIce - Abrir Nova OS</h3>
        <p>PRÓXIMA OS DISPONÍVEL:</p>
        <S.ProximaOS>#{nextNumber || "..."}</S.ProximaOS>
        <S.BotaoCard onClick={() => setModalAberto(true)}>
          Abrir Nova OS
        </S.BotaoCard>
      </S.Card>

      {/* CARD FECHAMENTO */}
      <S.Card>
        <h3>EasyIce - Fechar OS Existente</h3>
        <p>DIGITE O NÚMERO DA OS PARA FINALIZAR:</p>
        <input
          type="number"
          placeholder="Ex: 1020"
          value={numeroOSParaBuscar}
          onChange={(e) => setNumeroOSParaBuscar(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "1.5rem",
            width: "80%",
            textAlign: "center",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginBottom: "10px",
          }}
        />
        <S.BotaoCard onClick={prepararFechamento}>
          Localizar e Finalizar
        </S.BotaoCard>
      </S.Card>

      <S.Card>
        <h3>Ranking de Carga de Trabalho</h3>
        <p>Número de OS abertas</p>
        <p>Clique no nome para ver as pendências do executor.</p>
        {rankingData.length > 0 ? (
          <S.RankingWrapper>
            {rankingData.map((item, index) => (
              <div
                key={item.nome}
                onClick={() => abrirDetalhes(item.nome)}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  cursor: "pointer",
                  padding: "8px 0",
                  borderBottom:
                    index !== rankingData.length - 1
                      ? "1px solid #eee"
                      : "none",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f0f7ff")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <span
                  style={{
                    fontWeight: "600",
                    fontSize: "1.3rem",
                    color: "#333",
                  }}
                >
                  {index + 1}º {item.nome}
                </span>
                <span
                  style={{
                    backgroundColor: item.total > 5 ? "#ff4d4f" : "#00c875",
                    color: "white",
                    padding: "2px 10px",
                    borderRadius: "12px",
                    fontSize: "1.3rem",
                    fontWeight: "bold",
                  }}
                >
                  {item.total} OS
                </span>
              </div>
            ))}
          </S.RankingWrapper>
        ) : (
          <S.RankingVazio>Ninguém com OS aberta no momento</S.RankingVazio>
        )}
      </S.Card>

      <ModalBase
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        title="Nova Ordem de Serviço"
        fields={fieldsAbertura}
        data={dadosModal}
        setData={setDadosModal}
        onSubmit={handleCriar}
      />

      <ModalBase
        isOpen={modalFechamentoAberto}
        onClose={() => setModalFechamentoAberto(false)}
        title={`Finalizar OS #${osAtual?.numeroOS}`}
        subtitle={
          osAtual
            ? `Solicitante: ${osAtual.solicitante} | Setor: ${osAtual.setor}`
            : ""
        }
        fields={fieldsFechamento}
        data={dadosModal}
        setData={setDadosModal}
        onSubmit={handleFechar}
      />
      <ModalExecutor
        isOpen={modalExecutorAberto}
        onClose={() => setModalExecutorAberto(false)}
        title={`Pendências: ${executorNome}`}
        data={osFiltradas}
      />
    </S.HomeContainer>
  );
}
