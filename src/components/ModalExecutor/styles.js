import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;
export const CardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px; /* Espaço entre os cards */
  padding-bottom: 10px;
`;

export const OSCard = styled.div`
  background: #fdfdfd;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 8px;

  .numero {
    font-weight: bold;
    color: #0073ea;
    font-size: 1.1rem;
  }
`;

export const CardContent = styled.div`
  font-size: 0.95rem;
  color: #444;

  p {
    margin: 4px 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .descricao {
    margin-top: 8px;
    background: #f8f9fa;
    padding: 8px;
    border-radius: 6px;

    strong {
      font-size: 0.85rem;
      color: #666;
    }
    p {
      white-space: normal; 
      font-size: 0.9rem;
      color: #333;
      margin-top: 4px;
    }
  }
`;

export const ModalContainer = styled.div`
  background: white;
  width: 100%;
  max-width: 800px;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  @media (max-width: 1280px) {
    width: 80%;
  }
`;

export const ModalHeader = styled.div`
  padding: 20px;
  background: #0073ea;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    margin: 0;
    font-size: 1.5rem;
  }
  button {
    background: none;
    border: none;
    color: white;
    font-size: 2rem;
    cursor: pointer;
  }
`;

export const ModalBody = styled.div`
  padding: 20px;
  max-height: 60vh;
  overflow-y: auto;
`;

export const TabelaContainer = styled.div`
  width: 100%;
  overflow-x: auto;

  table {
    width: 100%;
    border-collapse: collapse;
    min-width: 500px;
  }

  th {
    background: #f8f9fa;
    padding: 12px;
    text-align: left;
    color: #666;
    font-size: 0.9rem;
    border-bottom: 2px solid #eee;
  }

  td {
    padding: 12px;
    border-bottom: 1px solid #eee;
    color: #333;
    font-size: 1rem;
    white-space: nowrap;

    &.bold {
      font-weight: bold;
      color: #0073ea;
    }
  }
`;

export const Badge = styled.span`
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: bold;
  background: ${(props) =>
    props.status === "EM PROCESSO" ? "#0073EA" : "#fdab3d"};
  color: white;
`;

export const BotaoFechar = styled.button`
  background: #333;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  margin: 15px;
  align-self: flex-end;
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #eee;
`;

export const AvisoVazio = styled.div`
  text-align: center;
  padding: 40px;
  color: #999;
`;
