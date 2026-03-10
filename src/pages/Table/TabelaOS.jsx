import React, { useState } from "react";
import { useOS } from "../../hooks/useOS";
import { useUser } from "../../hooks/useUser";
import { useAuth } from "../../hooks/useAuth";
import { useSettings } from "../../hooks/useSettings";
import * as S from "./styles";
import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";
import { useNavigate, useLocation } from "react-router-dom";
import * as H from "../../components/MenuHamburguer/menu";
import ModalLogin from "../../components/ModalLogin/ModalLogin";
import SeletorGrade from "../../components/PopoverTable/PopoverTable";

const TabelaOS = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hooks de Ordens de Serviço
  const { useDeleteOs, useUpdateInline } = useOS();
  const { signed, user, login, logout, loadingAuth } = useAuth();
  useEffect(() => {
    if (!signed) {
      navigate("/login");
    }
  }, [signed, navigate]);
  // Hooks de Gestão (para passar para o SeletorGrade)
  const { createUser, deleteUser } = useUser();
  const { create: createSetor, remove: deleteSetor } = useSettings("setores");

  const [menuAberto, setMenuAberto] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [popoverAberto, setPopoverAberto] = useState(null);
  if (!signed) {
    return null;
  }

  // Busca de Ordens
  const { data: ordens = [], isLoading } = useQuery({
    queryKey: ["ordens"],
    queryFn: async () => {
      const res = await api.get("/os");
      return res.data;
    },
    refetchOnWindowFocus: false,
  });

  // Busca de Opções do Banco (Dinâmico)
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

  const handleUpdate = (id, campo, valor) => {
    useUpdateInline(id, { [campo]: valor });
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
          🗂️ Painel
        </H.MenuItem>
        <H.MenuItem
          active={location.pathname === "/tabela"}
          onClick={() => handleNavigation("/tabela")}
        >
          📊 Tabela
        </H.MenuItem>
        <H.MenuItem onClick={logout}>❌ Logout</H.MenuItem>
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
                <S.Th style={{ width: "100px" }}>Nº OS</S.Th>
                <S.Th style={{ width: "120px" }}>Data Abertura</S.Th>
                <S.Th style={{ width: "200px" }}>Setor</S.Th>
                <S.Th style={{ width: "180px" }}>Solicitante</S.Th>
                <S.Th style={{ width: "180px" }}>Executor</S.Th>
                <S.Th style={{ width: "200px" }}>Equipamento</S.Th>
                <S.Th style={{ width: "480px" }}>Descrição</S.Th>
                <S.Th style={{ width: "160px" }}>Status</S.Th>
                <S.Th style={{ width: "160px" }}>Prioridade</S.Th>
                <S.Th style={{ width: "80px" }}>Foto</S.Th>
                <S.Th style={{ width: "120px" }}>Fechamento</S.Th>
                <S.Th style={{ width: "200px" }}>Peças</S.Th>
                <S.Th style={{ width: "120px" }}>Valor R$</S.Th>
                <S.Th style={{ width: "80px" }}>F. Final</S.Th>
                <S.Th style={{ width: "250px" }}>Obs. Técnica</S.Th>
                <S.Th style={{ width: "80px" }}>Ações</S.Th>
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

                    {/* SETOR DINÂMICO */}
                    <S.TdSelect>
                      <div
                        onClick={() =>
                          setPopoverAberto({ id: os._id, field: "setor" })
                        }
                        style={{
                          cursor: "pointer",
                          padding: "8px",
                          background: "#1f1f23",
                          borderRadius: "4px",
                        }}
                      >
                        {os.setor}
                      </div>
                      {popoverAberto?.id === os._id &&
                        popoverAberto?.field === "setor" && (
                          <SeletorGrade
                            tipo="setor"
                            opcoes={opcoes?.setores}
                            valorAtual={os.setor}
                            aoSelecionar={(v) =>
                              handleUpdate(os._id, "setor", v)
                            }
                            onClose={() => setPopoverAberto(null)}
                            acaoCriar={createSetor}
                            acaoDeletar={deleteSetor}
                          />
                        )}
                    </S.TdSelect>

                    {/* SOLICITANTE DINÂMICO */}
                    <S.TdSelect>
                      <div
                        onClick={() =>
                          setPopoverAberto({ id: os._id, field: "solicitante" })
                        }
                        style={{
                          cursor: "pointer",
                          padding: "6px",
                          background: "rgba(59, 130, 246, 0.1)",
                          color: "#3b82f6",
                          borderRadius: "4px",
                        }}
                      >
                        {os.solicitante}
                      </div>
                      {popoverAberto?.id === os._id &&
                        popoverAberto?.field === "solicitante" && (
                          <SeletorGrade
                            tipo="solicitante"
                            opcoes={opcoes?.solicitantes}
                            valorAtual={os.solicitante}
                            aoSelecionar={(v) =>
                              handleUpdate(os._id, "solicitante", v)
                            }
                            onClose={() => setPopoverAberto(null)}
                            acaoCriar={createUser}
                            acaoDeletar={deleteUser}
                          />
                        )}
                    </S.TdSelect>

                    {/* EXECUTOR DINÂMICO */}
                    <S.TdSelect>
                      <div
                        onClick={() =>
                          setPopoverAberto({ id: os._id, field: "executor" })
                        }
                        style={{
                          cursor: "pointer",
                          padding: "6px",
                          background: os.executor
                            ? "rgba(16, 185, 129, 0.1)"
                            : "#18181b",
                          color: os.executor ? "#10b981" : "#71717a",
                          borderRadius: "4px",
                        }}
                      >
                        {os.executor || "Não Atribuído"}
                      </div>
                      {popoverAberto?.id === os._id &&
                        popoverAberto?.field === "executor" && (
                          <SeletorGrade
                            tipo="executor"
                            opcoes={opcoes?.executores}
                            valorAtual={os.executor}
                            aoSelecionar={(v) =>
                              handleUpdate(os._id, "executor", v)
                            }
                            onClose={() => setPopoverAberto(null)}
                            acaoCriar={createUser}
                            acaoDeletar={deleteUser}
                          />
                        )}
                    </S.TdSelect>

                    <S.TdTexto>
                      <S.EditableTextarea
                        defaultValue={os.equipamento}
                        onBlur={(e) =>
                          handleUpdate(os._id, "equipamento", e.target.value)
                        }
                      />
                    </S.TdTexto>
                    <S.TdTexto>
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

                    {/* STATUS */}
                    <S.TdSelect>
                      <div
                        onClick={() =>
                          setPopoverAberto({ id: os._id, field: "situacao" })
                        }
                        style={{
                          cursor: "pointer",
                          padding: "6px",
                          background: sStyles.bg,
                          color: sStyles.text,
                          borderRadius: "4px",
                          fontWeight: "600",
                        }}
                      >
                        {os.situacao}
                      </div>
                      {popoverAberto?.id === os._id &&
                        popoverAberto?.field === "situacao" && (
                          <SeletorGrade
                            opcoes={["EM ABERTO", "EM PROCESSO", "CONCLUÍDO"]}
                            valorAtual={os.situacao}
                            aoSelecionar={(v) =>
                              handleUpdate(os._id, "situacao", v)
                            }
                            onClose={() => setPopoverAberto(null)}
                          />
                        )}
                    </S.TdSelect>

                    {/* PRIORIDADE */}
                    <S.TdSelect>
                      <div
                        onClick={() =>
                          setPopoverAberto({ id: os._id, field: "prioridade" })
                        }
                        style={{
                          cursor: "pointer",
                          padding: "6px",
                          background: pStyles.bg,
                          color: pStyles.text,
                          borderRadius: "4px",
                        }}
                      >
                        {os.prioridade?.split(" ")[0]}
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
                          >
                            <S.FotoThumbnail>
                              <img
                                src={`${os.arquivoAbertura}?t=${new Date(
                                  os.createdAt,
                                ).getTime()}`}
                                alt="Foto"
                              />
                            </S.FotoThumbnail>
                          </a>
                        ) : (
                          <S.FotoThumbnail className="vazio" />
                        )}
                      </S.FotoWrapper>
                    </S.Td>

                    <S.Td>
                      {os.dataFechamento
                        ? new Date(os.dataFechamento).toLocaleDateString()
                        : "-"}
                    </S.Td>
                    <S.TdTexto>
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

                    <S.Td>
                      <S.FotoWrapper>
                        {os.arquivoFechamento ? (
                          <a
                            href={os.arquivoFechamento}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <S.FotoThumbnail>
                              <img
                                src={`${os.arquivoFechamento}?t=${new Date(
                                  os.updatedAt,
                                ).getTime()}`}
                                alt="Foto"
                              />
                            </S.FotoThumbnail>
                          </a>
                        ) : (
                          <S.FotoThumbnail className="vazio" />
                        )}
                      </S.FotoWrapper>
                    </S.Td>

                    <S.TdTexto>
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
