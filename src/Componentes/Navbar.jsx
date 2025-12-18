import { Link, useNavigate } from "react-router-dom";
import "../Interface/navbar.css";
import { useState, useEffect } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Simula chamada à API para buscar usuários
    async function fetchUsers() {
      const response = await fetch("https://jsonplaceholder.typicode.com/users");
      const data = await response.json();
      setUsers(data);
    }

    fetchUsers();
  }, []);

  function buscarUsuario(e) {
    e.preventDefault();
    if (!query.trim()) return;

    // Busca nos usuários da API
    const user = users.find((user) =>
      user.name.toLowerCase().includes(query.toLowerCase())
    );

    if (user) {
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
