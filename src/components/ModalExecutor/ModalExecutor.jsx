import React from "react";
import * as S from "./styles";

const ModalExecutor = ({ isOpen, onClose, title, data, status }) => {
  if (!isOpen) return null;

  return (
    <S.Overlay onClick={onClose}>
      <S.ModalContainer onClick={(e) => e.stopPropagation()}>
        <S.ModalHeader>
          <h2>{title}</h2>
          <button onClick={onClose}>&times;</button>
        </S.ModalHeader>

        <S.ModalBody>
          {data.length > 0 ? (
            <S.CardsContainer>
              {data.map((os) => (
                <S.OSCard key={os._id}>
                  <S.CardHeader>
                    <span className="numero">#{os.numeroOS}</span>
                    <S.Badge status={os.situacao}>{os.situacao}</S.Badge>
                  </S.CardHeader>

                  <S.CardContent>
                    <p>
                      <strong>Equipamento:</strong> {os.equipamento}
                    </p>
                    <p>
                      <strong>Setor:</strong> {os.setor}
                    </p>
                    <div className="descricao">
                      <div
                        style={{
                          marginTop: "10px",
                          padding: "12px",
                          borderRadius: "4px",
                          borderLeft: "4px solid #2196f3",
                        }}
                      >
                        <p
                          style={{
                            marginBottom:
                              os.situacao === "EM PROCESSO" ? "10px" : "0",
                          }}
                        >
                          <strong style={{ color: "#1976d2" }}>
                            📝 Problema Original (Abertura):
                          </strong>{" "}
                          <p style={{ marginTop: "4px", marginLeft: "3px" }}>
                            • {os.descricaoAbertura}
                          </p>
                        </p>
                        {os.situacao === "EM PROCESSO" &&
                          os.descricaoProcesso && (
                            <hr
                              style={{
                                border: "0",
                                borderTop: "1px solid #bbdefb",
                                margin: "8px 0",
                              }}
                            />
                          )}
                        {os.situacao === "EM PROCESSO" &&
                          os.descricaoProcesso && (
                            <>
                              <strong style={{ color: "#1976d2" }}>
                                🛠️ Andamento atual:
                              </strong>
                              <p
                                style={{ marginTop: "4px", marginLeft: "3px" }}
                              >
                                • {os.descricaoProcesso}
                              </p>
                            </>
                          )}
                      </div>
                    </div>
                  </S.CardContent>
                </S.OSCard>
              ))}
            </S.CardsContainer>
          ) : (
            <S.AvisoVazio>
              {status === "Executor"
                ? "Nenhuma OS pendente para este técnico."
                : "Nunhuma OS no nome desse solicitante"}
            </S.AvisoVazio>
          )}
        </S.ModalBody>

        <S.ModalFooter>
          <S.BotaoFechar onClick={onClose}>Fechar</S.BotaoFechar>
        </S.ModalFooter>
      </S.ModalContainer>
    </S.Overlay>
  );
};

export default ModalExecutor;
