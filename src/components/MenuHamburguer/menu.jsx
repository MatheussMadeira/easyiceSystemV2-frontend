import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../services/AuthProvider";
import * as H from "./menu";

export default function MenuGlobal() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useAuth();

  const [menuAberto, setMenuAberto] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const handleNavigation = (path) => {
    if (location.pathname === path) {
      setMenuAberto(false);
      return;
    }
    setIsNavigating(true);
    setMenuAberto(false);
    setTimeout(() => {
      navigate(path);
      setIsNavigating(false);
    }, 400);
  };

  return (
    <>
      {isNavigating && (
        <H.TransitionOverlay>
          <H.Spinner />
          <h2>Carregando...</h2>
        </H.TransitionOverlay>
      )}

      <H.MenuToggle onClick={() => setMenuAberto(!menuAberto)}>
        {menuAberto ? "✕" : "☰"}
      </H.MenuToggle>

      <H.MenuOverlay
        $isOpen={menuAberto}
        onClick={() => setMenuAberto(false)}
      />

      <H.Sidebar $isOpen={menuAberto}>
        <H.MenuItem
          $active={location.pathname === "/"}
          onClick={() => handleNavigation("/")}
        >
          🗂️ Painel
        </H.MenuItem>

        {user?.funcoes?.includes("ADMIN") && (
          <H.MenuItem
            $active={location.pathname === "/tabela"}
            onClick={() => handleNavigation("/tabela")}
          >
            📊 Tabela
          </H.MenuItem>
        )}

        {user?.funcoes?.includes("ADMIN") && (
          <H.MenuItem
            $active={location.pathname === "/dashboard"}
            onClick={() => handleNavigation("/dashboard")}
          >
            📈 Dashboard
          </H.MenuItem>
        )}
        {user?.funcoes?.includes("ADMIN") && (
          <H.MenuItem onClick={() => navigate("/usuarios")}>
            <span>👥</span> Gerenciar Usuários
          </H.MenuItem>
        )}
        <H.MenuItem
          $active={location.pathname === "/perfil"}
          onClick={() => handleNavigation("/perfil")}
        >
          👤 Meu Perfil
        </H.MenuItem>

        <div
          style={{
            marginTop: "auto",
            marginBottom: "50%",
            borderTop: "1px solid #1f1f23",
            paddingTop: "15px",
          }}
        >
          <p
            style={{ color: "#71717a", fontSize: "11px", marginBottom: "8px" }}
          >
            LOGADO: <strong style={{ color: "#fff" }}>{user?.nome}</strong>
          </p>

          <H.MenuItem onClick={logout} style={{ color: "#ef4444" }}>
            ➜ Logout
          </H.MenuItem>
        </div>
      </H.Sidebar>
    </>
  );
}
