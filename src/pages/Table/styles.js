import styled from "styled-components";

export const PaginaContainer = styled.div`
  background-color: #f5f6f8;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin: 0;
  padding: 0;
  font-family: "Roboto", sans-serif;
  overflow: hidden;
`;

export const HeaderFixo = styled.header`
  background: white;
  padding: 16px 24px;
  border-bottom: 1px solid #e6e9ef;
  flex-shrink: 0;
  z-index: 100;
`;
export const TdTexto = styled.td`
  width: ${(props) => props.width || "150px"};
  height: 8vh;
  border: 1px solid #e6e9ef;
  vertical-align: top;
  position: relative;
  padding: 0 !important;
`;
export const TdSelect = styled.td`
  padding: 0 !important;
  border: 1px solid #e6e9ef;
  width: ${(props) => props.width || "140px"};
  height: 40px;
`;

export const SelectMonday = styled.select`
  width: 100%;
  height: 100%;
  border: none;
  color: white;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  appearance: none;
  transition: background-color 0.2s;

  background-color: ${(props) => props.bgColor || "#c4c4c4"};

  &:focus {
    outline: none;
  }

  option {
    background-color: #fff;
    color: #333;
    font-weight: normal;
  }
`;
export const InputValor = styled.input`
  width: 100%;
  height: 100%;
  min-height: 50px;
  border: none;
  background: transparent;
  padding: 10px;
  resize: none;
  overflow: hidden;
  font-family: inherit;
  font-size: 14px;
  color: #333;
  outline: none;
  white-space: pre-wrap;
  word-wrap: break-word;
  display: block;
  box-sizing: border-box;
  text-align: center;

  &:hover {
    background: #f5f6f8;
  }

  &:focus {
    background: #fff;
    box-shadow: inset 0 0 0 2px #0073ea;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &:hover {
    background: #f5f6f8;
  }

  &:focus {
    background: #fff;
    border: 1px solid #0073ea;
  }
`;
export const SelectIdentificacao = styled.select`
  width: 100%;
  height: 100%;
  border: none;
  background-color: ${(props) => props.bgColor || "#f1f3f5"};
  color: #333;
  font-size: 13px;
  text-align-last: center;
  cursor: pointer;
  appearance: none;
  outline: none;

  &:hover {
    background-color: #e9ecef;
  }

  &:focus {
    background-color: #fff;
    box-shadow: inset 0 0 0 2px #0073ea;
  }

  option {
    background-color: #fff;
    color: #333;
  }
`;
export const EditableTextarea = styled.textarea`
  width: 100%;
  height: 100%;
  min-height: 40px;
  border: none;
  background: transparent;
  padding: 10px;
  resize: none;
  overflow: hidden;
  font-family: inherit;
  font-size: 14px;
  color: #333;
  outline: none;
  white-space: pre-wrap;
  word-wrap: break-word;
  display: block;
  box-sizing: border-box;
  text-align: center;

  &:hover {
    background: #f5f6f8;
  }

  &:focus {
    background: #fff;
    box-shadow: inset 0 0 0 2px #0073ea;
  }
`;
export const TabelaWrapper = styled.div`
  flex-grow: 1;
  overflow: auto;
  padding: 0 40px 40px 40px;

  &::-webkit-scrollbar {
    width: 20px;
    height: 20px;
  }
  &::-webkit-scrollbar-thumb {
    background: #c5c7d0;
    border-radius: 0px;
    &:hover {
      cursor: pointer;
    }
  }
  &::-webkit-scrollbar-track {
    background: #f5f6ff;
  }
`;

export const TabelaStyled = styled.table`
  width: 100%;
  min-width: 1800px;
  border-collapse: separate;
  border-spacing: 0;
  background: white;
`;

export const Th = styled.th`
  padding: 14px 12px;
  text-align: center;
  color: #323338;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  background: white;
  position: sticky;
  top: 0;
  z-index: 20;
  border-right: 1px solid #e6e9ef;
  box-shadow: inset 0 -2px 0 0 #c5c7d0;
`;
export const TrHeader = styled.tr`
  box-shadow: none;
`;

export const Td = styled.td`
  padding: 5px;
  border-bottom: 1px solid #e6e9ef;
  border-right: 1px solid #e6e9ef;
  font-size: 13px;
  text-align: center;
`;

export const CelulaStatus = styled.div`
  background-color: ${(props) => props.color || "#ccc"};
  color: white;
  font-weight: bold;
  font-size: 11px;
  padding: 8px;
  text-align: center;
  text-transform: uppercase;
  border-radius: 4px;
`;

export const BotaoNovo = styled.button`
  background-color: #0073ea;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #0060c5;
  }
`;
export const TdDescricao = styled(Td)`
  white-space: normal;
  word-break: break-word;

  text-align: center;
  min-width: 300px;
  max-width: 500px;
  line-height: 1.4;
  padding: 12px;
`;
