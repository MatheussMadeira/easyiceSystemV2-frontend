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
import SeletorGrade from "../../components/PopoverTable/PopoverTable";
import ModalBase from "../../components/Modal/ModalBase";
import Swal from "sweetalert2";

const TabelaOS = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hooks de Dados e Autenticação
  const { useDeleteOs, useUpdateInline } = useOS();
  const { signed, user, logout } = useAuth();
  const { usuarios, createUser, updateUser, deleteUser } = useUser();
  const { create: createSetor, remove: deleteSetor } = useSettings("setores");

  // Estados de Interface
  const [menuAberto, setMenuAberto] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [popoverAberto, setPopoverAberto] = useState(null);

  // Estados para Gestão de Usuário
  const [modalUsuarioAberto, setModalUsuarioAberto] = useState(false);
  const [usuarioParaEditar, setUsuarioParaEditar] = useState(null);
  const [dadosUsuario, setDadosUsuario] = useState({
    nome: "",
    email: "",
    password: "",
    funcoes: [],
  });

  // --- LOGICA DE USUÁRIOS ---
  const handleDeletarUsuario = async () => {
    if (!usuarioParaEditar) return;

    const result = await Swal.fire({
      title: `Remover ${usuarioParaEditar.nome}?`,
      text: "Isso excluirá o acesso deste usuário ao sistema.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deleteUser(usuarioParaEditar._id); // Usando a função do hook
        Swal.fire("Removido!", "O usuário foi excluído.", "success");
        setModalUsuarioAberto(false);
      } catch (err) {
        const msg = err.response?.data?.erro || "Não foi possível excluir.";
        Swal.fire("Erro", msg, "error");
      }
    }
  };
  const prepararEdicao = (nomeDoUsuario) => {
    // Usamos .toLowerCase() em ambos os lados para garantir que "Teste" encontre "TESTE"
    const userEncontrado = usuarios.find(
      (u) => u.nome.toLowerCase().trim() === nomeDoUsuario.toLowerCase().trim()
    );

    if (userEncontrado) {
      setUsuarioParaEditar(userEncontrado);
      setDadosUsuario({
        nome: userEncontrado.nome,
        email: userEncontrado.email,
        funcoes: userEncontrado.funcoes.join(", "),
        password: "",
      });
      setModalUsuarioAberto(true);
      setPopoverAberto(null);
    } else {
      // Se ainda assim não achar, vamos ver no console o que está chegando
      console.log("Nome vindo do Popover:", nomeDoUsuario);
      console.log("Lista de usuários no state:", usuarios);

      Swal.fire(
        "Erro",
        "Usuário não encontrado na base de dados local.",
        "warning"
      );
    }
  };

  const handleSalvarUsuario = async () => {
    try {
      const funcoesArray =
        typeof dadosUsuario.funcoes === "string"
          ? dadosUsuario.funcoes.split(",").map((f) => f.trim().toUpperCase())
          : dadosUsuario.funcoes;

      const payload = { ...dadosUsuario, funcoes: funcoesArray };

      if (usuarioParaEditar) {
        await updateUser({ id: usuarioParaEditar._id, dados: payload });
        Swal.fire("Sucesso", "Usuário atualizado com sucesso!", "success");
      } else {
        await createUser(payload);
        Swal.fire("Sucesso", "Novo usuário cadastrado!", "success");
      }
      setModalUsuarioAberto(false);
    } catch (err) {
      const msg = err.response?.data?.erro || "Erro ao processar solicitação.";
      Swal.fire("Erro", msg, "error");
    }
  };

  // --- BUSCA DE DADOS (React Query) ---

  const { data: ordens = [], isLoading } = useQuery({
    queryKey: ["ordens"],
    queryFn: async () => {
      const res = await api.get("/os");
      return res.data;
    },
    enabled: !!signed,
    refetchOnWindowFocus: false,
  });

  const { data: opcoes } = useQuery({
    queryKey: ["opcoes"],
    queryFn: async () => {
      const res = await api.get("/os/opcoes");
      return res.data;
    },
    enabled: !!signed,
    staleTime: 600000,
  });

  // --- AÇÕES DA TABELA ---

  const handleNavigation = (path) => {
    setMenuAberto(false);
    setIsNavigating(true);
    setTimeout(() => navigate(path), 500);
  };

  const handleUpdate = async (id, campo, valor) => {
    try {
      await useUpdateInline(id, { [campo]: valor });
    } catch (err) {
      const msg = err.response?.data?.erro || "Sem permissão para alterar.";
      Swal.fire({ title: "Acesso Negado", text: msg, icon: "error" });
    }
  };

  const handleDelete = async (id) => {
    const res = await Swal.fire({
      title: "Excluir OS?",
      icon: "warning",
      showCancelButton: true,
    });
    if (res.isConfirmed) {
      try {
        await useDeleteOs(id);
      } catch (err) {
        Swal.fire("Erro", err.response?.data?.erro, "error");
      }
    }
  };

  const getStatusStyles = (status) => {
    const configs = {
      CONCLUÍDO: { bg: "rgba(16, 185, 129, 0.15)", text: "#10b981" },
      "EM PROCESSO": { bg: "rgba(59, 130, 246, 0.15)", text: "#3b82f6" },
      "EM ABERTO": { bg: "rgba(245, 158, 11, 0.15)", text: "#f59e0b" },
      CANCELADA: { bg: "rgba(239, 68, 68, 0.15)", text: "#ef4444" },
    };
    return configs[status] || { bg: "#18181b", text: "#71717a" };
  };

  const getPriorityStyles = (p) => {
    if (p?.includes("Emergencia"))
      return { bg: "rgba(168, 85, 247, 0.15)", text: "#a855f7" };
    if (p?.includes("Alta"))
      return { bg: "rgba(239, 68, 68, 0.15)", text: "#ef4444" };
    return { bg: "rgba(113, 113, 122, 0.15)", text: "#a1a1aa" };
  };

  return (
    <div style={{ backgroundColor: "#09090b", minHeight: "100vh" }}>
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
        <div
          style={{
            marginTop: "auto",
            borderTop: "1px solid #1f1f23",
            paddingTop: "15px",
          }}
        >
          <p
            style={{ color: "#71717a", fontSize: "11px", marginBottom: "8px" }}
          >
            LOGADO: <strong style={{ color: "#fff" }}>{user?.nome}</strong>
          </p>
          <H.MenuItem onClick={logout} style={{ color: "#ef4444" }}>
            🚪 Sair
          </H.MenuItem>
        </div>
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
                <S.Th style={{ width: "120px" }}>Abertura</S.Th>
                <S.Th style={{ width: "200px" }}>Setor</S.Th>
                <S.Th style={{ width: "180px" }}>Solicitante</S.Th>
                <S.Th style={{ width: "180px" }}>Executor</S.Th>
                <S.Th style={{ width: "200px" }}>Equipamento</S.Th>
                <S.Th style={{ width: "400px" }}>Descrição</S.Th>
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
                            acaoCriarUsuario={() => {
                              setUsuarioParaEditar(null);
                              setDadosUsuario({
                                nome: "",
                                email: "",
                                password: "",
                                funcoes: [],
                              });
                              setModalUsuarioAberto(true);
                            }}
                            acaoEditarUsuario={(nome) => prepararEdicao(nome)}
                          />
                        )}
                    </S.TdSelect>

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
                            acaoCriarUsuario={() => {
                              setUsuarioParaEditar(null);
                              setDadosUsuario({
                                nome: "",
                                email: "",
                                password: "",
                                funcoes: [],
                              });
                              setModalUsuarioAberto(true);
                            }}
                            acaoEditarUsuario={(nome) => prepararEdicao(nome)}
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
                            e.target.value
                          )
                        }
                      />
                    </S.TdTexto>

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
                                  os.createdAt
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
                            e.target.value
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
                                  os.updatedAt
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
                            e.target.value
                          )
                        }
                      />
                    </S.TdTexto>
                    <S.Td>
                      <S.ActionButton onClick={() => handleDelete(os._id)}>
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

      {/* MODAL UNIFICADO DE CRIAÇÃO/EDIÇÃO DE USUÁRIO */}
      <ModalBase
        isOpen={modalUsuarioAberto}
        onClose={() => setModalUsuarioAberto(false)}
        title={usuarioParaEditar ? "Editar Usuário" : "Novo Usuário"}
        data={dadosUsuario}
        setData={setDadosUsuario}
        onSubmit={handleSalvarUsuario}
        fields={[
          { name: "nome", label: "Nome Completo", type: "text" },
          { name: "email", label: "E-mail", type: "email" },
          {
            name: "password",
            label: usuarioParaEditar ? "Senha (vazio para manter)" : "Senha",
            type: "password",
          },
          {
            name: "funcoes",
            label: "Funções (ADMIN, SOLICITANTE, EXECUTOR)",
            type: "text",
          },
        ]}
        footerActions={
          usuarioParaEditar && (
            <button
              onClick={handleDeletarUsuario}
              style={{
                backgroundColor: "#ef4444",
                color: "white",
                padding: "8px 16px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                marginRight: "auto",
                fontWeight: "600",
              }}
            >
              Excluir Usuário
            </button>
          )
        }
      />
    </div>
  );
};

export default TabelaOS;
