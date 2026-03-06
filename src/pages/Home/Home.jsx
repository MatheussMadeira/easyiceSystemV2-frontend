import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOS } from "../../hooks/useOS";
import ModalBase from "../../components/Modal/ModalBase";
import ModalExecutor from "../../components/ModalExecutor/ModalExecutor";
import * as S from "./styles";
import Swal from "sweetalert2";
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
    useUpdateOs,
  } = useOS();

  // Estados dos Modais
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

  function abrirDetalhes(nome, tipo) {
    if (tipo === "Executor") {
      const filtradasExecutor = ordens.filter(
        (os) =>
          os.executor === nome &&
          (os.situacao === "EM ABERTO" || os.situacao === "EM PROCESSO")
      );
      setOsFiltradas(filtradasExecutor);
      setExecutorNome(nome);
    } else {
      const filtradasSolicitante = ordens.filter(
        (os) =>
          os.solicitante === nome &&
          (os.situacao === "EM ABERTO" || os.situacao === "EM PROCESSO")
      );
      setOsFiltradas(filtradasSolicitante);
      setExecutorNome(nome);
    }
    setModalExecutorAberto(true);
    setIsSolicitante(tipo);
  }

  // Estados de Dados

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
  const NOMES_PARA_REMOVER_SOLICITANTES = [
    "Bruno",
    "Frederico",
    "THIAGO FREITAS",
    "Welliton Cruz",
    "Eduardo",
    "GABRIEL",
    "José",
    "NATANAEL",
    "FREDERICO MADEIRA",
    "NATANAEL",
  ];
  const NOMES_PARA_ADICIONAR_SOLICITANTES = [
    "José Rodrigues",
    "Eduardo(Dudu)",
    "Gabriel RH",
    "José Rodrigues",
    "José Rodrigues",
    "Natanael",
    "Frederico Madeira",
    "Alan Manutenção",
    "Gabriel Camara",
    "Gabriela SST",
    "Jean Camara",
  ];
  const NOMES_PARA_REMOVER_EXECUTORES = ["josé", "José", "Não Atribuído"];
  const NOMES_PARA_ADICIONAR_EXECUTORES = ["José Rodrigues", "Gabriel Camara"];
  const NOMES_PARA_ADICIONAR_SETOR = ["FRUTA CONGELADA", "ROTULAGEM"];
  const NOMES_PARA_REMOVER_SETOR = [
    "ACAI",
    "SEGURANÇA",
    "FRUTA CONG",
    "ROTULADORA",
    "ACAI",
    "Segurança",
  ];
  const NOMES_PARA_REMOVER_PRIORIDADE = [
    "Baixa",
    "Média",
    "NORMAL",
    "Alta",
    "Normal",
  ];
  const NOMES_PARA_ADICIONAR_PRIORIDADE = [
    "Emergencia (Atendimento Imediato)",
    "Alta (No decorrer do dia)",
    "Normal (Sequência de execução)",
  ];

  const solicitantesFinais = [
    ...new Set([
      ...NOMES_PARA_ADICIONAR_SOLICITANTES,
      ...(opcoes.solicitantes || []),
    ]),
  ]
    .filter((nome) => !NOMES_PARA_REMOVER_SOLICITANTES.includes(nome))
    .sort();
  const executoresFinais = [
    ...new Set([
      ...NOMES_PARA_ADICIONAR_EXECUTORES,
      ...(opcoes.executores || []),
    ]),
  ]

    .filter((nome) => !NOMES_PARA_REMOVER_EXECUTORES.includes(nome))
    .sort();
  const setoresFinais = [
    ...new Set([...NOMES_PARA_ADICIONAR_SETOR, ...(opcoes.setores || [])]),
  ]
    .filter((nome) => !NOMES_PARA_REMOVER_SETOR.includes(nome))
    .sort();

  const prioridadesFinais = [
    ...new Set([
      ...NOMES_PARA_ADICIONAR_PRIORIDADE,
      ...(opcoes.prioridades || []),
    ]),
  ]
    .filter((nome) => !NOMES_PARA_REMOVER_PRIORIDADE.includes(nome))
    .sort();
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
      label: "O que deseja fazer agora?",
      type: "select",
      options: [
        { label: "Colocar em Processo (Andamento)", value: "EM PROCESSO" },
        { label: "Finalizar OS (Concluir)", value: "CONCLUÍDO" },
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
            label: "O que está sendo feito? (Descrição do Andamento)",
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
          {
            name: "arquivoFechamento",
            label: "Foto do Serviço Finalizado",
            type: "file",
          },
        ]
      : []),
  ];

  const handleCriar = async () => {
    const obrigatorios = fieldsAbertura
      .filter((f) => f.type !== "file")
      .map((f) => f.name);

    const faltantes = obrigatorios.filter(
      (campo) =>
        !dadosModal[campo] || dadosModal[campo].toString().trim() === ""
    );

    const faltaArquivo = !dadosModal.arquivoAbertura;

    if (faltantes.length > 0) {
      Toast.fire({
        icon: "warning",
        title: "Preencha todos os campos!",
      });
      return;
    } else if (faltaArquivo) {
      Toast.fire({
        icon: "warning",
        title: "A foto de abertura é obrigatória!",
      });
      return;
    }

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

      const novaOSDoBanco = await useCreateOs(formData);

      setModalAberto(false);
      setDadosModal({});
      useGetOs();
      useGetNextNumber();

      Swal.fire({
        title: "OS Aberta com Sucesso! 🚀",
        text: `A Ordem de Serviço #${
          novaOSDoBanco?.numeroOS || nextNumber
        } foi registrada no sistema.`,
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#25D366",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Enviar para WhatsApp",
      }).then((result) => {
        if (result.isConfirmed) {
          const link = gerarMensagemWhatsApp(novaOSDoBanco, "abertura");
          window.open(link, "_blank");
        }
      });
    } catch (err) {
      Swal.fire("Erro", "Não foi possível criar a OS: " + err.message, "error");
    }
  };

  const handleAtualizarStatus = async () => {
    const situacao = dadosModal.situacao;

    if (situacao === "EM PROCESSO") {
      if (!dadosModal.descricaoProcesso || !dadosModal.executor) {
        Toast.fire({
          icon: "warning",
          title: "Informe o executor e a descrição do andamento!",
        });
        return;
      }
    } else if (situacao === "CONCLUÍDO") {
      if (
        !dadosModal.descricaoFechamento ||
        !dadosModal.arquivoFechamento ||
        !dadosModal.executor
      ) {
        Toast.fire({
          icon: "warning",
          title: "Para finalizar, preencha o relatório e a foto!",
        });
        return;
      }
    } else {
      Toast.fire({ icon: "warning", title: "Selecione o que deseja fazer!" });
      return;
    }

    try {
      const formData = new FormData();
      Object.keys(dadosModal).forEach((key) => {
        formData.append(key, dadosModal[key]);
      });

      const osAtualizada = await useUpdateOs(osAtual._id, formData);

      setModalFechamentoAberto(false);
      setDadosModal({});
      setNumeroOSParaBuscar("");
      useGetOs();

      Swal.fire({
        title: "Atualizado!",
        text: `A OS foi movida para: ${situacao}`,
        icon: "success",
        confirmButtonColor: "#25D366",
        confirmButtonText: "OK",
      });
    } catch (err) {
      Swal.fire("Erro", err.message, "error");
    }
  };

  const prepararFechamento = () => {
    const osEncontrada = ordens.find((os) => os.numeroOS == numeroOSParaBuscar);

    if (!osEncontrada) {
      Toast.fire({
        icon: "warning",
        title: "Ordem de serviço não encontrada!",
      });
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
      (os.situacao === "EM ABERTO" || os.situacao === "EM PROCESSO") &&
      os.executor
  );
  const gerarContagemStatus = (acc, nome, situacao) => {
    if (!acc[nome]) {
      acc[nome] = { aberto: 0, processo: 0, total: 0 };
    }
    if (situacao === "EM ABERTO") acc[nome].aberto++;
    if (situacao === "EM PROCESSO") acc[nome].processo++;
    acc[nome].total = acc[nome].aberto + acc[nome].processo;
    return acc;
  };

  const contagemPorSolicitante = osParaRanking.reduce(
    (acc, os) => gerarContagemStatus(acc, os.solicitante, os.situacao),
    {}
  );

  const contagemPorExecutor = osParaRanking.reduce(
    (acc, os) => gerarContagemStatus(acc, os.executor, os.situacao),
    {}
  );

  const rankingDataSolicitante = Object.entries(contagemPorSolicitante)
    .map(([nome, stats]) => ({ nome, ...stats }))
    .sort((a, b) => b.total - a.total);

  const rankingDataExecutor = Object.entries(contagemPorExecutor)
    .map(([nome, stats]) => ({ nome, ...stats }))
    .sort((a, b) => b.total - a.total);

  const gerarMensagemWhatsApp = (os, tipo = "abertura") => {
    const isAbertura = tipo === "abertura";
    const titulo = isAbertura ? "*NOVA OS ABERTA* ❄️" : "*OS FINALIZADA* ✅";
    const numero = isAbertura ? os.numeroOS || nextNumber : numeroOSParaBuscar;
    const linkFoto = isAbertura ? os.arquivoAbertura : os.arquivoFechamento;
    const campoFoto = linkFoto ? `\n🖼️ *Ver Foto:* ${linkFoto}` : "";

    const relatorioTecnico = !isAbertura
      ? `\n🛠️ *Relatório de fechamento:* ${
          os.descricaoFechamento || "Concluído"
        }\n📦 *Peças utilizadas:* ${os.pecasUtilizadas || "Nenhuma"}`
      : "";

    const texto =
      `${titulo}\n\n` +
      `🚨 *Prioridade:* ${os.prioridade}\n` +
      `📌 *OS:* #${numero}\n` +
      `📍 *Setor:* ${os.setor}\n` +
      `⚙️ *Equipamento:* ${os.equipamento}\n` +
      `👤 *Solicitante:* ${os.solicitante}\n` +
      `👤 *Executor:* ${os.executor || "Não definido"}\n` +
      `📝 *Descrição:* ${os.descricaoAbertura}` +
      relatorioTecnico +
      campoFoto;
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
          <h3 style={{ color: "red" }}>
            OBS: A OS DEVE SER FINALIZADA PELO SOLICITANTE
          </h3>
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
          <h3>Ranking Solicitantes</h3>
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
            <span style={{ color: "#656363", fontSize: "1rem" }}>
              <b style={{ color: "#c82800" }}>A</b> : Em aberto
            </span>
            <span style={{ color: "#656363", fontSize: "1rem" }}>
              <b style={{ color: "#00aeff" }}>P</b> : Em processo
            </span>
          </div>
          <p>Status das OS ativas</p>
          {rankingDataSolicitante.length > 0 ? (
            <S.RankingWrapper>
              {rankingDataSolicitante.map((item, index) => (
                <div
                  key={item.nome}
                  onClick={() => abrirDetalhes(item.nome, "Status")}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    cursor: "pointer",
                    padding: "10px 0",
                    borderBottom:
                      index !== rankingDataSolicitante.length - 1
                        ? "1px solid #eee"
                        : "none",
                  }}
                >
                  <span
                    style={{
                      fontWeight: "600",
                      fontSize: "1.2rem",
                      color: "#333",
                    }}
                  >
                    {index + 1}º {item.nome}
                  </span>

                  <div
                    style={{
                      display: "flex",
                      gap: "5px",
                    }}
                  >
                    {/* Badge de Aberto */}
                    <span
                      style={{
                        backgroundColor: "#c82800",
                        color: "white",
                        padding: "2px 8px",
                        borderRadius: "6px",
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                      }}
                      title="Abertas"
                    >
                      {item.aberto} A
                    </span>
                    {/* Badge de Processo */}
                    <span
                      style={{
                        backgroundColor: "#00aeff",
                        color: "white",
                        padding: "2px 8px",
                        borderRadius: "6px",
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                      }}
                      title="Em Processo"
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

        {/* RANKING EXECUTORES */}
        <S.Card>
          <h3>Ranking Executores</h3>
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
            <span style={{ color: "#656363", fontSize: "1rem" }}>
              <b style={{ color: "#c82800" }}>A</b> : Em aberto
            </span>
            <span style={{ color: "#656363", fontSize: "1rem" }}>
              <b style={{ color: "#00aeff" }}>P</b> : Em processo
            </span>
          </div>
          <p>Status das OS ativas</p>
          {rankingDataExecutor.length > 0 ? (
            <S.RankingWrapper>
              {rankingDataExecutor.map((item, index) => (
                <div
                  key={item.nome}
                  onClick={() => abrirDetalhes(item.nome, "Executor")}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    cursor: "pointer",
                    padding: "10px 0",
                    borderBottom:
                      index !== rankingDataExecutor.length - 1
                        ? "1px solid #eee"
                        : "none",
                  }}
                >
                  <span
                    style={{
                      fontWeight: "600",
                      fontSize: "1.2rem",
                      color: "#333",
                    }}
                  >
                    {index + 1}º {item.nome}
                  </span>

                  <div style={{ display: "flex", gap: "5px" }}>
                    <span
                      style={{
                        backgroundColor: "#c82800",
                        color: "white",
                        padding: "2px 8px",
                        borderRadius: "6px",
                        fontSize: "1.1rem",
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
                        fontSize: "1.1rem",
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
