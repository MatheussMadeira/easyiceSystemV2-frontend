import styled from "styled-components";

export const HomeContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: flex-start; /* Alinhado ao topo */
  justify-content: center;
  gap: 24px;
  width: 100vw;
  min-height: 100vh;
  background-color: #09090b; /* Fundo SaaS Moderno */
  padding: 70px 20px;
  box-sizing: border-box;
  font-family: "Inter", sans-serif;
`;

export const Card = styled.div`
  background: #09090b;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #1f1f23;
  flex: 1 1 350px;
  max-width: 400px;
  height: 420px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.2s ease;

  h3 {
    margin-bottom: 8px;
  }

  &:hover {
    border-color: #27272a;
  }

  & > div:nth-child(2) {
    flex-grow: 1;
    overflow-y: auto;
    margin: 16px 0;
    padding-right: 8px;

    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background: #27272a;
      border-radius: 10px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
  }

  &:hover {
    border-color: #27272a;
    background: #0c0c0e;
  }

  h3 {
    color: #fafafa;
    font-size: 1.2rem;
    margin: 0;
    font-weight: 600;
    letter-spacing: -0.025em;
  }

  p {
    color: #71717a;
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 25px 0;
  }

  input {
    background: #000;
    border: 1px solid #27272a;
    color: #fafafa;
    padding: 12px;
    margin-top: 4rem;
    border-radius: 8px;
    font-size: 1.5rem;
    width: 100%;
    text-align: center;
    box-sizing: border-box;
    outline: none;

    &:focus {
      border-color: #3b82f6;
    }
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    &[type="number"] {
      -moz-appearance: textfield;
      appearance: textfield;
    }
  }

  @media (max-width: 768px) {
    flex: 1 1 100%;
    max-width: 100%;
  }
`;

export const BotaoCard = styled.button`
  background: #fafafa;
  color: #09090b;
  border: none;
  padding: 14px 20px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  margin-top: auto; /* Garante o alinhamento na base se o flex falhar */
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;
export const ProximaOS = styled.h2`
  font-size: 4rem;
  color: #3b82f6; /* Azul Linear */
  font-weight: 800;
  letter-spacing: -0.05em;
  text-align: center;
`;

export const RankingWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const RankingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s;

  &:hover {
    background: #121214;
    border-color: #1f1f23;
  }

  span.nome {
    font-size: 0.9rem;
    font-weight: 500;
    color: #e4e4e7;
  }
`;

export const Badge = styled.span`
  background: ${(props) => props.color || "#27272a"};
  color: #fff;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 15px;
  font-weight: 700;
  min-width: 25px;
  text-align: center;
`;

export const RankingVazio = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3f3f46;
  font-size: 0.8rem;
  border: 1px dashed #1f1f23;
  border-radius: 8px;
`;

/* Botão Hamburguer */
export const MenuToggle = styled.button`
  position: fixed;
  width: 40px;
  font-size: 1.2rem;
  top: 20px;
  left: 20px;
  background: transparent;
  border: 1px solid #27272a;
  color: #fafafa;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: #27272a;
    border-color: #3f3f46;
  }

  @media (max-width: 768px) {
    display: none; /* Esconde no celular conforme solicitado */
  }
`;

export const MenuOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 998;
  display: ${(props) => (props.isOpen ? "block" : "none")};
`;

/* Sidebar Retrátil */
export const Sidebar = styled.aside`
  position: fixed;
  top: 0;
  left: ${(props) => (props.isOpen ? "0" : "-300px")};
  width: 280px;
  height: 100vh;
  background: #09090b;
  z-index: 999;
  transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 80px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const MenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  color: ${(props) => (props.active ? "#fafafa" : "#a1a1aa")};
  background: ${(props) => (props.active ? "#18181b" : "transparent")};
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: #18181b;
    color: #fafafa;
  }

  svg {
    font-size: 1.2rem;
  }
`;
export const TransitionOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(9, 9, 11, 0.8); /* Cor Zinc-950 com transparência */
  backdrop-filter: blur(8px);
  z-index: 10000; /* Acima de tudo */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;

  h2 {
    color: #fafafa;
    font-size: 1.2rem;
    font-weight: 500;
    letter-spacing: -0.025em;
  }
`;

/* Um spinner minimalista para combinar com o design Linear */
export const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: #3b82f6; /* Azul do seu sistema */
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
