import React, { useState } from "react";
import { useOS } from "../../hooks/useOS";
import * as S from "./styles";
import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";
import { useNavigate, useLocation } from "react-router-dom";
import * as H from "../../components/MenuHamburguer/menu";
import SeletorGrade from "../../components/PopoverTable/PopoverTable";

const TabelaOS = () => {
  const { useDeleteOs, useUpdateInline } = useOS();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuAberto, setMenuAberto] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [popoverAberto, setPopoverAberto] = useState(null);

  const { data: ordens = [], isLoading } = useQuery({
    queryKey: ["ordens"],
    queryFn: async () => {
      const res = await api.get("/os");
      return res.data;
    },
    refetchOnWindowFocus: false,
  });

  const { data: opcoes } = useQuery({
    queryKey: ["opcoes"],
    queryFn: async () => {
      const res = await api.get("/os/opcoes");
      return res.data;
    },
    staleTime: 600000,
  });

  const handleNavigation = (path) => {
    if (location.pathname === path) {
      setMenuAberto(false);
      return;
    }
    setIsNavigating(true);
    setMenuAberto(false);
    setTimeout(() => navigate(path), 500);
  };

  const getStatusStyles = (status) => {
    const configs = {
      CONCLUÍDO: {
        bg: "rgba(16, 185, 129, 0.15)",
        border: "rgba(16, 185, 129, 0.3)",
        text: "#10b981",
      },
      "EM PROCESSO": {
        bg: "rgba(59, 130, 246, 0.15)",
        border: "rgba(59, 130, 246, 0.3)",
        text: "#3b82f6",
      },
      "EM ABERTO": {
        bg: "rgba(245, 158, 11, 0.15)",
        border: "rgba(245, 158, 11, 0.3)",
        text: "#f59e0b",
      },
      CANCELADA: {
        bg: "rgba(239, 68, 68, 0.15)",
        border: "rgba(239, 68, 68, 0.3)",
        text: "#ef4444",
      },
    };
    return (
      configs[status] || { bg: "#18181b", border: "#27272a", text: "#71717a" }
    );
  };

  const getPriorityStyles = (prioridade) => {
    if (prioridade?.includes("Emergencia"))
      return {
        bg: "rgba(168, 85, 247, 0.15)",
        border: "rgba(168, 85, 247, 0.3)",
        text: "#a855f7",
      };
    if (prioridade?.includes("Alta"))
      return {
        bg: "rgba(239, 68, 68, 0.15)",
        border: "rgba(239, 68, 68, 0.3)",
        text: "#ef4444",
      };
    return {
      bg: "rgba(113, 113, 122, 0.15)",
      border: "rgba(113, 113, 122, 0.3)",
      text: "#a1a1aa",
    };
  };

  const handleUpdate = (id, campo, valor) => {
    useUpdateInline(id, { [campo]: valor });
  };

  return (
    <div>
      {(isLoading || isNavigating) && (
        <H.TransitionOverlay>
          <H.Spinner />
          <h2>Sincronizando base de dados...</h2>
        </H.TransitionOverlay>
      )}

      <H.MenuToggle onClick={() => setMenuAberto(!menuAberto)}>
        {menuAberto ? "✕" : "☰"}
      </H.MenuToggle>
      <H.MenuOverlay isOpen={menuAberto} onClick={() => setMenuAberto(false)} />
      <H.Sidebar isOpen={menuAberto}>
        <H.MenuItem
          active={location.pathname === "/"}
          onClick={() => handleNavigation("/")}
        >
          🗂️ Painel de Acompanhamento
        </H.MenuItem>
        <H.MenuItem
          active={location.pathname === "/tabela"}
          onClick={() => handleNavigation("/tabela")}
        >
          📊 Tabela de Ordens de Serviço
        </H.MenuItem>
      </H.Sidebar>

      <S.PaginaContainer>
        <S.HeaderFixo>
          <h1 style={{ color: "transparent" }}>.</h1>
          <div style={{ color: "#71717a", fontSize: "14px" }}>
            {ordens.length} Registros encontrados
          </div>
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
                <S.Th>Foto Aber.</S.Th>
                <S.Th>Fechamento</S.Th>
                <S.Th>Peças</S.Th>
                <S.Th>Valor R$</S.Th>
                <S.Th>Foto Fech.</S.Th>
                <S.Th>Obs. Técnica</S.Th>
                <S.Th>Ações</S.Th>
              </S.TrHeader>
            </thead>
            <tbody>
              {ordens.map((os) => {
                const sStyles = getStatusStyles(os.situacao);
                const pStyles = getPriorityStyles(os.prioridade);
                return (
                  <tr key={os._id}>
                    <S.Td style={{ fontWeight: "600", color: "#3b82f6" }}>
                      #{os.numeroOS}
                    </S.Td>
                    <S.Td style={{ color: "#52525b" }}>
                      {new Date(os.createdAt).toLocaleDateString()}
                    </S.Td>

                    {/* SETOR */}
                    <S.TdSelect width="200px">
                      <div
                        onClick={() =>
                          setPopoverAberto({ id: os._id, field: "setor" })
                        }
                        style={{
                          cursor: "pointer",
                          padding: "8px",
                          borderRadius: "4px",
                          background: "#1f1f23",
                          textAlign: "center",
                          fontSize: "13px",
                        }}
                      >
                        {os.setor}
                      </div>
                      {popoverAberto?.id === os._id &&
                        popoverAberto?.field === "setor" && (
                          <SeletorGrade
                            opcoes={opcoes?.setores}
                            valorAtual={os.setor}
                            aoSelecionar={(v) =>
                              handleUpdate(os._id, "setor", v)
                            }
                            onClose={() => setPopoverAberto(null)}
                          />
                        )}
                    </S.TdSelect>

                    {/* SOLICITANTE */}
                    <S.TdSelect width="180px">
                      <div
                        onClick={() =>
                          setPopoverAberto({ id: os._id, field: "solicitante" })
                        }
                        style={{
                          cursor: "pointer",
                          padding: "6px",
                          borderRadius: "4px",
                          background: "rgba(59, 130, 246, 0.1)",
                          color: "#3b82f6",
                          border: "1px solid rgba(59, 130, 246, 0.2)",
                          textAlign: "center",
                        }}
                      >
                        {os.solicitante}
                      </div>
                      {popoverAberto?.id === os._id &&
                        popoverAberto?.field === "solicitante" && (
                          <SeletorGrade
                            opcoes={opcoes?.solicitantes}
                            valorAtual={os.solicitante}
                            aoSelecionar={(v) =>
                              handleUpdate(os._id, "solicitante", v)
                            }
                            onClose={() => setPopoverAberto(null)}
                          />
                        )}
                    </S.TdSelect>

                    {/* EXECUTOR */}
                    <S.TdSelect width="180px">
                      <div
                        onClick={() =>
                          setPopoverAberto({ id: os._id, field: "executor" })
                        }
                        style={{
                          cursor: "pointer",
                          padding: "6px",
                          borderRadius: "4px",
                          background: os.executor
                            ? "rgba(16, 185, 129, 0.1)"
                            : "#18181b",
                          color: os.executor ? "#10b981" : "#71717a",
                          border: "1px solid rgba(16, 185, 129, 0.2)",
                          textAlign: "center",
                        }}
                      >
                        {os.executor || "Não Atribuído"}
                      </div>
                      {popoverAberto?.id === os._id &&
                        popoverAberto?.field === "executor" && (
                          <SeletorGrade
                            opcoes={opcoes?.executores}
                            valorAtual={os.executor}
                            aoSelecionar={(v) =>
                              handleUpdate(os._id, "executor", v)
                            }
                            onClose={() => setPopoverAberto(null)}
                          />
                        )}
                    </S.TdSelect>

                    <S.TdTexto width="180px">
                      <S.EditableTextarea
                        defaultValue={os.equipamento}
                        onBlur={(e) =>
                          handleUpdate(os._id, "equipamento", e.target.value)
                        }
                      />
                    </S.TdTexto>
                    <S.TdTexto width="480px">
                      <S.EditableTextarea
                        defaultValue={os.descricaoAbertura}
                        onBlur={(e) =>
                          handleUpdate(
                            os._id,
                            "descricaoAbertura",
                            e.target.value,
                          )
                        }
                      />
                    </S.TdTexto>

                    {/* SITUAÇÃO */}
                    <S.TdSelect width="180px">
                      <div
                        onClick={() =>
                          setPopoverAberto({ id: os._id, field: "situacao" })
                        }
                        style={{
                          cursor: "pointer",
                          padding: "6px",
                          borderRadius: "4px",
                          background: sStyles.bg,
                          border: `1px solid ${sStyles.border}`,
                          color: sStyles.text,
                          textAlign: "center",

                          fontWeight: "600",
                        }}
                      >
                        {os.situacao || "Não Atribuído"}
                      </div>
                      {popoverAberto?.id === os._id &&
                        popoverAberto?.field === "situacao" && (
                          <SeletorGrade
                            opcoes={[
                              "EM ABERTO",
                              "EM PROCESSO",
                              "CONCLUÍDO",
                              "CANCELADA",
                            ]}
                            valorAtual={os.situacao}
                            aoSelecionar={(v) =>
                              handleUpdate(os._id, "situacao", v)
                            }
                            onClose={() => setPopoverAberto(null)}
                          />
                        )}
                    </S.TdSelect>

                    {/* PRIORIDADE */}
                    <S.TdSelect width="160px">
                      <div
                        onClick={() =>
                          setPopoverAberto({ id: os._id, field: "prioridade" })
                        }
                        style={{
                          cursor: "pointer",
                          padding: "6px",
                          borderRadius: "4px",
                          background: pStyles.bg,
                          border: `1px solid ${pStyles.border}`,
                          color: pStyles.text,
                          textAlign: "center",
                        }}
                      >
                        {os.prioridade?.split(" ")[0] || "Normal"}
                      </div>
                      {popoverAberto?.id === os._id &&
                        popoverAberto?.field === "prioridade" && (
                          <SeletorGrade
                            opcoes={[
                              "Normal (Sequência de execução)",
                              "Alta (No decorrer do dia)",
                              "Emergencia (Atendimento Imediato)",
                            ]}
                            valorAtual={os.prioridade}
                            aoSelecionar={(v) =>
                              handleUpdate(os._id, "prioridade", v)
                            }
                            onClose={() => setPopoverAberto(null)}
                          />
                        )}
                    </S.TdSelect>

                    <S.Td>
                      <S.FotoWrapper>
                        {os.arquivoAbertura ? (
                          <a
                            href={os.arquivoAbertura}
                            target="_blank"
                            rel="noreferrer"
                            title="Clique para ver em tamanho real"
                          >
                            <S.FotoThumbnail>
                              {/* O timestamp ?t= força o navegador a atualizar se a foto mudar */}
                              <img
                                src={`${os.arquivoAbertura}?t=${new Date(os.createdAt).getTime()}`}
                                alt="Foto da OS"
                              />
                            </S.FotoThumbnail>
                          </a>
                        ) : (
                          <S.FotoThumbnail
                            className="vazio"
                            title="Nenhuma foto anexada"
                          />
                        )}
                      </S.FotoWrapper>
                    </S.Td>
                    <S.Td>
                      {os.dataFechamento
                        ? new Date(os.dataFechamento).toLocaleDateString()
                        : "-"}
                    </S.Td>
                    <S.TdTexto width="200px">
                      <S.EditableTextarea
                        defaultValue={os.pecasUtilizadas}
                        onBlur={(e) =>
                          handleUpdate(
                            os._id,
                            "pecasUtilizadas",
                            e.target.value,
                          )
                        }
                      />
                    </S.TdTexto>
                    <S.Td>R$ {os.valorPecas || "0,00"}</S.Td>
                    {/* --- COLUNA FOTO FECHAMENTO --- */}
                    <S.Td>
                      <S.FotoWrapper>
                        {os.arquivoFechamento ? (
                          <a
                            href={os.arquivoFechamento}
                            target="_blank"
                            rel="noreferrer"
                            title="Clique para ver em tamanho real"
                          >
                            <S.FotoThumbnail>
                              <img
                                src={`${os.arquivoFechamento}?t=${new Date(os.updatedAt).getTime()}`}
                                alt="Foto do Fechamento"
                              />
                            </S.FotoThumbnail>
                          </a>
                        ) : (
                          <S.FotoThumbnail
                            className="vazio"
                            title="Nenhuma foto anexada"
                          />
                        )}
                      </S.FotoWrapper>
                    </S.Td>
                    <S.TdTexto width="250px">
                      <S.EditableTextarea
                        defaultValue={os.descricaoFechamento}
                        onBlur={(e) =>
                          handleUpdate(
                            os._id,
                            "descricaoFechamento",
                            e.target.value,
                          )
                        }
                      />
                    </S.TdTexto>
                    <S.Td>
                      <S.ActionButton onClick={() => useDeleteOs(os._id)}>
                        ❌
                      </S.ActionButton>
                    </S.Td>
                  </tr>
                );
              })}
            </tbody>
          </S.TabelaStyled>
        </S.TabelaWrapper>
      </S.PaginaContainer>
    </div>
  );
};

export default TabelaOS;
