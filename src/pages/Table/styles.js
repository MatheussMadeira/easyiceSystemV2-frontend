import styled from "styled-components";

export const PaginaContainer = styled.div`
  background-color: #09090b;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  font-family: "Inter", sans-serif;
  color: #fafafa;
  overflow: hidden;
`;

export const HeaderFixo = styled.header`
  padding: 24px 32px;
  border-bottom: 1px solid #1f1f23;
  display: flex;
  justify-content: space-between;
  align-items: center;

  p {
    
  }
  h1 {
    font-size: 20px;
    font-weight: 600;
    letter-spacing: -0.025em;
  }
`;

export const TabelaWrapper = styled.div`
  flex-grow: 1;
  overflow: auto;
  padding: 0 10px 10px 10px;

  /* Scrollbar Minimalista */
  &::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background: #27272a;
    border-radius: 10px;
  }
`;

export const TabelaStyled = styled.table`
  width: 100%;
  min-width: 2400px;
  border-collapse: collapse;
  background: #09090b;
`;

export const Th = styled.th`
  padding: 12px 16px;
  text-align: center;
  color: #71717a; /* Cinza suave */
  font-size: 12px;
  font-weight: 500;
  border-bottom: 1px solid #1f1f23;
  background: #09090b;
  position: sticky;
  top: 0;
  z-index: 10;
`;

export const TrHeader = styled.tr``;

export const Td = styled.td`
  padding: 12px 16px;
  border-bottom: 1px solid #121214;
  font-size: 13px;
  color: #e4e4e7;
  vertical-align: middle;
  height: 60px;
`;

/* Célula de Input/Select */
export const TdSelect = styled.td`
  padding: 4px 8px;
  border-bottom: 1px solid #121214;
  width: ${(props) => props.width || "auto"};
  margin-right: 5px;
`;

export const TdTexto = styled(TdSelect)``;

/* O "Badge/Pill" que você viu na imagem */
export const SelectStatus = styled.select`
  width: 100%;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
  appearance: none;
  text-align: center;
  background-color: ${(props) => props.bgColor || "#27272a"};
  color: #fff;
  transition: all 0.2s;

  &:hover {
    filter: brightness(1.2);
  }
`;

/* Select Transparente para nomes (estilo Linear) */
export const SelectClean = styled.select`
  width: 100%;
  background: transparent;
  border: 1px solid transparent;
  color: #e4e4e7;
  padding: 6px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    border-color: #27272a;
    background: #121214;
  }
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

export const EditableTextarea = styled.textarea`
  width: 100%;
  min-height: 40px; /* Altura mínima elegante */
  background: transparent;
  border: none;
  color: #e4e4e7;
  font-family: inherit;
  font-size: 13px;
  line-height: 1.5;
  text-align: center;
  padding: 8px;
  resize: none; /* Impede o usuário de puxar o cantinho */
  overflow: hidden; /* Esconde o scroll feio */
  transition: all 0.2s ease;
  padding-top: 20px;
  padding-bottom: 5px;
  box-sizing: border-box;

  &:hover {
    background: rgba(255, 255, 255, 0.03);
    border-radius: 4px;
  }

  &:focus {
    outline: none;
    background: #000;
    box-shadow: inset 0 0 0 1px #27272a;
    border-radius: 4px;
    overflow-y: auto;
  }

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #3f3f46;
    border-radius: 10px;
  }
`;

export const ActionButton = styled.button`
  background: transparent;
  border: none;
  color: #71717a;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  &:hover {
    background: #1f1f23;
    color: #ef4444;
  }
`;
