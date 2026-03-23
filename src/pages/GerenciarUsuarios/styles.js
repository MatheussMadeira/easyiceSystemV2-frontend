import styled from "styled-components";

export const PaginaContainer = styled.div`
  background-color: #09090b;
  min-height: 100vh;
  width: 100%;
  overflow-y: auto;
  position: relative;
`;

export const HeaderFixo = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #09090b;
  border-bottom: 1px solid #27272a;
  padding: 20px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
  box-sizing: border-box;
`;

export const InputBusca = styled.input`
  background: #18181b;
  border: 1px solid #27272a;
  color: #fff;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
  width: 100%;
  max-width: 400px;

  &:focus {
    border-color: #3b82f6;
  }
`;

export const GridUsuarios = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 30px 40px;
  max-width: 1400px;
  margin: 0 auto;
`;

export const CardUsuario = styled.div`
  background: #18181b;
  border: 1px solid #27272a;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  gap: 15px;

  &:hover {
    transform: translateY(-4px);
    border-color: #3b82f6;
    background: #1c1c21;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
  }
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 18px;
  text-transform: uppercase;
`;

export const Textos = styled.div`
  display: flex;
  flex-direction: column;

  h3 {
    color: #fff;
    margin: 0;
    font-size: 16px;
    font-weight: 600;
  }

  span {
    color: #71717a;
    font-size: 13px;
  }
`;

export const BadgeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const Badge = styled.span`
  font-size: 11px;
  background: #27272a;
  color: #a1a1aa;
  padding: 3px 10px;
  border-radius: 20px;
  border: 1px solid #3f3f46;
  font-weight: 500;
  letter-spacing: 0.5px;
`;

export const BotaoAdicionar = styled.button`
  background: #3b82f6;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: background 0.2s;

  &:hover {
    background: #2563eb;
  }
`;
