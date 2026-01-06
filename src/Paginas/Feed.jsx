import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Componentes/Navbar";
import Card from "../Componentes/Card";
import "../Interface/feed.css";
import { mockCertificados } from "../Database/mockCertificados.js";

const STORAGE_KEY = "certin_feed";

export default function Feed() {
  const [certificados, setCertificados] = useState([]);

  // --- carregar feed ---
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      setCertificados(JSON.parse(stored));
    } else {
      setCertificados(mockCertificados);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockCertificados));
    }
  }, []);

  return (
    <>
      <Navbar />

      <main className="feed-page">
        <header className="feed-header">
          <h2>Painel de Certificados</h2>
        </header>

        <section className="feed-section">
          {certificados.length === 0 && (
            <p className="empty-state">
              Nenhum certificado disponível no momento.
            </p>
          )}

          <div className="feed-grid">
            {certificados.map((c) => (
              <Card
                key={c.id}
                title={c.titulo}
                subtitle={`${c.usuario} • ${c.data}`}
              >
                <p className="card-desc">{c.descricao}</p>

                <div className="card-actions">
                  <Link
                    to={`/item/${c.id}`}
                    className="btn small"
                  >
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
