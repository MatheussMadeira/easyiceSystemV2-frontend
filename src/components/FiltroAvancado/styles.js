import styled from "styled-components";

// --- COMPONENTES DO FILTRO AVANÇADO ---

export const PopoverFiltroWrapper = styled.div`
  position: absolute;
  top: 10px;
  right: 0;
  background: #18181b;
  border: 1px solid #27272a;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  z-index: 1000;

  width: fit-content;
  min-width: 300px;
  max-width: 95vw;

  @media (max-width: 768px) {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    height: auto;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
`;

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
  gap: 20px;

  grid-template-columns: repeat(${(props) => props.totalColunas || 1}, 1fr);

  @media (max-width: 768px) {
    grid-template-columns: 1fr !important;
    overflow-y: auto;
    padding-right: 5px;

    &::-webkit-scrollbar {
      width: 10px;
    }
    &::-webkit-scrollbar-thumb {
      background: #3f3f46;
    }
  }
`;
export const FiltroColuna = styled.div`
  min-width: 180px;

  h4 {
    font-size: 12px;
    color: #71717a;
    text-transform: uppercase;
    margin-bottom: 12px;
    letter-spacing: 0.05em;
    position: sticky;
    top: 0;
    background: #18181b;
    padding-bottom: 5px;
  }

  @media (max-width: 768px) {
    min-width: 100%;
    border-bottom: 1px solid #27272a;
    padding-bottom: 15px;
    margin-bottom: 10px;

    &:last-child {
      border-bottom: none;
    }
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
