import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Componentes/Navbar";
import "../Interface/detalhe.css";

export default function Detalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);

  useEffect(() => {
    const feed = JSON.parse(localStorage.getItem("certin_feed") || "[]");
    const found = feed.find((f) => String(f.id) === String(id));
    setItem(found || null);
  }, [id]);

  if (!item) {
    return (
      <>
        <Navbar />
        <main className="detalhe-page">
          <p>Certificado não encontrado.</p>
          <button className="btn" onClick={() => navigate(-1)}>Voltar</button>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="detalhe-page">
        <article className="detalhe-card">
          <h2>{item.titulo}</h2>
          <p className="meta">{item.usuario} • {item.data}</p>
          <div className="detalhe-body">
            <p>{item.descricao}</p>
            <div className="tags">
              {item.tags?.map((t, i) => <span key={i} className="tag">{t}</span>)}
            </div>
          </div>
          <div className="detalhe-actions">
            <button className="btn" onClick={() => navigate(-1)}>Voltar</button>
          </div>
        </article>
      </main>
    </>
  );
}
