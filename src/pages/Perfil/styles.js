import styled from "styled-components";

export const Container = styled.div`
  background-color: #09090b;
  min-height: 100vh;
  color: #fff;
`;

export const Content = styled.div`
  padding: 80px 40px 40px;
  max-width: 600px;
  margin: 0 auto;
`;

export const Header = styled.div`
  margin-bottom: 30px;
  text-align: center;
  h1 {
    font-size: 24px;
    margin-bottom: 5px;
  }
  p {
    color: #71717a;
    font-size: 14px;
  }
`;

export const ProfileCard = styled.div`
  background: #18181b;
  border: 1px solid #27272a;
  border-radius: 16px;
  overflow: hidden;
  padding: 40px;
`;

export const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;

  .avatar-circle {
    width: 80px;
    height: 80px;
    background: #3b82f6;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 15px;
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
  }

  h2 {
    font-size: 20px;
    margin-bottom: 5px;
  }
  span {
    color: #3b82f6;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
  }
`;

export const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-top: 1px solid #27272a;
  padding-top: 30px;
`;

export const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  width: 100%; // Garante que use a largura total

  .icon {
    background: #27272a;
    padding: 10px;
    border-radius: 8px;
    color: #a1a1aa;
    flex-shrink: 0; // Impede o ícone de amassar
  }

  div {
    min-width: 0; // ISSO impede o texto de "comer" a borda

    label {
      display: block;
      font-size: 12px;
      color: #71717a;
    }

    p {
      font-size: 15px;
      color: #e4e4e7;
      word-wrap: break-word;
      overflow-wrap: break-word;

      &.user-id {
        word-break: break-all;
      }
    }
  }
`;

export const ActionSection = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: center;

  .btn-password {
    background: transparent;
    border: 1px solid #3f3f46;
    color: #fff;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    transition: 0.2s;
    font-size: 14px;

    &:hover {
      background: #27272a;
      border-color: #52525b;
    }
  }
`;
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0px;
  right: 0px;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

export const ModalContent = styled.div`
  background: #18181b;
  border: 1px solid #27272a;
  padding: 25px;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h3 {
      font-size: 18px;
      font-weight: 600;
    }

    button {
      background: none;
      border: none;
      color: #71717a;
      cursor: pointer;
      display: flex;
      align-items: center;
      &:hover {
        color: #ef4444;
      }
    }
  }

  .modal-body {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .input-group {
    background: #09090b;
    border: 1px solid #27272a;
    border-radius: 8px;
    padding: 10px 15px;
    display: flex;
    align-items: center;
    gap: 10px;

    input {
      background: none;
      border: none;
      color: #fff;
      width: 100%;
      outline: none;
      font-size: 14px;
      &::placeholder {
        color: #3f3f46;
      }
    }

    svg {
      color: #71717a;
    }
  }

  .btn-save {
    width: 100%;
    background: #3b82f6;
    color: #fff;
    border: none;
    padding: 12px;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    margin-top: 10px;
    transition: 0.2s;

    &:hover:not(:disabled) {
      background: #2563eb;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;
