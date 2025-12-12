import { Link, useNavigate } from "react-router-dom";
import "../Interface/navbar.css";
import { useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  function buscarUsuario(e) {
    e.preventDefault();
    if (!query.trim()) return;

    // busca no localStorage (somente 1 user por enquanto)
    const user = JSON.parse(localStorage.getItem("certin_user") || "null");

    if (user && user.nome.toLowerCase().includes(query.toLowerCase())) {
      navigate(`/usuario/${user.id}`);
    } else {
      alert("Usuário não encontrado!");
    }
  }

  return (
    <header className="nav-container">
      <nav className="nav-bar">
        <div className="brand">Certin</div>

        <form onSubmit={buscarUsuario} className="search-bar">
          <input
            type="text"
            placeholder="Buscar usuário..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>

        <div className="nav-links">
          <Link to="/feed">Painel Geral</Link>
          <Link to="/dashboard">Meu Perfil</Link>
        </div>
      </nav>
    </header>
  );
}
