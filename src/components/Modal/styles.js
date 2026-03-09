import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  backdrop-filter: blur(8px);
`;

export const ModalContainer = styled.div`
  background: #09090b; /* Fundo Zinc-950 */
  width: 90%;
  max-width: 500px;
  max-height: 85vh;
  border-radius: 12px;
  border: 1px solid #1f1f23;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  @keyframes slideIn {
    from {
      transform: translateY(-10px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

export const ModalHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid #1f1f23;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  div {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  h2 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: #fafafa;
    letter-spacing: -0.025em;
  }

  button {
    background: transparent;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #71717a;
    line-height: 1;
    &:hover {
      color: #fafafa;
    }
  }
`;

export const SubtitleBox = styled.div`
  margin-top: 8px;
  background: #121214;
  padding: 8px 12px;
  border-radius: 6px;
  border-left: 3px solid #3b82f6;

  p {
    color: #a1a1aa;
    font-size: 13px;
    margin: 0;
    font-weight: 500;
  }
`;

export const ModalBody = styled.div`
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;

  /* Scrollbar Minimalista */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #27272a;
    border-radius: 10px;
  }
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative; /* Ajuda o navegador a situar o campo */

  label {
    font-size: 12px;
    font-weight: 500;
    color: #71717a;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* ESTILO UNIFICADO PARA INPUTS E SELECTS */
  input,
  select,
  textarea {
    width: 100%;
    padding: 12px 16px;
    background-color: #000 !important; /* Força o fundo preto */
    border: 1px solid #1f1f23 !important; /* Borda padrão do sistema */
    border-radius: 8px !important; /* Arredondamento solicitado */
    font-size: 14px;
    color: #fafafa;
    outline: none;
    transition: all 0.2s ease-in-out;
    box-sizing: border-box;
    appearance: none; /* Remove o estilo nativo que ignora o CSS */
    -webkit-appearance: none;
    -moz-appearance: none;

    &:hover {
      border-color: #27272a !important;
    }

    &:focus {
      border-color: #3b82f6 !important;
      box-shadow: 0 0 0 1px #3b82f6;
    }
  }

  /* AJUSTE ESPECÍFICO DO SELECT (PARA NÃO ABRIR "ESTRANHO") */
  select {
    cursor: pointer;
    /* Adicionando a seta customizada novamente para garantir que apareça */
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2371717a'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 16px;
    padding-right: 40px;

    /* Força o menu a tentar abrir para baixo em navegadores modernos */
    &::-ms-expand {
      display: none;
    }
  }

  /* ESTILO DAS OPÇÕES DENTRO DO SELECT */
  option {
    background-color: #18181b; /* Fundo escuro nas opções */
    color: #fafafa;
    padding: 10px;
  }

  /* SCROLLBAR CUSTOMIZADA (FIM DO SCROLL FEIO) */
  textarea,
  select,
  div {
    &::-webkit-scrollbar {
      width: 5px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: #27272a;
      border-radius: 10px;
    }
  }
`;

export const ModalFooter = styled.div`
  padding: 16px 24px;
  border-top: 1px solid #1f1f23;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background-color: #09090b;
`;
export const SeletorTrigger = styled.button`
  width: 100%;
  padding: 12px;
  background: #18181b;
  border: 1px solid #27272a;
  border-radius: 8px;
  color: ${(props) => (props.temValor ? "#fafafa" : "#71717a")};
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;

  &:hover {
    border-color: #3f3f46;
    background: #1f1f23;
  }

  .seta {
    font-size: 12px;
    color: #71717a;
  }
`;
export const BotaoCancelar = styled.button`
  background: transparent;
  border: 1px solid #27272a;
  color: #71717a;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 13px;

  &:hover {
    background: #121214;
    color: #fafafa;
  }
`;

export const BotaoConfirmar = styled.button`
  background: #fafafa;
  color: #09090b;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;

  &:hover {
    opacity: 0.9;
  }
`;

export const ErrorText = styled.span`
  color: #ef4444;
  font-size: 11px;
  margin-top: -4px;
`;
