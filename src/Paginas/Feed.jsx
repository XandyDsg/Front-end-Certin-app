import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Componentes/Navbar";
import Card from "../Componentes/Card";
import "../Interface/feed.css";
import { apiFetch } from "../services/api";
import CertinLogo from "../assets/Certin.png";

export default function Feed() {
  const [certificados, setCertificados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeed() {
      try {
        const data = await apiFetch("/certificados/me");
        setCertificados(data);
      } catch (err) {
        console.error(err);
        alert("Erro ao carregar certificados");
      } finally {
        setLoading(false);
      }
    }

    loadFeed();
  }, []);

  return (
    <>
      <Navbar />

      <main className="feed-page">
        <header className="feed-header">
          <h2>Painel de Certificados</h2>
        </header>

        <section className="feed-section">
          {loading && <img src={CertinLogo} alt="Certin" className="brand-carregar" />}

          {!loading && certificados.length === 0 && (
            <p className="empty-state">
              Nenhum certificado disponível no momento.
            </p>
          )}

          <div className="feed-grid">
            {certificados.map((c) => (
              <Card
                key={c.id}
                title={c.titulo}
                subtitle={`${c.usuario?.nome || "Usuário"} • ${new Date(
                  c.created_at
                ).toLocaleDateString()}`}
              >
                <p className="card-desc">{c.descricao}</p>

                <div className="card-actions">
                  <Link to={`/item/${c.id}`} className="btn small">
                    Ver detalhes
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
