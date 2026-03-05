import styled from "styled-components";
export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const HomeContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: center;
  gap: 30px;
  width: 100vw;
  min-height: 95vh;
  background-color: #000;
  box-sizing: border-box;
  font-family: "Roboto", sans-serif;
  overflow-y: visible;
  @media (max-width: 1500px) {
    min-height: 100vh;
  }
`;

export const Card = styled.div`
  background: white;
  padding: 2.5rem 2rem;
  border-radius: 16px;
  text-align: center;
  flex: 1 1 350px;
  max-width: 420px;
  min-height: 380px;
  max-height: 380px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-8px);
  }

  h3 {
    color: #333;
    font-size: 1.4rem;
    margin: 0;
    font-weight: 700;
  }

  p {
    color: #666;
    font-size: 1.2rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin: 1rem 0;
  }

  @media (max-width: 768px) {
    min-height: auto;
    width: 100%;
    height: 50vh;
    flex: 1 1 100%;
  }
`;

export const ProximaOS = styled.h2`
  font-size: 4.5rem;
  color: #0073ea;
  margin: 0;
  font-weight: 800;
  line-height: 1;
`;

export const Contador = styled.div`
  font-size: 5rem;
  font-weight: 800;
  line-height: 1;
  color: ${(props) => (props.status === "warning" ? "#fdab3d" : "#00c875")};
  transition: color 0.5s ease;
`;

export const BotaoCard = styled.button`
  background: #0073ea;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  width: ${(props) => props.width || "100%"};
  margin: ${(props) => props.margin || "0"};
  transition: background 0.2s;
  &:hover {
    background: #0056b3;
  }
`;
export const RankingWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  max-height: 200px;
  padding: 5px;
`;
export const RankingVazio = styled.div`
  width: 100%;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 8px;
  color: #999;
  font-style: italic;
  border: 2px dashed #eee;
`;
