import React, { useState } from "react";
import { useAuth } from "../../services/AuthProvider.jsx";
import MenuGlobal from "../../components/MenuHamburguer/menu.jsx";
import * as S from "./styles";
import { User, Mail, Shield, Lock, X } from "lucide-react";
import { useUser } from "../../hooks/useUser.js";
import Swal from "sweetalert2";
const Perfil = () => {
  const { user } = useAuth();
  const { updatePassword, loading } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const handleUpdatePassword = async () => {
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      return Swal.fire({
        icon: "warning",
        title: "Atenção",
        text: "Preencha todos os campos!",
        confirmButtonColor: "#3b82f6",
        background: "#18181b",
        color: "#fff",
      });
    }

    if (novaSenha !== confirmarSenha) {
      return Swal.fire({
        icon: "error",
        title: "Erro",
        text: "As novas senhas não coincidem!",
        confirmButtonColor: "#3b82f6",
        background: "#18181b",
        color: "#fff",
      });
    }

    const result = await updatePassword(user._id, senhaAtual, novaSenha);

    if (result.success) {
      Swal.fire({
        icon: "success",
        title: "Sucesso!",
        text: "Sua senha foi alterada corretamente.",
        timer: 2000,
        showConfirmButton: false,
        background: "#18181b",
        color: "#fff",
      });
      setIsModalOpen(false);
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarSenha("");
    } else {
      Swal.fire({
        icon: "error",
        title: "Ops...",
        text: result.error,
        background: "#18181b",
        color: "#fff",
      });
    }
  };
  const formatEmail = (email) => {
    if (!email) return "";
    const [usuario, dominio] = email.split("@");
    return (
      <>
        {usuario}
        <wbr />@{dominio}
      </>
    );
  };
  return (
    <S.Container>
      <MenuGlobal />
      <S.Content>
        <S.Header>
          <h1>Meu Perfil</h1>
          <p>Gerencie suas informações de acesso</p>
        </S.Header>

        <S.ProfileCard>
          <S.AvatarSection>
            <div className="avatar-circle">
              {user?.nome?.charAt(0).toUpperCase()}
            </div>
            <h2>{user?.nome}</h2>
            <span>{user?.funcoes?.join(" • ")}</span>
          </S.AvatarSection>

          <S.InfoSection>
            <S.InfoItem>
              <div className="icon">
                <Mail size={20} />
              </div>
              <div>
                <label>E-mail de acesso</label>
                <p>{formatEmail(user?.email)}</p>
              </div>
            </S.InfoItem>

            <S.InfoItem>
              <div className="icon">
                <Shield size={20} />
              </div>
              <div>
                <label>Nível de Permissão</label>
                <p>
                  {user?.funcoes?.includes("ADMIN")
                    ? "Administrador"
                    : "Usuário Padrão"}
                </p>
              </div>
            </S.InfoItem>

            <S.InfoItem>
              <div className="icon">
                <User size={20} />
              </div>
              <div>
                <label>ID do Usuário</label>
                <p style={{ fontSize: "12px", color: "#52525b" }}>
                  {user?._id}
                </p>
              </div>
            </S.InfoItem>
          </S.InfoSection>

          <S.ActionSection>
            <button
              className="btn-password"
              onClick={() => setIsModalOpen(true)}
            >
              Alterar Senha
            </button>
          </S.ActionSection>
        </S.ProfileCard>
      </S.Content>
      {isModalOpen && (
        <S.ModalOverlay>
          <S.ModalContent>
            <div className="modal-header">
              <h3>Alterar Senha</h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <label style={{ fontSize: "12px", color: "#71717a" }}>
                Senha Atual
              </label>
              <div className="input-group">
                <Lock size={18} />
                <input
                  type="password"
                  placeholder="Sua senha atual"
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                />
              </div>

              <label style={{ fontSize: "12px", color: "#71717a" }}>
                Nova Senha
              </label>
              <div className="input-group">
                <Lock size={18} />
                <input
                  type="password"
                  placeholder="No mínimo 4 dígitos"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                />
              </div>

              <label style={{ fontSize: "12px", color: "#71717a" }}>
                Confirmar Nova Senha
              </label>
              <div className="input-group">
                <Lock size={18} />
                <input
                  type="password"
                  placeholder="Repita a nova senha"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                />
              </div>

              <button
                className="btn-save"
                onClick={handleUpdatePassword}
                disabled={loading}
              >
                {loading ? "Validando..." : "Confirmar Alteração"}
              </button>
            </div>
          </S.ModalContent>
        </S.ModalOverlay>
      )}
    </S.Container>
  );
};

export default Perfil;
