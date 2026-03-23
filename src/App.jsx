import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useAuth } from "./services/AuthProvider";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";
// Importação das Páginas
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import TabelaOS from "./pages/Table/TabelaOS";
import Dashboard from "./pages/Dashboard/Dashboard";
import Perfil from "./pages/Perfil/Perfil";
import Logs from "./pages/Logs/Logs";
import GerenciarUsuarios from "./pages/GerenciarUsuarios/GerenciarUsuarios";
import GerenciaServicos from "./pages/GerenciaServico/GerenciaServico";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: 1 },
  },
});

// Componente de Rota Privada
const PrivateRoute = ({ children, adminOnly = false }) => {
  const { signed, loadingAuth, user } = useAuth();

  if (loadingAuth) return null; // Evita flicker de redirecionamento

  if (!signed) return <Navigate to="/login" />;

  if (adminOnly && !user?.funcoes?.includes("ADMIN")) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  const { loadingAuth, signed } = useAuth();

  if (loadingAuth) {
    return <LoadingScreen message="Iniciando sessão..." />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={signed ? <Navigate to="/" /> : <Login />}
          />

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
          <Route
            path="/perfil"
            element={
              <PrivateRoute>
                <Perfil />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/logs"
            element={
              <PrivateRoute>
                <Logs />
              </PrivateRoute>
            }
          />
          <Route
            path="/usuarios"
            element={
              <PrivateRoute adminOnly={true}>
                <GerenciarUsuarios />
              </PrivateRoute>
            }
          />
          <Route
            path="/servico"
            element={
              <PrivateRoute>
                <GerenciaServicos />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to={signed ? "/" : "/login"} />} />
        </Routes>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
