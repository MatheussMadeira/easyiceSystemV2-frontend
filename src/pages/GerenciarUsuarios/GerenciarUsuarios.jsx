import React, { useState, useMemo } from "react";
import { useUser } from "../../hooks/useUser";
import * as S from "./styles.js"; // Você pode adaptar os estilos da TabelaOS
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
    password: "",
    funcoes: "",
  });

  // Filtro de busca por nome
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
      password: "", // Senha sempre vazia na edição por segurança
      funcoes: u.funcoes.join(", "),
    });
    setModalAberto(true);
  };

  const handleSalvar = async () => {
    // 1. Validação Simples no Front-end
    if (!dadosForm.nome || !dadosForm.email) {
      return Swal.fire("Atenção", "Nome e E-mail são obrigatórios.", "warning");
    }

    if (!usuarioSelecionado && !dadosForm.password) {
      return Swal.fire(
        "Atenção",
        "A senha é obrigatória para novos usuários.",
        "warning"
      );
    }

    try {
      // 2. Tratamento do campo funcoes para evitar o erro do print
      // Se a string estiver vazia, enviamos um array vazio, senão o Mongoose reclama do enum
      const funcoesArray =
        dadosForm.funcoes && dadosForm.funcoes.trim() !== ""
          ? dadosForm.funcoes.split(",").map((f) => f.trim().toUpperCase())
          : []; // Envia array vazio se não houver funções digitadas

      const payload = {
        ...dadosForm,
        funcoes: funcoesArray,
      };

      if (usuarioSelecionado) {
        await updateUser({ id: usuarioSelecionado._id, dados: payload });
        Swal.fire("Sucesso", "Usuário atualizado!", "success");
      } else {
        await createUser(payload);
        Swal.fire("Sucesso", "Usuário criado com sucesso!", "success");
      }

      setModalAberto(false);
    } catch (err) {
      // 3. Tratamento de erro amigável
      console.error("Erro completo:", err);

      // Captura a mensagem do backend ou usa uma genérica
      const mensagemErro = err.response?.data?.erro || err.message;

      // Se for erro de validação do Mongoose (como o do seu print), simplifica para o usuário
      if (mensagemErro.includes("validation failed")) {
        Swal.fire(
          "Erro de Cadastro",
          "Verifique se todos os campos foram preenchidos corretamente.",
          "error"
        );
      } else if (mensagemErro.includes("duplicate key")) {
        Swal.fire(
          "Erro",
          "Este e-mail já está cadastrado no sistema.",
          "error"
        );
      } else {
        Swal.fire(
          "Erro",
          mensagemErro || "Não foi possível salvar os dados.",
          "error"
        );
      }
    }
  };

  const handleExcluir = async (id) => {
    const result = await Swal.fire({
      title: "Remover Usuário?",
      text: "Esta ação não pode ser desfeita!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Sim, remover",
    });

    if (result.isConfirmed) {
      try {
        await deleteUser(id);
        Swal.fire("Removido!", "O usuário foi excluído.", "success");
        setModalAberto(false);
      } catch (err) {
        Swal.fire("Erro", "Não foi possível excluir.", "error");
      }
    }
  };

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

        {/* GRID DE CARDS */}
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
                  <h3 style={{ color: "#fff", margin: 0, fontSize: "16px" }}>
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
            ? "Editar Funcionário"
            : "Cadastrar Novo Funcionário"
        }
        data={dadosForm}
        setData={setDadosForm}
        onSubmit={handleSalvar}
        fields={[
          { name: "nome", label: "Nome Completo", type: "text" },
          { name: "email", label: "E-mail Corporativo", type: "email" },
          {
            name: "password",
            label: usuarioSelecionado
              ? "Nova Senha (deixe vazio para manter)"
              : "Senha de Acesso",
            type: "password",
          },
          {
            name: "funcoes",
            label: "Funções (Separe por vírgula: ADMIN, EXECUTOR...)",
            type: "text",
          },
        ]}
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
