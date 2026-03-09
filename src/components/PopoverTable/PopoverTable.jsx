// PopoverTable.jsx
import * as S from "./styles";
import React from "react";

const SeletorGrade = ({ opcoes, valorAtual, aoSelecionar, onClose }) => {
  return (
    <S.PopoverGrade onClick={(e) => e.stopPropagation()}>
      <S.GradeHeader>
        <span>Selecionar Opção</span>
        <button onClick={onClose}>&times;</button>
      </S.GradeHeader>

      <S.GradeContainer>
        {opcoes?.map((opt) => {
          // Garante que temos uma string para exibir e para o charAt
          const textoExibicao =
            typeof opt === "string" ? opt : opt.nome || opt.label || "";
          const idUnico = opt._id || opt.value || textoExibicao;

          return (
            <S.BotaoOpcao
              key={idUnico}
              ativo={valorAtual === textoExibicao}
              onClick={() => {
                aoSelecionar(textoExibicao);
                onClose();
              }}
            >
              <span className="avatar">
                {textoExibicao ? textoExibicao.charAt(0).toUpperCase() : "?"}
              </span>
              <span className="nome">{textoExibicao}</span>
            </S.BotaoOpcao>
          );
        })}
      </S.GradeContainer>
    </S.PopoverGrade>
  );
};

export default SeletorGrade;
