import React, { useState } from "react";
import * as S from "./styles";

const ModalLogin = ({ onLogin, isLoading }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    try {
      await onLogin(email, password);
    } catch (err) {
      // Pega a mensagem de erro que vem do seu backend
      const mensagem =
        err.response?.data?.erro || "Falha na conexão com o servidor.";
      setErro(mensagem);
    }
  };

  return (
    <S.Overlay>
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
    </S.Overlay>
  );
};

export default ModalLogin;
