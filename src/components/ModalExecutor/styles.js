import styled from "styled-components";

// 1. Overlay e Containers principais
export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  backdrop-filter: blur(4px);
  padding: 20px;
`;

export const ModalContainer = styled.div`
  background: #09090b;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  border-radius: 12px;
  border: 1px solid #27272a;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
`;

export const ModalHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #27272a;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    color: #fafafa;
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0;
  }

  .close-btn {
    background: none;
    border: none;
    color: #a1a1aa;
    font-size: 28px;
    cursor: pointer;
    line-height: 1;
    &:hover {
      color: #fff;
    }
  }
`;

export const ModalBody = styled.div`
  padding: 20px;
  overflow-y: auto;
  flex: 1;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #27272a;
    border-radius: 10px;
  }
`;

export const ModalFooter = styled.div`
  padding: 15px 20px;
  border-top: 1px solid #27272a;
  display: flex;
  justify-content: flex-end;
`;

// 2. Elementos do Card
export const CardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const OSCard = styled.div`
  background: #121214;
  border: 1px solid #27272a;
  border-radius: 12px;
  padding: 20px;
  overflow: hidden;
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #27272a;

  .header-left {
    display: flex;
    align-items: center;
    gap: 15px;
  }
  .numero {
    font-size: 18px;
    font-weight: 800;
    color: #3b82f6;
  }
`;

export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

// 3. Badges e Indicadores
export const Badge = styled.span`
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  background: ${(props) =>
    props.status === "ABERTO" || props.status === "EM ABERTO"
      ? "rgba(239, 68, 68, 0.1)"
      : props.status === "EM PROCESSO"
      ? "rgba(59, 130, 246, 0.1)"
      : "rgba(34, 197, 94, 0.1)"};
  color: ${(props) =>
    props.status === "ABERTO" || props.status === "EM ABERTO"
      ? "#ef4444"
      : props.status === "EM PROCESSO"
      ? "#3b82f6"
      : "#22c55e"};
  border: 1px solid currentColor;
`;

export const PrioridadeBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 600;
  color: #a1a1aa;
  text-transform: uppercase;

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${(props) => {
      const p = props.prioridade?.toUpperCase() || "";
      if (p.includes("ALTA")) return "#ef4444";
      if (p.includes("MÉDIA")) return "#f97316";
      return "#22c55e";
    }};
  }
`;

// 4. Seção de Informações (Grid)
export const InfoGridPrincipal = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 5px;

  @media (min-width: 600px) {
    grid-template-columns: repeat(4, 1fr);
  }

  .info-item {
    label {
      display: block;
      font-size: 10px;
      font-weight: 700;
      color: #a1a1ad;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    p {
      font-size: 13px;
      color: #fafafa;
      margin: 0;
      font-weight: 500;
    }
  }
`;

export const DescricaoWrapper = styled.div`
  background: #09090b;
  border-radius: 8px;
  padding: 15px;
  border: 1px solid #27272a;
  margin-top: 10px;

  .item {
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .top-border {
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px dashed #27272a;
  }
  .texto {
    font-size: 13px;
    color: #d4d4d8;
    line-height: 1.5;
    margin: 5px 0 0 0;
  }
`;

export const LabelDescricao = styled.label`
  display: block;
  font-size: 11px;
  font-weight: 700;
  color: #3b82f6;
  text-transform: uppercase;
  margin-bottom: 4px;
`;

// 5. Seção Financeira
export const FinanceiroWrapper = styled.div`
  margin-top: 10px;
  h3 {
    font-size: 13px;
    color: #fafafa;
    margin-bottom: 10px;
    font-weight: 600;
  }
`;

export const FinanceiroHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const FinanceiroBox = styled.div`
  background: rgba(34, 197, 94, 0.05);
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: 8px;
  padding: 15px;
`;

export const FinanceiroRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  .label {
    color: #a1a1aa;
  }
  .valor-texto {
    color: #fafafa;
    font-weight: 600;
  }
`;

export const DividerFinanceiro = styled.div`
  height: 1px;
  background: #27272a;
  margin: 10px 0;
`;

export const FinanceiroGridValores = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

export const ValorItem = styled.div`
  .sub-label {
    display: block;
    font-size: 10px;
    color: #71717a;
    text-transform: uppercase;
    margin-bottom: 2px;
  }
  .preco {
    font-size: 15px;
    font-weight: 700;
    color: #22c55e;
  }
`;

export const CardActionWrapper = styled.div`
  margin-top: 10px;
`;
export const DividerAction = styled.div`
  height: 1px;
  background: #27272a;
  margin-bottom: 15px;
`;

export const BotaoAcaoCard = styled.button`
  width: 100%;
  padding: 14px;
  background: ${(props) => props.cor || "#3b82f6"};
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    filter: brightness(1.2);
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(0);
  }
`;

export const BotaoFechar = styled.button`
  background: #27272a;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
  &:hover {
    background: #3f3f46;
  }
`;

export const AvisoVazio = styled.div`
  text-align: center;
  color: #71717a;
  padding: 40px;
  font-style: italic;
  font-size: 14px;
`;
export const AvisoAguardando = styled.div`
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px dashed #27272a;
  text-align: center;

  small {
    color: #71717a;
    font-style: italic;
    font-size: 11px;
  }
`;
export const BotaoWhatsAppContainer = styled.button`
  width: 30%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px;
  background: rgba(37, 211, 102, 0.1);
  border: 1px solid rgba(37, 211, 102, 0.2);
  border-radius: 10px;
  color: #25d366;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  margin: 5px 0 20px 0;
  @media (max-width: 768px) {
    width: 250px;
  }
  svg {
    flex-shrink: 0;
  }
  &:hover {
    background: rgba(37, 211, 102, 0.15);
    border-color: #25d366;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(37, 211, 102, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
`;
