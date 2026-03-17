import React from "react";
import * as S from "./styles";

export default function FiltroAvancado({
  opcoes,
  filtros,
  toggleFiltro,
  setFiltros,
  onClose,
}) {
  const getIniciais = (nome) => {
    if (!nome || typeof nome !== "string") return "?";
    const partes = nome.trim().split(" ");
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
    <>
      {/* 1. OVERLAY: Camada invisível que detecta o clique fora */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 998, // Um número abaixo do Wrapper do filtro
          background: "transparent", // Ou 'rgba(0,0,0,0.1)' se quiser escurecer o fundo
        }}
      />

      {/* 2. WRAPPER DO FILTRO: Com z-index maior para ficar acima do overlay */}
      <S.PopoverFiltroWrapper style={{ width: "950px", zIndex: 999 }}>
        <S.PopoverHeader
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <span
            style={{ color: "#fff", fontWeight: "bold", whiteSpace: "nowrap" }}
          >
            Filtros Avançados
          </span>

          <input
            type="text"
            placeholder="Filtrar por Nº de OS..."
            value={filtros.numeroOS || ""}
            onChange={(e) =>
              setFiltros((prev) => ({ ...prev, numeroOS: e.target.value }))
            }
            onClick={(e) => e.stopPropagation()} // Impede que o clique no input feche o filtro
            style={{
              flex: 1,
              margin: "0 20px",
              background: "#18181b",
              border: "1px solid #27272a",
              color: "#fff",
              padding: "8px 12px",
              borderRadius: "6px",
              outline: "none",
            }}
          />

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

        <S.FiltroGridColunas
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "15px",
          }}
        >
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
            itens={[
              "Normal (Sequência de execução)",
              "Alta (No decorrer do dia)",
              "Emergencia (Atendimento Imediato)",
            ]}
            comIniciais
          />
        </S.FiltroGridColunas>
      </S.PopoverFiltroWrapper>
    </>
  );
}
