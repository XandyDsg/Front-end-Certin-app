import { Routes, Route, Navigate } from "react-router-dom";
import Login from './Login'
import Feed from "./Feed";
import Detalhe from "./Detalhe";
import Dashboard from "./Dashboard";
import Perfil_professor from "./Professor/Perfil_professor.jsx";
import VagasProjetos from "./Professor/VagasProjetos.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/feed" element={<Feed />} />
      <Route path="/item/:id" element={<Detalhe />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="Login" element={<Login />} />
      <Route path="/Perfil_professor" element={<Perfil_professor />} />
      <Route path="/VagasProjetos" element={<VagasProjetos />} />
      
    </Routes>
  );
}
