import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useAuth } from "./hooks/useAuth"; // Importamos o hook aqui

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import TabelaOS from "./pages/Table/TabelaOS";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// COMPONENTE DE ROTA PRIVADA
// Ele verifica se o usuário está logado. Se não, manda pro /login
const PrivateRoute = ({ children }) => {
  const { signed } = useAuth();
  return signed ? children : <Navigate to="/login" />;
};

function App() {
  // Pegamos as funções de login aqui para passar para a página de Login
  const { login, loadingAuth } = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* ROTA DE LOGIN (Aberta) */}
          <Route
            path="/login"
            element={<Login onLogin={login} isLoading={loadingAuth} />}
          />

          {/* ROTAS PROTEGIDAS (Só entra se estiver logado) */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />

          <Route
            path="/tabela"
            element={
              <PrivateRoute>
                <TabelaOS />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
