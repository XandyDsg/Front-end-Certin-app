import { Routes, Route, Navigate } from "react-router-dom";
import Login from './Login'
import Feed from "./Feed";
import Detalhe from "./Detalhe";
import Dashboard from "./Dashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/feed" element={<Feed />} />
      <Route path="/item/:id" element={<Detalhe />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
