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
  largura,
}) => {
  // Função para gerar as iniciais
  const getIniciais = (nome) => {
    if (!nome || typeof nome !== "string") return "?";
    const partes = nome.trim().split(" ");
    if (partes.length > 1) {
      return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
    }
    return partes[0][0].toUpperCase();
  };

  return (
    <S.PopoverWrapper largura={largura}>
      <S.PopoverHeader>
        <span>Selecionar {tipo}</span>
        <button onClick={onClose}>✕</button>
      </S.PopoverHeader>

      <S.ListaOpcoes>
        {opcoes?.map((opt, index) => {
          const labelExibicao = typeof opt === "object" ? opt.label : opt;
          const valorReal = typeof opt === "object" ? opt.value : opt;

          return (
            <S.OpcaoItem
              key={`${valorReal}-${index}`}
              $active={valorReal === valorAtual}
            >
              {/* Container que envolve as iniciais e o nome */}
              <div
                className="nome-clicavel"
                onClick={() => aoSelecionar(valorReal)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  flex: 1,
                  gap: "12px", // Espaço entre o círculo e o texto
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    backgroundColor: "rgba(59, 130, 246, 0.15)",
                    color: "#3b82f6",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: "bold",
                    flexShrink: 0,
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                  }}
                >
                  {getIniciais(labelExibicao)}
                </div>

                <span style={{ color: "#fafafa" }}>{labelExibicao}</span>
              </div>

              {/* Botão de Edição (Pincel) - Só aparece na Tabela */}
              {acaoEditarUsuario && (
                <S.BotaoEditarMini
                  onClick={(e) => {
                    e.stopPropagation();
                    acaoEditarUsuario(valorReal);
                  }}
                >
                  ✎
                </S.BotaoEditarMini>
              )}
            </S.OpcaoItem>
          );
        })}
      </S.ListaOpcoes>

      {/* Botão de Adicionar - Só aparece na Tabela */}
      {acaoCriarUsuario && (
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
