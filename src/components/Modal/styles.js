import styled, { css } from "styled-components";

// Criamos um bloco de estilo compartilhado para garantir que todos sejam IDÊNTICOS
const EstiloCampoBase = css`
  width: 100%;
  padding: 12px 16px;
  background-color: #09090b !important; /* Mesma cor de fundo para todos */
  border: 1px solid #1f1f23 !important; /* Mesma cor de borda */
  border-radius: 8px !important;
  font-size: 14px;
  color: #fafafa;
  outline: none;
  transition: all 0.2s ease-in-out;
  box-sizing: border-box;

  &:hover {
    border-color: #27272a !important;
    background-color: #121214 !important; /* Leve destaque no hover */
  }

  &:focus,
  &.focado {
    border-color: #3b82f6 !important;
    box-shadow: 0 0 0 1px #3b82f6;
    background-color: #09090b !important;
  }
`;

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
  background: #09090b;
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
  }
  button {
    background: transparent;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #71717a;
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
  position: relative;

  label {
    font-size: 12px;
    font-weight: 500;
    color: #71717a;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  input,
  textarea {
    ${EstiloCampoBase}
    appearance: none;
  }

  textarea {
    min-height: 100px;
    resize: none;
  }
`;

// AGORA O SELETOR TRIGGER USA O MESMO ESTILO BASE DOS INPUTS
export const SeletorTrigger = styled.button`
  ${EstiloCampoBase}
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  text-align: left;

  /* Cor do texto condicional */
  color: ${(props) => (props.temValor ? "#fafafa" : "#71717a")};

  /* Se o popover estiver aberto (campoAberto), simulamos o foco */
  ${(props) =>
    props.focado &&
    css`
      border-color: #3b82f6 !important;
      box-shadow: 0 0 0 1px #3b82f6;
    `}

  .seta {
    font-size: 12px;
    color: #71717a;
    transition: transform 0.2s;
    ${(props) => props.focado && "transform: rotate(180deg);"}
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

export const BotaoCancelar = styled.button`
  background: transparent;
  border: 1px solid #27272a;
  color: #71717a;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
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
  &:hover {
    opacity: 0.9;
  }
`;

export const ErrorText = styled.span`
  color: #ef4444;
  font-size: 11px;
  margin-top: -4px;
`;
