import styled from "styled-components";

export const PopoverWrapper = styled.div`
  position: absolute;
  z-index: 10000;
  background: #18181b;
  border: 1px solid #27272a;
  width: ${(props) => props.largura || "20vw"};
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
  margin-top: 8px;
  padding: 12px;
  animation: fadeIn 0.15s ease-out;
  @media (max-width: 1168px) {
    width: 95%;
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const PopoverHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #27272a;

  span {
    font-size: 11px;
    font-weight: 600;
    color: #71717a;
    text-transform: uppercase;
  }
  button {
    background: none;
    border: none;
    color: #71717a;
    cursor: pointer;
    font-size: 18px;
  }
`;

export const ListaOpcoes = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 250px;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #3f3f46;
    border-radius: 10px;
  }
`;

export const OpcaoItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: ${(props) => (props.active ? "#1e293b" : "transparent")};
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;

  .nome-clicavel {
    flex: 1;
    color: ${(props) => (props.active ? "#3b82f6" : "#e4e4e7")};
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &:hover {
    background: #27272a;
  }
`;

export const BotaoEditarMini = styled.button`
  background: transparent;
  border: none;
  color: #71717a;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  margin-left: 8px;

  &:hover {
    color: #fafafa;
    background: #3f3f46;
  }
`;

export const PopoverFooter = styled.div`
  padding-top: 12px;
  border-top: 1px solid #27272a;
  margin-top: 8px;
`;

export const BotaoAdicionarRapido = styled.button`
  width: 100%;
  background: transparent;
  border: 1px dashed #3f3f46;
  color: #a1a1aa;
  padding: 10px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #3b82f6;
    color: #3b82f6;
    background: rgba(59, 130, 246, 0.05);
  }
`;
