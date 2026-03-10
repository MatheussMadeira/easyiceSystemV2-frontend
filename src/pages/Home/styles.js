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
  margin-top: 16px; /* Espaço entre o título/legenda e o início da lista */
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

  /* Restaura as cores originais dos títulos */
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
    color: #71717a;
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0;
    text-align: left;
  }

  /* ESTE É O SEGREDO: Seletor para o conteúdo do meio de cada card */
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
