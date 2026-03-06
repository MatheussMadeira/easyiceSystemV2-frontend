import styled from "styled-components";
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
