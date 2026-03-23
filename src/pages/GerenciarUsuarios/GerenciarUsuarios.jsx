import React, { useState, useMemo } from "react";
import { useUser } from "../../hooks/useUser";
import * as S from "./styles.js";
import ModalBase from "../../components/Modal/ModalBase";
import MenuGlobal from "../../components/MenuHamburguer/menu.jsx";
import Swal from "sweetalert2";

const GerenciarUsuarios = () => {
  const { usuarios, createUser, updateUser, deleteUser, isLoading } = useUser();
  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);

  const [dadosForm, setDadosForm] = useState({
    nome: "",
    email: "",
    password: "", // Campo inicializado
    funcoes: "",
  });

  const swalConfig = {
    background: "#09090b",
    color: "#fafafa",
    confirmButtonColor: "#3b82f6",
    cancelButtonColor: "#27272a",
  };

  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter((u) =>
      u.nome.toLowerCase().includes(busca.toLowerCase())
    );
  }, [usuarios, busca]);

  const abrirModalNovo = () => {
    setUsuarioSelecionado(null);
    setDadosForm({ nome: "", email: "", password: "", funcoes: "" });
    setModalAberto(true);
  };

  const abrirModalEdicao = (u) => {
    setUsuarioSelecionado(u);
    setDadosForm({
      nome: u.nome,
      email: u.email,
      password: "", // Limpa o campo de senha ao editar
      funcoes: u.funcoes.join(", "),
    });
    setModalAberto(true);
  };

  const handleSalvar = async () => {
    // Validação básica
    if (!dadosForm.nome || !dadosForm.email) {
      return Swal.fire({
        ...swalConfig,
        title: "ATENÇÃO",
        text: "NOME E E-MAIL SÃO OBRIGATÓRIOS.",
        icon: "warning",
      });
    }

    // Validação específica de senha: SÓ NO CADASTRO
    if (!usuarioSelecionado && !dadosForm.password) {
      return Swal.fire({
        ...swalConfig,
        title: "ATENÇÃO",
        text: "A SENHA É OBRIGATÓRIA PARA NOVOS USUÁRIOS.",
        icon: "warning",
      });
    }

    try {
      const funcoesArray =
        dadosForm.funcoes && dadosForm.funcoes.trim() !== ""
          ? dadosForm.funcoes.split(",").map((f) => f.trim().toUpperCase())
          : [];

      // Criamos o payload. Se for edição, removemos a senha para não enviar campo vazio ao back
      const payload = {
        ...dadosForm,
        funcoes: funcoesArray,
      };

      if (usuarioSelecionado) delete payload.password;

      if (usuarioSelecionado) {
        await updateUser({ id: usuarioSelecionado._id, dados: payload });
        Swal.fire({
          ...swalConfig,
          title: "SUCESSO",
          text: "USUÁRIO ATUALIZADO COM SUCESSO!",
          icon: "success",
        });
      } else {
        await createUser(payload);
        Swal.fire({
          ...swalConfig,
          title: "SUCESSO",
          text: "NOVO USUÁRIO CADASTRADO!",
          icon: "success",
        });
      }

      setModalAberto(false);
    } catch (err) {
      const msg = err.response?.data?.erro || "ERRO AO PROCESSAR SOLICITAÇÃO.";
      Swal.fire({
        ...swalConfig,
        title: "ERRO",
        text: msg.toUpperCase(),
        icon: "error",
      });
    }
  };

  const handleExcluir = async (id) => {
    const result = await Swal.fire({
      ...swalConfig,
      title: "REMOVER USUÁRIO?",
      text: "ESTA AÇÃO NÃO PODE SER DESFEITA!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "SIM, REMOVER",
      cancelButtonText: "CANCELAR",
    });

    if (result.isConfirmed) {
      try {
        await deleteUser(id);
        Swal.fire({
          ...swalConfig,
          title: "REMOVIDO!",
          text: "O USUÁRIO FOI EXCLUÍDO.",
          icon: "success",
        });
        setModalAberto(false);
      } catch (err) {
        Swal.fire({
          ...swalConfig,
          title: "ERRO",
          text: "NÃO FOI POSSÍVEL EXCLUIR.",
          icon: "error",
        });
      }
    }
  };

  // DEFINIÇÃO DOS CAMPOS DINÂMICOS
  const modalFields = [
    { name: "nome", label: "NOME COMPLETO", type: "text" },
    { name: "email", label: "E-MAIL CORPORATIVO", type: "email" },
    // A SENHA SÓ APARECE SE NÃO HOUVER USUÁRIO SELECIONADO (MODO CRIAÇÃO)
    ...(!usuarioSelecionado
      ? [{ name: "password", label: "SENHA DE ACESSO", type: "password" }]
      : []),
    {
      name: "funcoes",
      label: "FUNÇÕES (SEPARE POR VÍRGULA: ADMIN, EXECUTOR...)",
      type: "text",
    },
  ];

  return (
    <div style={{ backgroundColor: "#09090b", minHeight: "100vh" }}>
      <MenuGlobal />
      <S.PaginaContainer>
        <S.HeaderFixo>
          <h1 style={{ color: "#fff", fontSize: "20px", marginLeft: "50px" }}>
            Gerenciar Equipe
          </h1>
          <div
            style={{
              display: "flex",
              gap: "15px",
              flex: 1,
              justifyContent: "center",
            }}
          >
            <S.InputBusca
              placeholder="Buscar funcionário por nome..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              style={{ width: "400px" }}
            />
          </div>
          <button
            onClick={abrirModalNovo}
            style={{
              background: "#3b82f6",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            + Adicionar Usuário
          </button>
        </S.HeaderFixo>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(560px, 1fr))",
            gap: "20px",
            padding: "20px",
          }}
        >
          {usuariosFiltrados.map((u) => (
            <div
              key={u._id}
              onClick={() => abrirModalEdicao(u)}
              style={{
                background: "#18181b",
                border: "1px solid #27272a",
                borderRadius: "12px",
                padding: "20px",
                cursor: "pointer",
                transition: "transform 0.2s",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.02)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <div
                  style={{
                    width: "45px",
                    height: "45px",
                    borderRadius: "50%",
                    background: "#3b82f6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                >
                  {u.nome.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3
                    style={{
                      color: "#fff",
                      margin: 0,
                      fontSize: "16px",
                      textTransform: "uppercase",
                    }}
                  >
                    {u.nome}
                  </h3>
                  <span style={{ color: "#71717a", fontSize: "13px" }}>
                    {u.email}
                  </span>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "5px",
                  marginTop: "10px",
                }}
              >
                {u.funcoes.map((f) => (
                  <span
                    key={f}
                    style={{
                      fontSize: "10px",
                      background: "#27272a",
                      color: "#a1a1aa",
                      padding: "2px 8px",
                      borderRadius: "10px",
                      border: "1px solid #3f3f46",
                    }}
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </S.PaginaContainer>

      <ModalBase
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        title={
          usuarioSelecionado
            ? "EDITAR FUNCIONÁRIO"
            : "CADASTRAR NOVO FUNCIONÁRIO"
        }
        data={dadosForm}
        setData={setDadosForm}
        onSubmit={handleSalvar}
        fields={modalFields}
        footerActions={
          usuarioSelecionado && (
            <button
              onClick={() => handleExcluir(usuarioSelecionado._id)}
              style={{
                backgroundColor: "#ef4444",
                color: "white",
                padding: "8px 16px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                marginRight: "auto",
                textTransform: "uppercase",
                fontWeight: "700",
              }}
            >
              Remover Acesso
            </button>
          )
        }
      />
    </div>
  );
};

export default GerenciarUsuarios;
