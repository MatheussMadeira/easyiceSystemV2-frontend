import React from "react";
import * as S from "./styles";
import { useAuth } from "../../services/AuthProvider.jsx"; // Importamos o Auth para saber QUEM está logado
import { MessageCircle } from "lucide-react"; // Importe o ícone
const formatarMoeda = (valor) => {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

const formatarData = (dataString) => {
  if (!dataString) return "Data não informada";
  const data = new Date(dataString);
  return (
    data.toLocaleDateString("pt-BR") +
    " às " +
    data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
  );
};
const formatarDataEntrega = (dataString) => {
  if (!dataString) return "Não definida";
  const [ano, mes, dia] = dataString.split("T")[0].split("-");
  if (!ano || !mes || !dia) return "Não definida";
  return `${dia}/${mes}/${ano}`;
};
const handleReenviarWpp = async (os) => {
  const prioridadeCurta = os.prioridade
    ? os.prioridade.split(" ")[0].toUpperCase()
    : "NORMAL";

  const linkFoto = os.arquivoAbertura
    ? `\n🖼️ *Link da Foto:* ${os.arquivoAbertura}`
    : "\n🖼️ *Foto:* Não anexada";

  const texto =
    `📢 *ORDEM DE SERVIÇO - #${os.numeroOS}* \n\n` +
    `🔥 *PRIORIDADE:* ${prioridadeCurta}\n` +
    `----------------------------------\n` +
    `⚙️ *EQUIPAMENTO:* ${os.equipamento}\n` +
    `📍 *SETOR:* ${os.setor}\n` +
    `👤 *SOLICITANTE:* ${os.solicitante}\n` +
    `🛠️ *EXECUTOR:* ${os.executor || "A DEFINIR"}\n` +
    `📝 *PROBLEMA:* ${os.descricaoAbertura}\n` +
    `📅 *ABERTA EM:* ${new Date(os.createdAt).toLocaleDateString()}\n` +
    `🔧 *STATUS:* ${os.situacao?.toUpperCase()}`;
  `----------------------------------\n` +
    linkFoto +
    `\n\n` +
    `📅 *DATA:* ${new Date().toLocaleDateString()} às ${new Date().toLocaleTimeString(
      [],
      { hour: "2-digit", minute: "2-digit" }
    )}`;
  if (navigator.share) {
    try {
      await navigator.share({
        text: texto,
      });
      console.log("Compartilhamento aberto com sucesso");
    } catch (err) {
      window.open(
        `https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`,
        "_blank"
      );
    }
  } else {
    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`,
      "_blank"
    );
  }
};
const ModalExecutor = ({
  isOpen,
  onClose,
  title,
  data,
  status,
  onFinalizar,
}) => {
  const { user } = useAuth();
  if (!isOpen) return null;

  const isAdmin = user?.funcoes?.includes("ADMIN");
  const isExecutorReal = user?.funcoes?.includes("EXECUTOR");
  const isSolicitanteReal = user?.funcoes?.includes("SOLICITANTE");

  return (
    <S.Overlay onClick={onClose}>
      <S.ModalContainer onClick={(e) => e.stopPropagation()}>
        <S.ModalHeader>
          <h2>{title}</h2>
          <button onClick={onClose} className="close-btn">
            &times;
          </button>
        </S.ModalHeader>

        <S.ModalBody>
          {data && data.length > 0 ? (
            <S.CardsContainer>
              {data.map((os) => {
                const situacaoOS = os.situacao?.toUpperCase().trim();
                const osEstaPronta = situacaoOS === "PRONTO PARA FINALIZAÇÃO";
                const podeAtualizar =
                  status === "Executor" && (isExecutorReal || isAdmin);
                const isDonoDaOS =
                  os.solicitante?.toUpperCase().trim() ===
                  user?.nome?.toUpperCase().trim();
                const podeConcluir =
                  status === "Solicitante" &&
                  osEstaPronta &&
                  (isDonoDaOS || isAdmin);

                const exibirBotao = podeAtualizar || podeConcluir;

                const textoBotaoAcao = podeAtualizar
                  ? "Atualizar Andamento"
                  : "Conferir e Finalizar";
                const corBotao = podeAtualizar ? "#3b82f6" : "#22c55e";

                return (
                  <S.OSCard key={os._id}>
                    <S.CardHeader>
                      <div className="header-left">
                        <span className="numero">#{os.numeroOS}</span>
                        <S.PrioridadeBadge prioridade={os.prioridade}>
                          <span className="dot"></span>
                          {os.prioridade || "Normal"}
                        </S.PrioridadeBadge>
                      </div>
                      <S.Badge status={os.situacao}>{os.situacao}</S.Badge>
                    </S.CardHeader>

                    <S.CardContent>
                      <S.BotaoWhatsAppContainer
                        onClick={() => handleReenviarWpp(os)}
                      >
                        <MessageCircle size={18} />
                        Enviar OS via WhatsApp
                      </S.BotaoWhatsAppContainer>
                      <S.InfoGridPrincipal>
                        <div className="info-item">
                          <label>Equipamento</label>
                          <p>{os.equipamento}</p>
                        </div>
                        <div className="info-item">
                          <label>Setor</label>
                          <p>{os.setor}</p>
                        </div>
                        <div className="info-item">
                          <label>Executor</label>
                          <p>{os.executor}</p>
                        </div>
                        <div className="info-item">
                          <label>Solicitante</label>
                          <p>{os.solicitante}</p>
                        </div>
                        <div className="info-item">
                          <label>Abertura</label>
                          <p>{formatarData(os.createdAt)}</p>
                        </div>
                        <div className="info-item">
                          <label>Previsão de Entrega</label>
                          <p
                            style={{
                              color: os.dataPrevista ? "#f97316" : "#71717a",
                              fontWeight: os.dataPrevista ? "700" : "400",
                            }}
                          >
                            {os.dataPrevista
                              ? formatarDataEntrega(os.dataPrevista)
                              : "A definir"}
                          </p>
                        </div>
                      </S.InfoGridPrincipal>

                      <S.DescricaoWrapper>
                        <div className="item">
                          <S.LabelDescricao>Problema Original</S.LabelDescricao>
                          <p className="texto">{os.descricaoAbertura}</p>
                        </div>
                        {os.descricaoProcesso && (
                          <div className="item top-border">
                            <S.LabelDescricao>
                              Último Andamento
                            </S.LabelDescricao>
                            <p className="texto">{os.descricaoProcesso}</p>
                          </div>
                        )}
                      </S.DescricaoWrapper>

                      {exibirBotao && (
                        <S.CardActionWrapper>
                          <S.DividerAction />
                          <S.BotaoAcaoCard
                            cor={corBotao}
                            onClick={() => onFinalizar && onFinalizar(os)}
                          >
                            {textoBotaoAcao}
                          </S.BotaoAcaoCard>
                        </S.CardActionWrapper>
                      )}

                      {!exibirBotao &&
                        status === "Solicitante" &&
                        !osEstaPronta && (
                          <S.AvisoVazio
                            style={{
                              padding: "10px",
                              marginTop: "10px",
                              fontSize: "11px",
                            }}
                          >
                            Aguardando o técnico concluir a manutenção...
                          </S.AvisoVazio>
                        )}
                    </S.CardContent>
                  </S.OSCard>
                );
              })}
            </S.CardsContainer>
          ) : (
            <S.AvisoVazio>Sem ordens pendentes aqui.</S.AvisoVazio>
          )}
        </S.ModalBody>

        <S.ModalFooter>
          <S.BotaoFechar onClick={onClose}>Fechar Janela</S.BotaoFechar>
        </S.ModalFooter>
      </S.ModalContainer>
    </S.Overlay>
  );
};

export default ModalExecutor;
