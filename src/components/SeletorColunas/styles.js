import styled from "styled-components";

export const Container = styled.div`
  position: absolute;
  top: 50px;
  left: 0;
  background: #18181b;
  border: 1px solid #27272a;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  z-index: 1001;
  padding: 15px;
  width: 20vw;
  max-height: 500px;
  display: flex;
  flex-direction: column;

  /* Custom Scrollbar para combinar com o tema */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #3f3f46;
    border-radius: 10px;
  }
`;

export const Titulo = styled.h4`
  color: #a1a1aa;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
  font-weight: 700;
`;

export const OpcaoItem = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${(props) => (props.$active ? "#fff" : "#71717a")};
  background: ${(props) =>
    props.$active ? "rgba(59, 130, 246, 0.1)" : "transparent"};

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #fff;
  }

  input {
    accent-color: #3b82f6;
    width: 16px;
    height: 16px;
    cursor: pointer;
  }

  span {
    font-size: 14px;
    font-weight: 500;
  }
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 998;
  background: transparent;
`;
