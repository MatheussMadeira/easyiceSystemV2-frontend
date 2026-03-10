import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importante para o redirecionamento
import * as S from "./styles";

// Renomeado para Login para padronizar como página
const Login = ({ onLogin, isLoading }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    try {
      // 1. Tenta realizar o login via hook useAuth
      await onLogin(email, password);

      // 2. Se der certo, redireciona para a Home (/)
      navigate("/");
    } catch (err) {
      // Pega a mensagem de erro amigável do backend
      const mensagem =
        err.response?.data?.erro || "E-mail ou senha incorretos.";
      setErro(mensagem);
    }
  };

  return (
    <S.LoginWrapper>
      {" "}
      {/* Mudamos de Overlay para Wrapper de página */}
      <S.LoginContainer>
        <S.LoginHeader>
          <h2>EasyIce System</h2>
          <p>Entre com suas credenciais para acessar</p>
        </S.LoginHeader>

        <S.Form onSubmit={handleSubmit}>
          {erro && <S.ErrorMsg>{erro}</S.ErrorMsg>}

          <S.InputGroup>
            <label>E-mail</label>
            <input
              type="email"
              placeholder="exemplo@easyice.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </S.InputGroup>

          <S.InputGroup>
            <label>Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </S.InputGroup>

          <S.BotaoEntrar type="submit" disabled={isLoading}>
            {isLoading ? "Autenticando..." : "Entrar no Sistema"}
          </S.BotaoEntrar>
        </S.Form>
      </S.LoginContainer>
    </S.LoginWrapper>
  );
};

export default Login; // Exportando como Login
