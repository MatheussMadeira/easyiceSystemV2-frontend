import styled from "styled-components";

export const HomeContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: flex-start;
  justify-content: center;
  gap: 24px;
  width: 100%;
  min-height: 100vh;
  background-color: #09090b;
  padding: 70px 20px;
  box-sizing: border-box;
  font-family: "Inter", sans-serif;
`;
export const RankingWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
  overflow-y: auto;
  padding-right: 4px;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #1f1f23;
    border-radius: 10px;
  }
`;
export const Card = styled.div`
  background: #09090b;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #1f1f23;
  flex: 1 1 350px;
  max-width: 400px;
  height: 420px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.2s ease;

  h3 {
    color: #fafafa; /* Branco suave */
    font-size: 1.2rem;
    margin: 0;
    font-weight: 600;
    letter-spacing: -0.025em;
    margin-bottom: 8px;
    text-align: left;
  }

  p {
    color: #fafafa;
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0;
    text-align: left;
  }

  & > div:nth-child(2),
  & > ${RankingWrapper} {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    margin: 16px 0;
    padding-right: 8px;

    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background: #27272a;
      border-radius: 10px;
    }
  }

  /* Ajuste específico para o input de Fechar OS */
  input {
    background: #000;
    border: 1px solid #27272a;
    color: #fafafa;
    padding: 12px;
    border-radius: 8px;
    font-size: 1.5rem;
    width: 100%;
    text-align: center;
    box-sizing: border-box;
    outline: none;

    &:focus {
      border-color: #3b82f6;
    }

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }

  &:hover {
    border-color: #27272a;
    background: #0c0c0e;
  }

  @media (max-width: 768px) {
    flex: 1 1 100%;
    max-width: 100%;
  }
`;

export const RankingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 22px;
  background: #121214;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s;
  &:hover {
    background: #18181b;
    border-color: #27272a;
    transform: translateX(4px);
  }

  span.nome {
    font-size: 0.85rem;
    font-weight: 500;
    color: #e4e4e7;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 70%;
  }
`;

export const Badge = styled.span`
  background: ${(props) => props.color || "#27272a"};
  color: #fff;
  padding: 2px 6px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 700;
  min-width: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`;
// Container para o posicionamento do Popover
export const CardActionWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const PopoverMenu = styled.div`
  position: absolute;
  bottom: calc(100% + 10px); /* Aparece acima do botão */
  left: 0;
  right: 0;
  background: #18181b;
  border: 1px solid #27272a;
  border-radius: 12px;
  padding: 8px;
  z-index: 100;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  gap: 4px;

  button {
    background: transparent;
    border: none;
    color: #fff;
    padding: 12px;
    text-align: left;
    display: flex;
    align-items: center;
    gap: 12px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 13px;
    transition: 0.2s;

    &:hover {
      background: #27272a;
      color: #3b82f6;
    }

    svg {
      color: #3b82f6;
    }
  }

  /* Triângulo do Popover (opcional) */
  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 8px;
    border-style: solid;
    border-color: #27272a transparent transparent transparent;
  }
`;
export const BotaoCard = styled.button`
  background: #fafafa;
  color: #09090b;
  border: none;
  padding: 14px 20px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  margin-top: 16px;
  transition: all 0.2s;

  &:hover {
    background: #e4e4e7;
  }
`;

export const ProximaOS = styled.h2`
  font-size: 3.5rem;
  color: #3b82f6;
  font-weight: 800;
  letter-spacing: -0.05em;
  text-align: center;
  margin: 10px 0;
`;

export const RankingVazio = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3f3f46;
  font-size: 0.8rem;
  border: 1px dashed #1f1f23;
  border-radius: 8px;
`;

/* Botão Hamburguer */

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
export const AlertSection = styled.div`
  margin-bottom: 30px;
  z-index: 10;

  .section-title {
    margin-bottom: 15px;
    display: block;
  }
`;

export const GridAlertas = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
`;

export const AlertaCard = styled.div`
  background: #18181b;
  border: 1px solid #27272a;
  border-left: 4px solid ${(props) => (props.isVencido ? "#ef4444" : "#3b82f6")};
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 15px;
  .status-dia {
    font-size: 12px;
    font-weight: bold;
    color: ${(props) => (props.isVencido ? "#ef4444" : "#f59e0b")};
  }
  .info {
    display: flex;
    gap: 12px;

    .icon-box {
      background: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
      padding: 10px;
      border-radius: 8px;
      height: fit-content;
    }

    h4 {
      font-size: 15px;
      margin-bottom: 4px;
      color: #fafafa;
    }

    p {
      font-size: 12px;
      color: #71717a;
      margin-bottom: 8px;
    }

    .deadline {
      font-size: 11px;
      font-weight: 700;
      color: #f59e0b;
    }
    span {
      display: inline-flex;
      align-items: center;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      margin-top: 8px;

      &.atrasado {
        background: rgba(239, 68, 68, 0.15);
        color: #ef4444;
        border: 1px solid rgba(239, 68, 68, 0.2);
      }

      &.no-prazo {
        background: rgba(34, 197, 94, 0.15);
        color: #22c55e;
        border: 1px solid rgba(34, 197, 94, 0.2);
      }

      &.vence-hoje {
        background: rgba(245, 158, 11, 0.15);
        color: #f59e0b;
        border: 1px solid rgba(245, 158, 11, 0.2);
      }
    }
  }

  .btn-done {
    background: #27272a;
    border: 1px solid #3f3f46;
    color: #fff;
    padding: 10px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: 0.2s;

    &:hover {
      background: #22c55e;
      border-color: #22c55e;
    }
  }
`;
export const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-flex;
  align-items: center;
  gap: 6px;

  /* Lógica de cores baseada no status que passamos na Home */
  background: ${(props) => {
    switch (props.status) {
      case "EM PROCESSO":
        return "rgba(59, 130, 246, 0.15)"; // Azul translúcido
      case "CONCLUÍDO":
        return "rgba(34, 197, 94, 0.15)"; // Verde translúcido
      case "ATRASADO":
        return "rgba(239, 68, 68, 0.15)"; // Vermelho translúcido
      default:
        return "#27272a";
    }
  }};

  color: ${(props) => {
    switch (props.status) {
      case "EM PROCESSO":
        return "#3b82f6";
      case "CONCLUÍDO":
        return "#22c55e";
      case "ATRASADO":
        return "#ef4444";
      default:
        return "#a1a1aa";
    }
  }};

  border: 1px solid
    ${(props) => {
      switch (props.status) {
        case "EM PROCESSO":
          return "rgba(59, 130, 246, 0.3)";
        case "CONCLUÍDO":
          return "rgba(34, 197, 94, 0.3)";
        case "ATRASADO":
          return "rgba(239, 68, 68, 0.3)";
        default:
          return "#3f3f46";
      }
    }};
`;
