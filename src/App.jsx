import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useAuth } from "./hooks/useAuth";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import TabelaOS from "./pages/Table/TabelaOS";
import Dashboard from "./pages/Dashboard/Dashboard";
import Perfil from "./pages/Perfil/Perfil";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const PrivateRoute = ({ children }) => {
  const { signed } = useAuth();
  return signed ? children : <Navigate to="/login" />;
};

function App() {
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

          {/* ROTAS PROTEGIDAS */}
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
          {/* NOVA ROTA DE DASHBOARD */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
