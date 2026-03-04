import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000; /* Garante que fique acima da tabela fixa */
  backdrop-filter: blur(2px);
`;

export const ModalContainer = styled.div`
  background: white;
  width: 90%;
  max-width: 500px;
  max-height: 85vh;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

export const ModalHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #e6e9ef;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    margin: 0;
    font-size: 20px;
    color: #323338;
  }

  button {
    background: none;
    border: none;
    font-size: 28px;
    cursor: pointer;
    color: #676879;
    line-height: 1;

    &:hover {
      color: #323338;
    }
  }
`;

export const ModalBody = styled.div`
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 14px;
    font-weight: 500;
    color: #323338;
  }

  input,
  select,
  textarea {
    padding: 8px 12px;
    border: 1px solid #c5c7d0;
    border-radius: 4px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;

    &:focus {
      border-color: #0073ea;
    }
  }

  textarea {
    min-height: 80px;
    resize: vertical;
  }
`;

export const ModalFooter = styled.div`
  padding: 16px 24px;
  border-top: 1px solid #e6e9ef;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background-color: #f5f6f8;
`;

export const BotaoCancelar = styled.button`
  background: transparent;
  border: 1px solid #c5c7d0;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background: #e6e9ef;
  }
`;

export const BotaoConfirmar = styled.button`
  background: #0073ea;
  color: white;
  border: none;
  padding: 8px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background: #0056b3;
  }
`;

export const ErrorText = styled.span`
  color: #df2f4a;
  font-size: 12px;
  margin-top: -4px;
`;
