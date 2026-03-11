import styled from "styled-components";

export const MenuToggle = styled.button`
  position: fixed;
  width: 42px;
  height: 42px;
  top: 20px;
  left: 20px;
  background: #09090b;
  border: 1px solid #1f1f23;
  color: #fafafa;
  border-radius: 8px;
  cursor: pointer;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: #18181b;
    border-color: #27272a;
  }
`;

export const MenuOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 998;
  display: ${(props) => (props.isOpen ? "block" : "none")};
`;

export const Sidebar = styled.aside`
  position: fixed;
  top: 0;
  left: ${(props) => (props.isOpen ? "0" : "-400px")};
  height: 100vh;
  width: 14%;
  background: #09090b;
  border-right: 1px solid #1f1f23;
  z-index: 999;
  transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 80px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
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
  transition: all 0.2s;

  &:hover {
    background: #18181b;
    color: ${(props) =>
      props.style?.color === "#ef4444" ? "#ef4444" : "#fafafa"};
    transform: translateX(4px);
  }
`;
export const LogoutWrapper = styled.div`
  margin-top: auto;
  padding: 20px 0;
  border-top: 1px solid #1f1f23;
  display: flex;
  flex-direction: column;
  gap: 12px;

  p {
    color: #71717a;
    font-size: 11px;
    text-transform: uppercase;
    margin: 0;

    strong {
      color: #fafafa;
      display: block;
      font-size: 13px;
      margin-top: 4px;
    }
  }

  button {
    background: transparent;
    border: 1px solid #27272a;
    color: #ef4444;
    padding: 12px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s;

    &:hover {
      background: rgba(239, 68, 68, 0.1);
      border-color: #ef4444;
    }
  }
`;
export const TransitionOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(9, 9, 11, 0.9);
  backdrop-filter: blur(8px);
  z-index: 10000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;

  h2 {
    color: #fafafa;
    font-size: 1.1rem;
    font-weight: 500;
  }
`;
export const Spinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid rgba(255, 255, 255, 0.05);
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
