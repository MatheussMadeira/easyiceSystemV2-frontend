import React from "react";
import * as S from "./styles";

const LoadingScreen = ({ message = "Sincronizando base de dados..." }) => (
  <div
    style={{
      background: "#09090b",
      height: "100vh",
      width: "100vw",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontFamily: "sans-serif",
      position: "fixed",
      top: 0,
      left: 0,
      zIndex: 9999,
    }}
  >
    <S.Spinner />
    <h2
      style={{
        marginTop: "20px",
        fontSize: "1.2rem",
        fontWeight: "500",
        color: "#a1a1aa",
      }}
    >
      {message}
    </h2>
  </div>
);

export default LoadingScreen;
