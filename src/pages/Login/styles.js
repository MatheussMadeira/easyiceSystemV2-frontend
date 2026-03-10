import styled from "styled-components";

// Agora ocupa a tela inteira como fundo da página
export const LoginWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #09090b; /* Fundo Zinc-950 igual à Home */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
`;

export const LoginContainer = styled.div`
  background: #09090b;
  width: 90%;
  max-width: 400px;
  padding: 40px;
  border-radius: 12px;
  border: 1px solid #1f1f23;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20000; /* Acima de tudo */
  backdrop-filter: blur(12px);
`;

export const LoginHeader = styled.div`
  text-align: center;

  h2 {
    color: #fafafa;
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
    letter-spacing: -0.025em;
  }

  p {
    color: #71717a;
    font-size: 0.9rem;
    margin-top: 8px;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 11px;
    font-weight: 600;
    color: #71717a;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  input {
    width: 100%;
    padding: 12px 16px;
    background-color: #000;
    border: 1px solid #1f1f23;
    border-radius: 8px;
    font-size: 14px;
    color: #fafafa;
    outline: none;
    transition: all 0.2s;

    &:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 1px #3b82f6;
    }

    &::placeholder {
      color: #3f3f46;
    }
  }
`;

export const BotaoEntrar = styled.button`
  background: #fafafa;
  color: #09090b;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background: #e4e4e7;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ErrorMsg = styled.span`
  color: #ef4444;
  font-size: 12px;
  text-align: center;
  background: rgba(239, 68, 68, 0.1);
  padding: 8px;
  border-radius: 6px;
`;
