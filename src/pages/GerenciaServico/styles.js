import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #09090b;
  padding: 20px;
`;

export const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

export const HeaderPage = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;

  h1 {
    color: #fafafa;
    font-size: 24px;
  }
  p {
    color: #71717a;
    font-size: 14px;
  }

  .btn-novo {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    &:hover {
      background: #2563eb;
    }
  }
`;

export const Section = styled.div`
  margin-bottom: 50px;
  h3 {
    color: #fafafa;
    margin-bottom: 20px;
    font-size: 18px;
    border-left: 4px solid #3b82f6;
    padding-left: 10px;
  }
`;

export const TableContainer = styled.div`
  background: #18181b;
  border: 1px solid #27272a;
  border-radius: 12px;
  overflow: hidden;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;

  thead {
    background: #27272a;
    th {
      padding: 15px;
      color: #a1a1aa;
      font-size: 12px;
      text-transform: uppercase;
    }
  }

  tbody {
    tr {
      border-bottom: 1px solid #27272a;
      &:last-child {
        border: none;
      }
    }
    td {
      padding: 15px;
      color: #fafafa;
      font-size: 14px;
    }
  }

  .btn-edit {
    background: none;
    border: none;
    color: #3b82f6;
    cursor: pointer;
    &:hover {
      color: #60a5fa;
    }
  }
`;

export const UserBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #27272a;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  width: fit-content;
`;

export const StatusLog = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: ${(props) => (props.status === "ATRASADO" ? "#ef4444" : "#22c55e")};
`;
