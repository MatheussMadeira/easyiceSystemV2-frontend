import styled from "styled-components";

export const Container = styled.div`
  background-color: #09090b;
  min-height: 100vh;
  color: #fff;
`;

export const Content = styled.div`
  padding: 80px 40px 40px;
  max-width: 900px; /* Aumentado levemente para acomodar melhor a tabela expandida */
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 70px 20px 20px;
  }
`;

export const Header = styled.div`
  margin-bottom: 30px;
  text-align: center;
  h1 {
    font-size: 24px;
    margin-bottom: 5px;
  }
  p {
    color: #71717a;
    font-size: 14px;
  }
`;

export const ProfileCard = styled.div`
  background: #18181b;
  border: 1px solid #27272a;
  border-radius: 16px;
  overflow: hidden;
  padding: 40px;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;

  .avatar-circle {
    width: 80px;
    height: 80px;
    background: #3b82f6;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 15px;
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
  }

  h2 {
    font-size: 20px;
    margin-bottom: 5px;
  }
  span {
    color: #3b82f6;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
  }
`;

export const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-top: 1px solid #27272a;
  padding-top: 30px;
`;

export const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  width: 100%;

  .icon {
    background: #27272a;
    padding: 10px;
    border-radius: 8px;
    color: #a1a1aa;
    flex-shrink: 0;
  }

  div {
    min-width: 0;

    label {
      display: block;
      font-size: 12px;
      color: #71717a;
    }

    p {
      font-size: 15px;
      color: #e4e4e7;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }
  }
`;

export const ActionSection = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: center;

  .btn-password {
    background: transparent;
    border: 1px solid #3f3f46;
    color: #fff;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    transition: 0.2s;
    font-size: 14px;

    &:hover {
      background: #27272a;
      border-color: #52525b;
    }
  }
`;

// --- SEÇÃO DE HISTÓRICO ---

export const HistorySection = styled.div`
  margin-top: 40px;
`;

export const HistoryHeaderGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  flex-wrap: wrap;
  gap: 15px;

  .title-box {
    display: flex;
    align-items: center;
    gap: 10px;
    h3 {
      font-size: 18px;
      color: #fafafa;
    }
  }

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${(props) =>
    props.$active ? "rgba(59, 130, 246, 0.2)" : "#18181b"};
  border: 1px solid ${(props) => (props.$active ? "#3b82f6" : "#27272a")};
  color: ${(props) => (props.$active ? "#3b82f6" : "#fff")};
  padding: 0 15px;
  border-radius: 8px;
  cursor: pointer;
  height: 40px;
  font-size: 13px;
  font-weight: 500;
  transition: 0.2s;

  &:hover {
    border-color: #3b82f6;
    background: rgba(59, 130, 246, 0.1);
  }
`;

export const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background: #09090b;
  border: 1px solid #27272a;
  border-radius: 8px;
  padding: 0 12px;
  flex: 1;
  min-width: 200px;
  height: 40px;
  transition: 0.2s;

  &:focus-within {
    border-color: #3b82f6;
  }

  .search-icon {
    color: #71717a;
    margin-right: 10px;
  }
  .clear-icon {
    color: #71717a;
    cursor: pointer;
    margin-left: 10px;
    &:hover {
      color: #ef4444;
    }
  }

  input {
    background: none;
    border: none;
    color: #fafafa;
    font-size: 14px;
    width: 100%;
    outline: none;
    &::placeholder {
      color: #3f3f46;
    }
  }
`;

// --- TABELA ---

export const DesktopTableWrapper = styled.div`
  background: #18181b;
  border: 1px solid #27272a;
  border-radius: 16px;
  overflow: hidden;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;

  th {
    text-align: left;
    padding: 16px;
    color: #71717a;
    font-size: 11px;
    text-transform: uppercase;
    background: rgba(39, 39, 42, 0.3);
  }

  td {
    padding: 16px;
    border-top: 1px solid #27272a;
    color: #e4e4e7;

    .os-number {
      font-weight: 800;
      color: #3b82f6;
    }
    .equip-info {
      display: flex;
      flex-direction: column;
      strong {
        font-size: 13px;
        color: #fff;
      }
      span {
        font-size: 11px;
        color: #71717a;
      }
    }
  }

  tr:hover {
    background: rgba(39, 39, 42, 0.2);
  }
`;

export const StatusBadge = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  background: ${(props) => {
    const s = props.status?.toUpperCase();
    if (s === "CONCLUÍDO") return "rgba(34, 197, 94, 0.1)";
    if (s === "EM PROCESSO") return "rgba(59, 130, 246, 0.1)";
    return "rgba(239, 68, 68, 0.1)";
  }};
  color: ${(props) => {
    const s = props.status?.toUpperCase();
    if (s === "CONCLUÍDO") return "#22c55e";
    if (s === "EM PROCESSO") return "#3b82f6";
    return "#ef4444";
  }};
`;

export const RoleBadge = styled.span`
  padding: 3px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  background: ${(props) =>
    props.isExecutor ? "rgba(59, 130, 246, 0.1)" : "rgba(168, 85, 247, 0.1)"};
  color: ${(props) => (props.isExecutor ? "#3b82f6" : "#a855f7")};
  border: 1px solid currentColor;
`;

export const DateInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 11px;
  .open {
    color: #71717a;
  }
  .close {
    color: #22c55e;
    font-weight: 600;
  }
`;

export const ViewPhotoButton = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  background: #27272a;
  border: 1px solid #3f3f46;
  color: #fff;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 11px;
  cursor: pointer;
  &:hover {
    background: #3b82f6;
    border-color: #3b82f6;
  }
`;

// --- MOBILE CARDS ---

export const MobileCardsWrapper = styled.div`
  display: none;
  flex-direction: column;
  gap: 12px;
  @media (max-width: 768px) {
    display: flex;
  }
`;

export const HistoryCard = styled.div`
  background: #18181b;
  border: 1px solid #27272a;
  border-radius: 12px;
  padding: 16px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    border-bottom: 1px solid #27272a;
    padding-bottom: 10px;

    .os-number {
      font-weight: 800;
      color: #3b82f6;
      font-size: 15px;
    }
  }

  .card-content {
    display: flex;
    flex-direction: column;
    gap: 8px; 

    p {
      font-size: 13px;
      margin: 0;
      color: #e4e4e7;
      display: flex;
      justify-content: space-between; 

      strong {
        color: #71717a;
        font-weight: 500;
      }
    }
  }

  .card-dates {
    display: flex;
    flex-direction: column; 
    gap: 4px;
    margin-top: 12px;
    padding-top: 10px;
    border-top: 1px dotted #27272a;
    font-size: 11px;
    color: #71717a;

    .success {
      color: #22c55e;
      font-weight: 600;
    }
  }

  .card-footer {
    margin-top: 15px;
    display: flex;
    justify-content: stretch; 

    button {
      width: 100%;
      justify-content: center;
    }
  }
`;

export const EmptyHistory = styled.div`
  text-align: center;
  padding: 40px;
  background: #18181b;
  border: 1px dotted #27272a;
  border-radius: 16px;
  color: #71717a;
  font-size: 14px;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

export const ModalContent = styled.div`
  background: #18181b;
  border: 1px solid #27272a;
  padding: 25px;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;

  .modal-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    button {
      background: none;
      border: none;
      color: #71717a;
      cursor: pointer;
    }
  }

  .modal-body {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .input-group {
    background: #09090b;
    border: 1px solid #27272a;
    border-radius: 8px;
    padding: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    input {
      background: none;
      border: none;
      color: #fff;
      width: 100%;
      outline: none;
    }
  }
  .eye-btn {
    background: none;
    border: none;
    color: #71717a;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 0 5px;
    transition: color 0.2s;

    &:hover {
      color: #3b82f6;
    }
  }
  .btn-save {
    width: 100%;
    background: #3b82f6;
    color: #fff;
    border: none;
    padding: 12px;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    &:hover:not(:disabled) {
      background: #2563eb;
    }
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;
