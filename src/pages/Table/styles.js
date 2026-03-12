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
  h1 {
    font-size: 20px;
    font-weight: 600;
  }
`;

export const TabelaWrapper = styled.div`
  flex-grow: 1;
  overflow: auto;
  padding: 0 10px 10px 10px;
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: #27272a;
    border-radius: 10px;
  }
`;

export const TabelaStyled = styled.table`
  width: 100%;
  min-width: 4000px;
  border-collapse: collapse;
  background: #09090b;
`;

export const Th = styled.th`
  padding: 12px 16px;
  text-align: center;
  color: #71717a;
  font-size: 12px;
  font-weight: 500;
  border-bottom: 2px solid #1f1f23;
  border-right: 2px solid #1f1f23;
  background: #09090b;
  position: sticky;
  top: 0;
  z-index: 20; /* Garantir que o header fique acima de tudo */
`;

export const Td = styled.td`
  padding: 12px 16px;
  border-bottom: 1px solid #1f1f23;
  border-right: 1px solid #1f1f23;
  font-size: 13px;
  color: #e4e4e7;
  vertical-align: middle;
  text-align: center;
  height: 60px;
  box-sizing: border-box;
`;

export const TdSelect = styled.td`
  padding: 8px;
  border-bottom: 1px solid #1f1f23;
  border-right: 1px solid #1f1f23;
  width: ${(props) => props.width || "auto"};
  vertical-align: middle;
  position: relative; /* Necessário para o Popover */
  overflow: visible !important; /* Permite que o Popover apareça fora da célula */
`;

export const TdTexto = styled(TdSelect)`
  overflow: hidden !important;
`;

export const EditableTextarea = styled.textarea`
  width: 100%;
  height: 40px;
  background: transparent;
  border: none;
  color: #e4e4e7;
  font-family: inherit;
  font-size: 13px;
  text-align: center;
  padding: 10px 0px;
  resize: none;
  overflow: hidden;
  &:focus {
    outline: none;
    background: #000;
    border-radius: 4px;
  }
`;

export const ActionButton = styled.button`
  background: transparent;
  border: none;
  color: #71717a;
  cursor: pointer;
  padding: 8px;
  &:hover {
    color: #ef4444;
  }
`;

export const TrHeader = styled.tr``;

/* Container para centralizar a foto perfeitamente na célula de 60px */
export const FotoWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%; /* Ocupa os 60px da altura da td */
  box-sizing: border-box;
  padding: 4px; /* Espaço para a foto não colar na borda da grade */
`;

/* O componente da Miniatura (Thumbnail) */
export const FotoThumbnail = styled.div`
  width: 32px; /* Tamanho menor para caber na linha de 60px */
  height: 32px;
  background-color: #000;
  border: 1px solid #27272a; /* Borda sutil Linear */
  border-radius: 6px; /* Arredondamento igual aos selects da Monday */
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* Foto preenche o quadrado sem distorcer */
    display: block; /* Remove espaços fantasmas do navegador */
  }

  /* Efeito Moderno de Hover */
  &:hover {
    border-color: #3b82f6; /* Borda azul Linear ao passar o mouse */
    transform: scale(1.1); /* Leve zoom visual */
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }

  /* Estilo para quando não há foto (Placeholder) */
  &.vazio {
    background-color: #121214;
    cursor: default;

    &::after {
      content: "!"; /* Sinal de "vazio" */
      color: #3f3f46;
      font-size: 16px;
      font-weight: 700;
    }

    &:hover {
      border-color: #27272a;
      transform: none;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
  }
`;
export const InputBusca = styled.input`
  background: #18181b;
  width: 15%;
  border: 1px solid #27272a;
  padding: 10px 15px;
  margin-left: 50px;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  outline: none;
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
