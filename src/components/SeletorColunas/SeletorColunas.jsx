import React from "react";
import * as S from "./styles";

export default function SeletorColunas({
  colunasVisiveis,
  toggleColuna,
  IDS_COLUNAS,
  onClose,
}) {
  const nomesAmigaveis = {
    [IDS_COLUNAS.NUMERO]: "Nº OS",
    [IDS_COLUNAS.ABERTURA]: "Data de Abertura",
    [IDS_COLUNAS.SETOR]: "Setor",
    [IDS_COLUNAS.SOLICITANTE]: "Solicitante",
    [IDS_COLUNAS.EXECUTOR]: "Executor",
    [IDS_COLUNAS.EQUIPAMENTO]: "Equipamento",
    [IDS_COLUNAS.DESCRICAO]: "Descrição da OS",
    [IDS_COLUNAS.STATUS]: "Status / Situação",
    [IDS_COLUNAS.PRIORIDADE]: "Prioridade",
    [IDS_COLUNAS.FOTO_INI]: "Foto de Abertura",
    [IDS_COLUNAS.FECHAMENTO]: "Data de Conclusão",
    [IDS_COLUNAS.PECAS]: "Peças Utilizadas",
    [IDS_COLUNAS.VALOR]: "Valor das Peças",
    [IDS_COLUNAS.FOTO_FIM]: "Foto de Fechamento",
    [IDS_COLUNAS.OBS]: "Observação Técnica",
    [IDS_COLUNAS.ACOES]: "Ações (Excluir)",
  };

  return (
    <>
      <S.Overlay onClick={onClose} />
      <S.Container>
        <S.Titulo>Configurar Colunas</S.Titulo>
        {Object.values(IDS_COLUNAS).map((id) => (
          <S.OpcaoItem key={id} $active={colunasVisiveis.includes(id)}>
            <input
              type="checkbox"
              checked={colunasVisiveis.includes(id)}
              onChange={() => toggleColuna(id)}
            />
            <span>{nomesAmigaveis[id]}</span>
          </S.OpcaoItem>
        ))}
      </S.Container>
    </>
  );
}
