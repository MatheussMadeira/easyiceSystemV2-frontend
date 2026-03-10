import styled from "styled-components";

export const PopoverGrade = styled.div`
  position: absolute;
  z-index: 1000;
  background: #18181b;
  border: 1px solid #27272a;
  width: 95%;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
  margin-top: 8px;
  padding: 12px;
  animation: fadeIn 0.15s ease-out;

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

export const GradeHeader = styled.div`
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

export const GradeContainer = styled.div`
  display: flex; /* Mudamos de grid para flex */
  flex-direction: column; /* Itens um embaixo do outro */
  gap: 8px;
  max-height: 250px;
  width: 100%; /* Garante que ocupe o espaço disponível */
  min-width: 250px; /* Evita que o popover fique muito estreito */
  overflow-y: auto;
  overflow-x: hidden; /* Mata o scroll lateral */

  grid-template-columns: 1fr;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #3f3f46;
    border-radius: 10px;
  }
`;

export const BotaoOpcao = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: ${(props) =>
    props.ativo ? "rgba(59, 130, 246, 0.2)" : "#09090b"};
  border: 1px solid ${(props) => (props.ativo ? "#3b82f6" : "#27272a")};
  border-radius: 6px;
  color: #fafafa;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;

  &:hover {
    background: #27272a;
    border-color: #3f3f46;
  }

  .avatar {
    width: 20px;
    height: 20px;
    background: #3b82f6;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: bold;
  }

  .nome {
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
