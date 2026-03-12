import React from "react";
import * as S from "./styles";

export default function FiltroAvancado({
  opcoes,
  filtros,
  toggleFiltro,
  onClose,
}) {
  const getIniciais = (nome) => {
    if (!nome || typeof nome !== "string") return "?";
    const partes = nome.trim().split(" ");
    // Pega as iniciais ou as duas primeiras letras se for palavra única (ex: Setor)
    if (partes.length > 1) {
      return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
    }
    return nome.length > 1
      ? nome.substring(0, 2).toUpperCase()
      : nome[0].toUpperCase();
  };

  const ColunaFiltro = ({ titulo, itens, categoria, comIniciais = false }) => (
    <S.FiltroColuna>
      <h4>{titulo}</h4>
      <S.FiltroListaScroll>
        {itens?.map((item, idx) => {
          const label = typeof item === "object" ? item.label : item;
          const value = typeof item === "object" ? item.value : item;

          return (
            <S.FiltroItem
              key={`${categoria}-${idx}`}
              $active={filtros[categoria]?.includes(value)}
              onClick={() => toggleFiltro(categoria, value)}
            >
              {comIniciais && (
                <S.AvatarIniciais>{getIniciais(label)}</S.AvatarIniciais>
              )}
              <span>{label}</span>
            </S.FiltroItem>
          );
        })}
      </S.FiltroListaScroll>
    </S.FiltroColuna>
  );

  return (
    <S.PopoverFiltroWrapper style={{ width: "950px" }}>
      {" "}
      {/* Aumentei a largura para 5 colunas */}
      <S.PopoverHeader
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <span style={{ color: "#fff", fontWeight: "bold" }}>
          Filtros Avançados
        </span>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "#71717a",
            cursor: "pointer",
            fontSize: "18px",
          }}
        >
          ✕
        </button>
      </S.PopoverHeader>
      {/* Ajustei o inline style para 5 colunas */}
      <S.FiltroGridColunas style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
        <ColunaFiltro
          titulo="Situação"
          categoria="situacao"
          itens={["EM ABERTO", "EM PROCESSO", "CONCLUÍDO"]}
          comIniciais
        />
        <ColunaFiltro
          titulo="Setores"
          categoria="setor"
          itens={opcoes?.setores}
          comIniciais
        />
        <ColunaFiltro
          titulo="Solicitantes"
          categoria="solicitante"
          itens={opcoes?.solicitantes}
          comIniciais
        />
        <ColunaFiltro
          titulo="Executores"
          categoria="executor"
          itens={opcoes?.executores}
          comIniciais
        />
        <ColunaFiltro
          titulo="Prioridade"
          categoria="prioridade"
          itens={opcoes?.prioridades}
          comIniciais
        />
      </S.FiltroGridColunas>
    </S.PopoverFiltroWrapper>
  );
}
