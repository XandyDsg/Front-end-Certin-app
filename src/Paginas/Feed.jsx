import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Componentes/Navbar";
import Card from "../Componentes/Card";
import "../Interface/feed.css";
import { mockCertificados } from "../Database/mockCertificados.js";

export default function Feed() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // carrega mock (poderia vir de fetch em real app)
    const stored = localStorage.getItem("certin_feed");
    if (stored) setItems(JSON.parse(stored));
    else {
      setItems(mockCertificados);
      localStorage.setItem("certin_feed", JSON.stringify(mockCertificados));
    }
  }, []);

  return (
    <>
      <Navbar />
      <main className="feed-page">
        <h2>Painel de Certificados</h2>
        <section className="feed-grid">
          {items.map((c) => (
            <Card key={c.id} title={c.titulo} subtitle={`${c.usuario} • ${c.data}`}>
              <p className="card-desc">{c.descricao}</p>
              <div className="card-actions">
                <Link to={`/item/${c.id}`} className="btn small">Ver detalhes</Link>
              </div>
            </Card>
          ))}
        </section>
      </main>
    </>
  );
}
