import React from "react";
import * as S from "./styles";

const SeletorGrade = ({
  tipo,
  opcoes,
  valorAtual,
  aoSelecionar,
  onClose,
  acaoCriarUsuario,
  acaoEditarUsuario,
}) => {
  return (
    <S.PopoverWrapper>
      <S.PopoverHeader>
        <span>Selecionar {tipo}</span>
        <button onClick={onClose}>✕</button>
      </S.PopoverHeader>

      <S.ListaOpcoes>
        {opcoes?.map((opt) => (
          <S.OpcaoItem key={opt} active={opt === valorAtual}>
            <div className="nome-clicavel" onClick={() => aoSelecionar(opt)}>
              {opt}
            </div>

            {/* Botão de Edição (Pincel) */}
            {(tipo === "solicitante" || tipo === "executor") && (
              <S.BotaoEditarMini onClick={() => acaoEditarUsuario(opt)}>
                ✎
              </S.BotaoEditarMini>
            )}
          </S.OpcaoItem>
        ))}
      </S.ListaOpcoes>

      {(tipo === "solicitante" || tipo === "executor") && (
        <S.PopoverFooter>
          <S.BotaoAdicionarRapido onClick={acaoCriarUsuario}>
            + Adicionar Novo Usuário
          </S.BotaoAdicionarRapido>
        </S.PopoverFooter>
      )}
    </S.PopoverWrapper>
  );
};

export default SeletorGrade;
