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

                    <div className="descricao-box">
                      <span className="label">Problema Original:</span>
                      <p className="texto">{os.descricaoAbertura}</p>

                      {os.situacao === "EM PROCESSO" &&
                        os.descricaoProcesso && (
                          <>
                            <hr
                              style={{
                                border: "0",
                                borderTop: "1px solid #1f1f23",
                                margin: "12px 0",
                              }}
                            />
                            <span className="label">Andamento Atual:</span>
                            <p className="texto">{os.descricaoProcesso}</p>
                          </>
                        )}
                    </div>
                  </S.CardContent>
                </S.OSCard>
              ))}
            </S.CardsContainer>
          ) : (
            <S.AvisoVazio>
              {status === "Executor"
                ? "Nenhuma OS pendente para este técnico."
                : "Nenhuma OS pendente para este solicitante."}
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
