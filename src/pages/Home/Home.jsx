import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOS } from "../../hooks/useOS";
import ModalBase from "../../components/Modal/ModalBase";
import ModalExecutor from "../../components/ModalExecutor/ModalExecutor";
import * as S from "./styles";
import Swal from "sweetalert2";

export default function Home() {
  const navigate = useNavigate();

  // 1. Pegamos os dados e funções do novo hook useOS (que agora usa React Query)
  const {
    ordens,
    loading,
    opcoes,
    nextNumber,
    useCreateOs, // Agora é uma Mutation
    useUpdateOs, // Agora é uma Mutation
  } = useOS();

  // Estados dos Modais e UI
  const [modalAberto, setModalAberto] = useState(false);
  const [modalFechamentoAberto, setModalFechamentoAberto] = useState(false);
  const [modalExecutorAberto, setModalExecutorAberto] = useState(false);
  const [isSolicitante, setIsSolicitante] = useState("");
  const [osFiltradas, setOsFiltradas] = useState([]);
  const [executorNome, setExecutorNome] = useState("");
  const [dadosModal, setDadosModal] = useState({});
  const [osAtual, setOsAtual] = useState(null);
  const [numeroOSParaBuscar, setNumeroOSParaBuscar] = useState("");

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    target: "body",
    didOpen: (toast) => {
      toast.style.zIndex = "10000";
      toast.style.backdropFilter = "none";
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  // --- FUNÇÕES DE AÇÃO ---

  const handleCriar = async () => {
    const obrigatorios = fieldsAbertura
      .filter((f) => f.type !== "file")
      .map((f) => f.name);
    const faltantes = obrigatorios.filter(
      (campo) =>
        !dadosModal[campo] || dadosModal[campo].toString().trim() === ""
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
        formData.append(key, dadosModal[key])
      );

      // 2. Chamada via React Query (já limpa o cache e atualiza a lista no sucesso)
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
        confirmButtonText: "Enviar para WhatsApp",
      }).then((result) => {
        if (result.isConfirmed) {
          window.open(
            gerarMensagemWhatsApp(novaOSDoBanco, "abertura"),
            "_blank"
          );
        }
      });
    } catch (err) {
      Swal.fire("Erro", "Não foi possível criar a OS: " + err.message, "error");
    }
  };

  const handleAtualizarStatus = async () => {
    const {
      situacao,
      executor,
      descricaoProcesso,
      descricaoFechamento,
      arquivoFechamento,
    } = dadosModal;

    if (situacao === "EM PROCESSO" && (!descricaoProcesso || !executor)) {
      Toast.fire({
        icon: "warning",
        title: "Informe o executor e o andamento!",
      });
      return;
    }
    if (
      situacao === "CONCLUÍDO" &&
      (!descricaoFechamento || !arquivoFechamento || !executor)
    ) {
      Toast.fire({
        icon: "warning",
        title: "Preencha o relatório e a foto final!",
      });
      return;
    }

    try {
      const formData = new FormData();
      Object.keys(dadosModal).forEach((key) =>
        formData.append(key, dadosModal[key])
      );

      // 3. Chamada via React Query
      await useUpdateOs(osAtual._id, formData);

      setModalFechamentoAberto(false);
      setDadosModal({});
      setNumeroOSParaBuscar("");

      Swal.fire({
        title: "Atualizado!",
        text: `A OS foi movida para: ${situacao}`,
        icon: "success",
      });
    } catch (err) {
      Swal.fire("Erro", err.message, "error");
    }
  };

  // --- LÓGICA DE FILTROS E RANKINGS ---
  // (Mantida igual, pois usa o array 'ordens' que vem do hook)

  function abrirDetalhes(nome, tipo) {
    const filtradas = ordens.filter(
      (os) =>
        (tipo === "Executor" ? os.executor : os.solicitante) === nome &&
        (os.situacao === "EM ABERTO" || os.situacao === "EM PROCESSO")
    );
    setOsFiltradas(filtradas);
    setExecutorNome(nome);
    setModalExecutorAberto(true);
    setIsSolicitante(tipo);
  }

  const prepararFechamento = () => {
    const osEncontrada = ordens.find((os) => os.numeroOS == numeroOSParaBuscar);
    if (!osEncontrada)
      return Toast.fire({ icon: "warning", title: "OS não encontrada!" });
    if (osEncontrada.situacao === "CONCLUÍDO")
      return alert("Esta OS já está fechada!");

    setOsAtual(osEncontrada);
    setDadosModal({ ...osEncontrada });
    setModalFechamentoAberto(true);
  };

  // Lógica de Ranking
  const osParaRanking = ordens.filter(
    (os) =>
      (os.situacao === "EM ABERTO" || os.situacao === "EM PROCESSO") &&
      os.executor
  );

  const contagem = (tipo) => {
    const mapa = osParaRanking.reduce((acc, os) => {
      const nome = os[tipo];
      if (!acc[nome]) acc[nome] = { aberto: 0, processo: 0, total: 0 };
      os.situacao === "EM ABERTO" ? acc[nome].aberto++ : acc[nome].processo++;
      acc[nome].total++;
      return acc;
    }, {});
    return Object.entries(mapa)
      .map(([nome, stats]) => ({ nome, ...stats }))
      .sort((a, b) => b.total - a.total);
  };

  const rankingDataSolicitante = contagem("solicitante");
  const rankingDataExecutor = contagem("executor");

  // --- CONFIGURAÇÃO DE CAMPOS ---
  // (Filtros finais de nomes para os selects usando 'opcoes')
  const filtrar = (lista, add, rem) =>
    [...new Set([...add, ...(lista || [])])]
      .filter((n) => !rem.includes(n))
      .sort();

  const solicitantesFinais = filtrar(
    opcoes.solicitantes,
    [
      "José Rodrigues",
      "Eduardo(Dudu)",
      "Gabriel RH",
      "Natanael",
      "Frederico Madeira",
      "Alan Manutenção",
      "Gabriel Camara",
      "Gabriela SST",
      "Jean Camara",
    ],
    [
      "Bruno",
      "Frederico",
      "THIAGO FREITAS",
      "Welliton Cruz",
      "Eduardo",
      "GABRIEL",
      "José",
      "NATANAEL",
      "FREDERICO MADEIRA",
    ]
  );
  const executoresFinais = filtrar(
    opcoes.executores,
    ["José Rodrigues", "Gabriel Camara"],
    ["josé", "José", "Não Atribuído"]
  );
  const setoresFinais = filtrar(
    opcoes.setores,
    ["FRUTA CONGELADA", "ROTULAGEM"],
    ["ACAI", "SEGURANÇA", "FRUTA CONG", "ROTULADORA"]
  );
  const prioridadesFinais = filtrar(
    opcoes.prioridades,
    [
      "Emergencia (Atendimento Imediato)",
      "Alta (No decorrer do dia)",
      "Normal (Sequência de execução)",
    ],
    ["Baixa", "Média", "NORMAL", "Alta", "Normal"]
  );

  const fieldsAbertura = [
    {
      name: "setor",
      label: "Setor",
      type: "select",
      options: setoresFinais.map((s) => ({ label: s, value: s })),
    },
    {
      name: "solicitante",
      label: "Solicitante",
      type: "select",
      options: solicitantesFinais.map((s) => ({ label: s, value: s })),
    },
    {
      name: "executor",
      label: "Executor",
      type: "select",
      options: executoresFinais.map((e) => ({ label: e, value: e })),
    },
    {
      name: "prioridade",
      label: "Prioridade",
      type: "select",
      options: prioridadesFinais.map((p) => ({ label: p, value: p })),
    },
    { name: "equipamento", label: "Equipamento", type: "text" },
    { name: "descricaoAbertura", label: "Descrição", type: "textarea" },
    { name: "arquivoAbertura", label: "Anexar Foto", type: "file" },
  ];

  const fieldsFechamento = [
    {
      name: "situacao",
      label: "O que deseja fazer?",
      type: "select",
      options: [
        { label: "Colocar em Processo", value: "EM PROCESSO" },
        { label: "Finalizar OS", value: "CONCLUÍDO" },
      ],
    },
    {
      name: "executor",
      label: "Técnico Responsável",
      type: "select",
      options: executoresFinais.map((e) => ({ label: e, value: e })),
    },
    ...(dadosModal.situacao === "EM PROCESSO"
      ? [
          {
            name: "descricaoProcesso",
            label: "Descrição do Andamento",
            type: "textarea",
          },
        ]
      : []),
    ...(dadosModal.situacao === "CONCLUÍDO"
      ? [
          { name: "pecasUtilizadas", label: "Peças Utilizadas", type: "text" },
          {
            name: "descricaoFechamento",
            label: "Relatório Técnico Final",
            type: "textarea",
          },
          { name: "arquivoFechamento", label: "Foto Finalizada", type: "file" },
        ]
      : []),
  ];

  const gerarMensagemWhatsApp = (os, tipo) => {
    const isAbertura = tipo === "abertura";
    const texto = `*${
      isAbertura ? "NOVA OS ABERTA" : "OS FINALIZADA"
    }* ❄️\n\n🚨 *Prioridade:* ${os.prioridade}\n📌 *OS:* #${
      os.numeroOS || nextNumber
    }\n📍 *Setor:* ${os.setor}\n⚙️ *Equipamento:* ${
      os.equipamento
    }\n👤 *Solicitante:* ${os.solicitante}\n👤 *Executor:* ${
      os.executor
    }\n📝 *Descrição:* ${os.descricaoAbertura}${
      !isAbertura ? `\n🛠️ *Relatório:* ${os.descricaoFechamento}` : ""
    }\n🖼️ *Foto:* ${isAbertura ? os.arquivoAbertura : os.arquivoFechamento}`;
    return `https://wa.me/?text=${encodeURIComponent(texto)}`;
  };

  return (
    <div style={{ backgroundColor: "#000", overflowX: "hidden" }}>
      <S.HomeContainer>
        {loading && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.7)",
              zIndex: 9999,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backdropFilter: "blur(4px)",
            }}
          >
            <h1 style={{ color: "white" }}>Sincronizando dados...</h1>
          </div>
        )}

        <S.Card>
          <h3>EasyIce - Abrir Nova OS</h3>
          <p>PRÓXIMA OS DISPONÍVEL:</p>
          <S.ProximaOS>#{nextNumber || "..."}</S.ProximaOS>
          <S.BotaoCard onClick={() => setModalAberto(true)}>
            Abrir Nova OS
          </S.BotaoCard>
        </S.Card>

        <S.Card>
          <h3>EasyIce - Fechar OS Existente</h3>
          <h3 style={{ color: "red" }}>
            A OS DEVE SER FINALIZADA PELO SOLICITANTE
          </h3>
          <p>NÚMERO DA OS:</p>
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
              marginBottom: "10px",
            }}
          />
          <S.BotaoCard onClick={prepararFechamento}>
            Localizar e Finalizar
          </S.BotaoCard>
        </S.Card>

        {/* RANKINGS */}
        {[
          {
            title: "Ranking Solicitantes",
            data: rankingDataSolicitante,
            type: "Status",
          },
          {
            title: "Ranking Executores",
            data: rankingDataExecutor,
            type: "Executor",
          },
        ].map((rk) => (
          <S.Card key={rk.title}>
            <h3>{rk.title}</h3>
            <div
              style={{
                display: "flex",
                gap: "15px",
                marginBottom: "10px",
                fontSize: "0.85rem",
                justifyContent: "center",
                borderBottom: "1px solid #333",
                paddingBottom: "8px",
              }}
            >
              <span style={{ color: "#656363" }}>
                <b style={{ color: "#c82800" }}>A</b> : Em aberto
              </span>
              <span style={{ color: "#656363" }}>
                <b style={{ color: "#00aeff" }}>P</b> : Em processo
              </span>
            </div>
            {rk.data.length > 0 ? (
              <S.RankingWrapper>
                {rk.data.map((item, idx) => (
                  <div
                    key={item.nome}
                    onClick={() => abrirDetalhes(item.nome, rk.type)}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      padding: "10px 0",
                      borderBottom:
                        idx !== rk.data.length - 1 ? "1px solid #eee" : "none",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: "600",
                        fontSize: "1.2rem",
                        color: "#333",
                      }}
                    >
                      {idx + 1}º {item.nome}
                    </span>
                    <div style={{ display: "flex", gap: "5px" }}>
                      <span
                        style={{
                          backgroundColor: "#c82800",
                          color: "white",
                          padding: "2px 8px",
                          borderRadius: "6px",
                          fontWeight: "bold",
                        }}
                      >
                        {item.aberto} A
                      </span>
                      <span
                        style={{
                          backgroundColor: "#00aeff",
                          color: "white",
                          padding: "2px 8px",
                          borderRadius: "6px",
                          fontWeight: "bold",
                        }}
                      >
                        {item.processo} P
                      </span>
                    </div>
                  </div>
                ))}
              </S.RankingWrapper>
            ) : (
              <S.RankingVazio>Ninguém com OS ativa</S.RankingVazio>
            )}
          </S.Card>
        ))}

        {/* MODAIS */}
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
          title={`Atualizar OS #${osAtual?.numeroOS}`}
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
