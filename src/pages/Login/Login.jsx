import React, { useState } from "react";
import * as S from "./styles";
import { useAuth } from "../../services/AuthProvider";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login, loadingAuth } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      await login(email, password);
      console.log("Sucesso no login!");
    } catch (err) {
      console.log("Objeto de erro completo:", err);
      console.log("Dados vindos do servidor:", err.response?.data);
      console.log("Status do erro:", err.response?.status);

      const mensagem =
        err.response?.data?.error ||
        err.response?.data?.erro ||
        "E-mail ou senha incorretos.";

      console.log("Mensagem extraída:", mensagem);

      setErro(mensagem);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <S.LoginWrapper>
      <S.LoginContainer>
        <S.LoginHeader>
          <h2>EasyIce System</h2>
          <p>Entre com suas credenciais para acessar</p>
        </S.LoginHeader>

        <S.Form onSubmit={handleSubmit}>
          {erro && <S.ErrorMsg>{erro}</S.ErrorMsg>}

          <S.InputGroup>
            <label>E-mail</label>
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                type="email"
                placeholder="exemplo@easyice.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
          </S.InputGroup>

          <S.InputGroup>
            <label>Senha</label>
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: "100%", paddingRight: "40px" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  background: "none",
                  border: "none",
                  color: "#71717a",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </S.InputGroup>

          <S.BotaoEntrar type="submit" disabled={carregando}>
            {carregando ? "Autenticando..." : "Entrar no Sistema"}{" "}
          </S.BotaoEntrar>
        </S.Form>
      </S.LoginContainer>
    </S.LoginWrapper>
  );
};

export default Login;
