import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaBriefcase, FaFile, FaUser, FaSearch } from "react-icons/fa";
import "../Interface/navbar.css";
import CertinLogo from "../assets/Certin.png";

export default function Navbar() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState([]);
  const [showResults, setShowResults] = useState(false);

 const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (query.length < 2) {
      setResultados([]);
      setShowResults(false);
      return;
    }

    const controller = new AbortController();

    async function buscar() {
      try {
        const res = await fetch(
          `${API_URL}/usuarios/buscar?q=${encodeURIComponent(query)}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("certin_token")}`,
            },
            signal: controller.signal,
          }
        );

        if (!res.ok) return;

        const data = await res.json();
        setResultados(data);
        setShowResults(true);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
        }
      }
    }

    buscar();

    return () => controller.abort();
  }, [query]);

  return (
    <header className="nav-container">
      <nav className="nav-bar">
        <div className="brand">
          <img src={CertinLogo} alt="Certin" className="brand-logo" />
        </div>

        <div className="nav-right">
          <div className="search-wrapper">
            <form className="search-bar" onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                placeholder="Buscar usuário..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setShowResults(true)}
              />

            </form>

            {showResults && resultados.length > 0 && (
              <ul className="search-results">
                {resultados.length === 0 && (
                  <li className="search-empty">
                    Nenhum usuário encontrado
                  </li>
                )}

                {resultados.map((u) => (
                  <li
                    key={u.id}
                    onClick={() => {
                      navigate(`/usuario/${u.id}`);
                      setQuery("");
                      setShowResults(false);
                    }}
                  >
                    <strong>{u.nome}</strong>
                    <span>
                      {u.curso || "—"} • {u.instituicao || " "}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

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
