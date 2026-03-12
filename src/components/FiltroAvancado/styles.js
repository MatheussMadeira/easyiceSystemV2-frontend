import styled from "styled-components";

// --- COMPONENTES DO FILTRO AVANÇADO ---

export const PopoverFiltroWrapper = styled.div`
  position: absolute;
  top: 50px;
  left: 0;
  background: #18181b;
  border: 1px solid #27272a;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  z-index: 1001;
  padding: 15px;
  width: 800px;
  max-height: 500px;
  display: flex;
  flex-direction: column;
`;

// ESTE ESTAVA FALTANDO:
export const PopoverHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #27272a;
  margin-bottom: 10px;

  span {
    color: #fff;
    font-weight: 600;
    font-size: 14px;
  }

  button {
    background: none;
    border: none;
    color: #71717a;
    cursor: pointer;
    font-size: 18px;
    &:hover {
      color: #fff;
    }
  }
`;

export const FiltroGridColunas = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  overflow: hidden;
`;

export const FiltroColuna = styled.div`
  display: flex;
  flex-direction: column;
  h4 {
    color: #71717a;
    font-size: 11px;
    text-transform: uppercase;
    margin-bottom: 10px;
  }
`;

export const FiltroListaScroll = styled.div`
  overflow-y: auto;
  max-height: 350px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-right: 5px;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #3f3f46;
    border-radius: 10px;
  }
`;

export const FiltroItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  background: ${(props) =>
    props.$active ? "rgba(59, 130, 246, 0.15)" : "transparent"};
  border: 1px solid ${(props) => (props.$active ? "#3b82f6" : "transparent")};
  color: ${(props) => (props.$active ? "#3b82f6" : "#a1a1aa")};
  transition: all 0.2s;
  &:hover {
    background: #27272a;
  }
`;

export const AvatarIniciais = styled.div`
  width: 24px;
  height: 24px;
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: bold;
  flex-shrink: 0;
`;

// --- COMPONENTES ADICIONAIS PARA O HEADER DA TABELA ---

export const InputBusca = styled.input`
  background: #18181b;
  border: 1px solid #27272a;
  padding: 10px 15px;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  outline: none;
  width: 100%;
  &:focus {
    border-color: #3b82f6;
  }
`;

export const FiltroChip = styled.div`
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid ${(props) => (props.$active ? "#3b82f6" : "#27272a")};
  background: ${(props) =>
    props.$active ? "rgba(59, 130, 246, 0.2)" : "transparent"};
  color: ${(props) => (props.$active ? "#3b82f6" : "#a1a1aa")};
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;
