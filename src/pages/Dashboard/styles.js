import styled from "styled-components";

export const Container = styled.div`
  background-color: #09090b;
  min-height: 100vh;
  color: #fff;
`;

export const Content = styled.div`
  padding: 80px 40px 40px;
  max-width: 90%;
  margin: 0 auto;
`;

export const Header = styled.div`
  margin-bottom: 30px;
  h1 {
    font-size: 24px;
    margin-bottom: 5px;
  }
  p {
    color: #71717a;
    font-size: 14px;
  }
`;

export const GridCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

export const Card = styled.div`
  background: #18181b;
  border: 1px solid #27272a;
  padding: 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 15px;

  .icon {
    background: ${(props) => props.color || "#3f3f46"}20;
    color: ${(props) => props.color || "#3f3f46"};
    padding: 10px;
    border-radius: 8px;
  }

  span {
    color: #71717a;
    font-size: 13px;
  }
  h3 {
    font-size: 22px;
    margin-top: 4px;
  }
`;

export const GridCharts = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

// No seu styles.js

export const GridChartsMetade = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 20px;
  align-items: stretch;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const ColunaDireitaEmpilhada = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
`;

export const ChartBoxDouble = styled.div`
  background: #18181b;
  border: 1px solid #27272a;
  padding: 20px;
  border-radius: 12px;
  flex: 1;
  display: flex;
  flex-direction: column;

  h3 {
    font-size: 16px;
    margin-bottom: 15px;
    color: #a1a1aa;
    font-weight: 600;
  }
`;

export const ChartBox = styled.div`
  background: #18181b;
  border: 1px solid #27272a;
  padding: 20px;
  border-radius: 12px;
  min-height: 420px;

  h3 {
    font-size: 16px;
    margin-bottom: 20px;
    color: #a1a1aa;
    font-weight: 600;
  }
`;

export const Loading = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #09090b;
  color: #fff;
`;
export const PriorityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const PriorityItem = styled.div`
  .info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
    font-size: 13px;
    color: #a1a1aa;
  }
`;

export const ProgressBar = styled.div`
  height: 8px;
  background: #27272a;
  border-radius: 4px;
  overflow: hidden;
  .fill {
    height: 100%;
    transition: width 0.5s ease;
  }
`;

export const ExecutorTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  th {
    text-align: left;
    color: #71717a;
    font-size: 12px;
    padding-bottom: 10px;
    border-bottom: 1px solid #27272a;
  }
  td {
    padding: 12px 0;
    border-bottom: 1px solid #27272a;
    font-size: 14px;
  }
  tr:last-child td {
    border-bottom: none;
  }
`;
