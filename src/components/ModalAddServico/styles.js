import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(4px);
`;

export const ModalContainer = styled.div`
  background: #18181b;
  border: 1px solid #27272a;
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
  overflow: hidden;
`;

export const Header = styled.div`
  padding: 20px;
  border-bottom: 1px solid #27272a;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    font-size: 18px;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  button {
    background: transparent;
    border: none;
    color: #71717a;
    cursor: pointer;
    &:hover {
      color: #ef4444;
    }
  }
`;

export const Form = styled.form`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 12px;
    color: #a1a1aa;
    font-weight: 500;
  }

  input,
  select,
  textarea {
    background: #09090b;
    border: 1px solid #27272a;
    border-radius: 8px;
    padding: 12px;
    color: #fff;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;

    &:focus {
      border-color: #3b82f6;
    }
  }

  textarea {
    resize: none;
    height: 80px;
  }
`;

export const Footer = styled.div`
  padding: 20px;
  border-top: 1px solid #27272a;
  display: flex;
  gap: 10px;

  button {
    flex: 1;
    padding: 12px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: 0.2s;
  }

  .btn-cancel {
    background: transparent;
    border: 1px solid #27272a;
    color: #fff;
    &:hover {
      background: #27272a;
    }
  }

  .btn-save {
    background: #3b82f6;
    border: none;
    color: #fff;
    &:hover {
      background: #2563eb;
    }
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;
export const SeletorTrigger = styled.button`
  background: #09090b;
  border: 1px solid ${(props) => (props.focado ? "#3b82f6" : "#27272a")};
  border-radius: 8px;
  padding: 12px;
  color: ${(props) => (props.$temValor ? "#fafafa" : "#71717a")};
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  width: 100%;
  text-align: left;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .seta {
    color: #71717a;
    font-size: 10px;
  }
`;

export const PopoverWrapper = styled.div``;
