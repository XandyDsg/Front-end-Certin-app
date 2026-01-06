import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaBriefcase, FaCertificate, FaFile, FaFileArchive, FaUser } from "react-icons/fa";
import "../Interface/navbar.css";
import CertinLogo from "../assets/Certin.png";

export default function Navbar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );
      const data = await response.json();
      setUsers(data);
    }

    fetchUsers();
  }, []);

  function buscarUsuario(e) {
    e.preventDefault();
    if (!query.trim()) return;

    const user = users.find((u) =>
      u.name.toLowerCase().includes(query.toLowerCase())
    );

    if (user) {
      navigate(`/usuario/${user.id}`);
      setQuery("");
    } else {
      alert("Usuário não encontrado!");
    }
  }

  return (
    <header className="nav-container">
      <nav className="nav-bar">
        {/* Logo */}
        <div className="brand">
          <img src={CertinLogo} alt="Certin" className="brand-logo" />
        </div>

        <div className="nav-right">
          <form onSubmit={buscarUsuario} className="search-bar">
            <input
              type="text"
              placeholder="Buscar usuário..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>

          <div className="nav-links">
          <Link to="/VagasProjetos" className="nav-item">
            <FaBriefcase className="nav-icon" />
            <span>Vagas e Projetos</span>
          </Link>

          <Link to="/feed" className="nav-item">
            <FaFile className="nav-icon" />
            <span>Mural de Certificados</span>
          </Link>

          <Link to="/dashboard" className="nav-item">
            <FaUser className="nav-icon" />
            <span>Perfil</span>
          </Link>
        </div>
        </div>
      </nav>
    </header>
  );
}
