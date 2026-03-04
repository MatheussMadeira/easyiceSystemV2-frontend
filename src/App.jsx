import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import TabelaOS from "./pages/Table/TabelaOS";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/tabela" element={<TabelaOS />} />

        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
