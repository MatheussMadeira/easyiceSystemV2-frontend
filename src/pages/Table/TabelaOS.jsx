import React, { useEffect } from "react";
import { useOS } from "../../hooks/useOS";
import * as S from "./styles";

const TabelaOS = () => {
  const API_URL = "http://localhost:3001";
  const { ordens, loading, useGetOs, useDeleteOs, useUpdateInline } = useOS();

  useEffect(() => {
    useGetOs();
  }, []);
  useEffect(() => {
    if (ordens.length > 0) {
      console.log("DEBUG BACKEND - Primeira OS da lista:", ordens[0]);
    }
  }, [ordens]);
  const formatarData = (data) => {
    if (!data) return "-";

    const d = new Date(data);
    if (isNaN(d.getTime()) || d.getFullYear() <= 1970) return "-";

    const horas = d.getHours();
    const minutos = d.getMinutes();

    if ((horas === 6 || horas === 0 || horas === 3) && minutos === 0) {
      return d.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }

    return d.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const getPriorityColor = (prioridade) => {
    const cores = {
      ALTA: "#df2f4a", // Vermelho (Urgente)
      MÉDIA: "#fdab3d", // Laranja/Amarelo
      BAIXA: "#00c875", // Verde
      NORMAL: "#c4c4c4", // Cinza
    };
    return cores[prioridade?.toUpperCase()] || "#c4c4c4";
  };
  const getStatusColor = (status) => {
    const cores = {
      CONCLUÍDO: "#00c875",
      "EM ABERTO": "#fdab3d",
      "EM PROCESSO": "#579bfc",
      CANCELADA: "#df2f4a",
    };
    return cores[status] || "#c4c4c4";
  };

  // INLINE TABLE

  const handleUpdateInline = async (id, campo, valorOriginal, novoValor) => {
    if (valorOriginal === novoValor) return;

    try {
      const dadosParaAtualizar = { [campo]: novoValor };

      console.log("Enviando atualização:", dadosParaAtualizar);

      await useUpdateInline(id, dadosParaAtualizar);

      console.log(`Campo ${campo} atualizado com sucesso!`);
    } catch (error) {
      console.error("Erro na atualização inline:", error);
      alert("Não foi possível salvar a alteração.");
    }
  };
  const LISTA_SETORES = [
    "ACAI",
    "ADMINISTRATIVO",
    "AÇAÍ",
    "BANHEIROS",
    "BOMBOM DE FRUTA",
    "CAMARAS",
    "COMERCIAL",
    "DML",
    "EXPEDICAO",
    "FRUTA CONG",
    "GALPÃO CINZA",
    "GALPÃO ROXO",
    "HIGIENIZACAO",
    "INFRA ESTRUTURA",
    "LOJA",
    "MEZANINO",
    "PICOLE",
    "PRODUÇÕES",
    "QUALIDADE",
    "REFEITORIO",
    "RH",
    "ROTULADORA",
    "SALA DE DILUIÇÃO",
    "SALA DE REUNIÃO",
    "SALA INVERSORES",
    "SEGURANCA/TI",
    "SEGURANÇA",
    "SORVETE",
    "VESTIARIOS",
    "VEÍCULOS",
    "ÁREA EXTERNA",
  ];
  const LISTA_SOLICITANTES = [
    "Bruno",
    "Cláudio Bispo",
    "Eduardo",
    "Everton Melo",
    "FREDERICO MADEIRA",
    "Frederico",
    "GABRIEL",
    "Italo",
    "José",
    "Mariane",
    "NATANAEL",
    "Raul",
    "THIAGO FREITAS",
    "Thiago Bastos",
    "Thiago Freitas",
    "Wasley",
    "Wellington Luiz",
    "Welliton Cruz",
  ];
  const LISTA_EXECUTORES = [
    "Alan",
    "Claudio Bispo",
    "Everton Melo",
    "Frederico Madeira",
    "Jean Camara",
    "José",
    "josé",
  ];
  const getCorExecutor = (nome) => {
    if (!nome) return "#f1f3f5";

    const n = nome.toUpperCase();

    // Azul Royal (Técnicos Principais)
    if (n.includes("ALAN")) return "#5797ff";

    // Verde Bandeira Suave (Manutenção Geral)
    if (n.includes("CLÁUDIO") || n.includes("CLAUDIO")) return "#00c875";

    if (n.includes("JOSÉ") || n.includes("CLAUDIO")) return "#7f4232";

    // Roxo Vibrante (Especialistas)
    if (n.includes("EVERTON")) return "#a25ddc";

    // Laranja Intenso (Liderança/Supervisão)
    if (n.includes("FREDERICO") || n.includes("GABRIEL")) return "#ffad33";

    // Rosa Choque/Magenta (Suporte/Outros)
    if (n.includes("JEAN")) return "#e2445c";

    return "#c4c4c4"; // Cinza sólido para nomes não mapeados
  };
  const getCorPersonalizada = (nome) => {
    if (!nome) return "#f1f3f5";

    const n = nome.toUpperCase();

    // Amarelo / Laranja (Diretoria/Liderança)
    if (n.includes("GABRIEL") || n.includes("FREDERICO")) return "#ffeed2";

    // Azul (Produção/Operacional)
    if (n.includes("WASLEY") || n.includes("EVERTON") || n.includes("PICOLE"))
      return "#e2e4f9";

    // Verde (Qualidade/Segurança)
    if (n.includes("MARIANE") || n.includes("CLÁUDIO BISPO")) return "#dff0d8";

    // Ciano/Azul Claro (TI/Infra)
    if (n.includes("ITALO") || n.includes("JOSÉ")) return "#e1f5fe";

    // Roxo/Rosa (Outros)
    if (n.includes("THIAGO") || n.includes("WELLINGTON")) return "#f1e5f9";

    return "#f1e5f9"; // Cinza padrão para o restante
  };
  ////////////////////////////////////////////////

  if (loading) return <div>Carregando...</div>;

  return (
    <S.PaginaContainer>
      <S.HeaderFixo>
        <h1 style={{ fontSize: "26px" }}>Ordens de Serviço</h1>
      </S.HeaderFixo>

      <S.TabelaWrapper>
        <S.TabelaStyled>
          <thead>
            <S.TrHeader>
              <S.Th>Nº OS</S.Th>
              <S.Th>Data Abertura</S.Th>
              <S.Th>Setor</S.Th>
              <S.Th>Solicitante</S.Th>
              <S.Th>Executor</S.Th>
              <S.Th>Equipamento</S.Th>
              <S.Th>Descrição</S.Th>
              <S.Th>Status</S.Th>
              <S.Th>Prioridade</S.Th>
              <S.Th>Arquivos Abertura</S.Th>
              <S.Th>Data Fechamento</S.Th>
              <S.Th>Peças</S.Th>
              <S.Th>Valor Peças</S.Th>
              <S.Th>Arquivos Fechamento</S.Th>
              <S.Th>Obs Fechamento</S.Th>
              <S.Th>Ações</S.Th>
            </S.TrHeader>
          </thead>
          <tbody>
            {ordens.map((os) => (
              <tr key={os._id}>
                <S.Td style={{ color: "#0073ea", fontWeight: "500" }}>
                  #{os.numeroOS}
                </S.Td>
                <S.Td>{formatarData(os.createdAt || os.dataAbertura)}</S.Td>
                <S.TdSelect width="180px">
                  <S.SelectIdentificacao
                    value={os.setor?.trim()}
                    onChange={(e) =>
                      handleUpdateInline(
                        os._id,
                        "setor",
                        os.setor,
                        e.target.value
                      )
                    }
                  >
                    <option value="">Selecione...</option>
                    {LISTA_SETORES.map((setor) => (
                      <option key={setor} value={setor}>
                        {setor}
                      </option>
                    ))}
                  </S.SelectIdentificacao>
                </S.TdSelect>
                <S.TdSelect width="200px">
                  <S.SelectIdentificacao
                    value={os.solicitante}
                    bgColor={getCorPersonalizada(os.solicitante)}
                    onChange={(e) =>
                      handleUpdateInline(
                        os._id,
                        "solicitante",
                        os.solicitante,
                        e.target.value
                      )
                    }
                  >
                    <option value="">Selecione...</option>
                    {LISTA_SOLICITANTES.map((nome) => (
                      <option key={nome} value={nome}>
                        {nome}
                      </option>
                    ))}
                  </S.SelectIdentificacao>
                </S.TdSelect>
                <S.TdSelect width="200px">
                  <S.SelectIdentificacao
                    value={os.executor}
                    bgColor={getCorExecutor(os.executor)}
                    onChange={(e) =>
                      handleUpdateInline(
                        os._id,
                        "executor",
                        os.executor,
                        e.target.value
                      )
                    }
                  >
                    <option value="">Selecione...</option>
                    {LISTA_EXECUTORES.map((nome) => (
                      <option key={nome} value={nome}>
                        {nome}
                      </option>
                    ))}
                  </S.SelectIdentificacao>
                </S.TdSelect>
                <S.TdTexto width={"200px"}>
                  <S.EditableTextarea
                    defaultValue={os.equipamento}
                    onBlur={(e) =>
                      handleUpdateInline(
                        os._id,
                        "equipamento",
                        os.equipamento,
                        e.target.value
                      )
                    }
                    onInput={(e) => {
                      e.target.style.height = "auto";
                      e.target.style.height = e.target.scrollHeight + "px";
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        e.target.blur();
                      }
                    }}
                  />
                </S.TdTexto>
                <S.TdTexto width="300px">
                  <S.EditableTextarea
                    defaultValue={os.descricaoAbertura}
                    onBlur={(e) =>
                      handleUpdateInline(
                        os._id,
                        "descricaoAbertura",
                        os.descricaoAbertura,
                        e.target.value
                      )
                    }
                    onInput={(e) => {
                      e.target.style.height = "auto";
                      e.target.style.height = e.target.scrollHeight + "px";
                    }}
                  />
                </S.TdTexto>
                <S.TdSelect width="150px">
                  <S.SelectMonday
                    value={os.situacao?.trim() || ""}
                    bgColor={getStatusColor(os.situacao)}
                    onChange={(e) =>
                      handleUpdateInline(
                        os._id,
                        "situacao",
                        os.situacao,
                        e.target.value
                      )
                    }
                  >
                    {/* O value deve ser IDÊNTICO ao que está salvo no seu MongoDB */}
                    <option value="EM ABERTO">EM ABERTO</option>
                    <option value="EM PROCESSO">EM PROCESSO</option>
                    <option value="CONCLUÍDO">CONCLUÍDO</option>
                    <option value="CANCELADA">CANCELADA</option>
                  </S.SelectMonday>
                </S.TdSelect>
                {/* --- PRIORIDADE --- */}
                <S.TdSelect width="120px">
                  <S.SelectMonday
                    // Garante que o valor venha limpo e em caixa alta para bater com as options
                    value={os.prioridade?.toUpperCase() || "NORMAL"}
                    bgColor={getPriorityColor(os.prioridade)}
                    onChange={(e) =>
                      handleUpdateInline(
                        os._id,
                        "prioridade",
                        os.prioridade,
                        e.target.value
                      )
                    }
                  >
                    <option value="BAIXA">BAIXA</option>
                    <option value="NORMAL">NORMAL</option>
                    <option value="MÉDIA">MÉDIA</option>
                    <option value="ALTA">ALTA</option>
                  </S.SelectMonday>
                </S.TdSelect>
                <S.Td>
                  {os.arquivoAbertura ? (
                    <a
                      href={`${API_URL}/uploads/${os.arquivoAbertura}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        color: "#0073ea",
                        textDecoration: "none",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "4px",
                      }}
                    >
                      🖼️ Ver Foto
                    </a>
                  ) : (
                    <span style={{ color: "#c5c7d0" }}>-</span>
                  )}
                </S.Td>
                <S.Td>{formatarData(os.dataFechamento)}</S.Td>
                <S.TdTexto width="250px">
                  <S.EditableTextarea
                    defaultValue={os.pecasUtilizadas || ""}
                    onBlur={(e) =>
                      handleUpdateInline(
                        os._id,
                        "pecasUtilizadas",
                        os.pecasUtilizadas,
                        e.target.value
                      )
                    }
                    onInput={(e) => {
                      e.target.style.height = "auto";
                      e.target.style.height = e.target.scrollHeight + "px";
                    }}
                  />
                </S.TdTexto>
                <S.TdTexto width="120px">
                  <S.InputValor
                    type="number"
                    step="0.01"
                    defaultValue={os.valorPecas || ""}
                    placeholder="0,00"
                    onBlur={(e) => {
                      const novoValor = parseFloat(e.target.value);
                      handleUpdateInline(
                        os._id,
                        "valorPecas",
                        os.valorPecas,
                        novoValor
                      );
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") e.target.blur();
                    }}
                  />
                </S.TdTexto>
                <S.TdTexto width="250px">
                  <S.EditableTextarea
                    defaultValue={os.descricaoFechamento || ""}
                    onBlur={(e) =>
                      handleUpdateInline(
                        os._id,
                        "descricaoFechamento",
                        os.descricaoFechamento,
                        e.target.value
                      )
                    }
                    onInput={(e) => {
                      e.target.style.height = "auto";
                      e.target.style.height = e.target.scrollHeight + "px";
                    }}
                  />
                </S.TdTexto>
                <S.Td>
                  {os.arquivoFechamento ? (
                    <a
                      href={`${API_URL}/uploads/${os.arquivoFechamento}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        color: "#0073ea",
                        textDecoration: "none",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "4px",
                      }}
                    >
                      🖼️ Ver Foto
                    </a>
                  ) : (
                    <span style={{ color: "#c5c7d0" }}>-</span>
                  )}
                </S.Td>
                <S.Td>
                  <button onClick={() => useDeleteOs(os.numeroOS)}>🗑️</button>
                </S.Td>
              </tr>
            ))}
          </tbody>
        </S.TabelaStyled>
      </S.TabelaWrapper>
    </S.PaginaContainer>
  );
};

export default TabelaOS;
