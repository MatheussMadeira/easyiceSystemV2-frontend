import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px); /* Efeito de desfoque moderno */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
`;

export const ModalContainer = styled.div`
  background: #09090b;
  width: 100%;
  max-width: 800px;
  border-radius: 12px;
  border: 1px solid #1f1f23;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
`;

export const ModalHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #1f1f23;
  display: flex;
  justify-content: space-between;
  align-items: center;

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
    color: #71717a;
    font-size: 1.5rem;
    cursor: pointer;
    line-height: 1;
    &:hover {
      color: #fafafa;
    }
  }
`;

export const ModalBody = styled.div`
  padding: 24px;
  max-height: 60vh;
  overflow-y: auto;

  /* Scrollbar Minimalista */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #27272a;
    border-radius: 10px;
  }
`;

export const CardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const OSCard = styled.div`
  background: #09090b;
  border: 1px solid #1f1f23;
  border-radius: 8px;
  padding: 16px;
  transition: border-color 0.2s;
  &:hover {
    border-color: #27272a;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;

  .numero {
    font-weight: 600;
    color: #3b82f6; /* Azul destaque */
    font-size: 0.95rem;
  }
`;

export const Badge = styled.span`
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  background: ${(props) =>
    props.status === "EM PROCESSO"
      ? "rgba(59, 130, 246, 0.1)"
      : "rgba(245, 158, 11, 0.1)"};
  color: ${(props) => (props.status === "EM PROCESSO" ? "#3b82f6" : "#f59e0b")};
  border: 1px solid
    ${(props) =>
      props.status === "EM PROCESSO"
        ? "rgba(59, 130, 246, 0.2)"
        : "rgba(245, 158, 11, 0.2)"};
`;

export const CardContent = styled.div`
  font-size: 0.875rem;
  color: #a1a1aa;

  p {
    margin: 6px 0;
  }
  strong {
    color: #e4e4e7;
    font-weight: 500;
  }

  .descricao-box {
    margin-top: 12px;
    padding: 12px;
    background: #000;
    border-radius: 6px;
    border: 1px solid #121214;
    border-left: 3px solid #3b82f6;

    .label {
      display: block;
      font-size: 11px;
      font-weight: 600;
      color: #3b82f6;
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .texto {
      color: #e4e4e7;
      font-size: 13px;
      line-height: 1.5;
    }
  }
`;

export const ModalFooter = styled.div`
  padding: 16px 24px;
  border-top: 1px solid #1f1f23;
  display: flex;
  justify-content: flex-end;
`;

export const BotaoFechar = styled.button`
  background: #fafafa;
  color: #09090b;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;

export const AvisoVazio = styled.div`
  text-align: center;
  padding: 40px;
  color: #3f3f46;
  font-size: 0.9rem;
  border: 1px dashed #1f1f23;
  border-radius: 8px;
`;
