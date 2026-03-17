import React, { useState } from "react";
import * as S from "./styles";
import { useAuth } from "../../services/AuthProvider"; // Importação do novo hook

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");

  // Agora pegamos as funções e estados diretamente do Contexto
  const { login, loadingAuth } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    try {
      // Chama a função login do Contexto
      await login(email, password);

      // Não precisamos de navigate("/") aqui, pois o App.jsx
      // vai detectar que 'signed' virou true e redirecionar sozinho.
    } catch (err) {
      // Pega a mensagem de erro do seu backend
      const mensagem =
        err.response?.data?.erro || "E-mail ou senha incorretos.";
      setErro(mensagem);
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

          <S.BotaoEntrar type="submit" disabled={loadingAuth}>
            {loadingAuth ? "Autenticando..." : "Entrar no Sistema"}
          </S.BotaoEntrar>
        </S.Form>
      </S.LoginContainer>
    </S.LoginWrapper>
  );
};

export default Login;
