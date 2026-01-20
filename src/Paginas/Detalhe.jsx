import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Componentes/Navbar";
import "../Interface/detalhe.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function Detalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCertificado() {
      try {
        const res = await fetch(`${API_URL}/certificados/${id}`);
        if (!res.ok) throw new Error("Certificado não encontrado");

        const data = await res.json();
        setItem(data);
      } catch (err) {
        console.error(err);
        setItem(null);
      } finally {
        setLoading(false);
      }
    }

    loadCertificado();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="detalhe-page">
          <p>Carregando certificado...</p>
        </main>
      </>
    );
  }

  if (!item) {
    return (
      <>
        <Navbar />
        <main className="detalhe-page">
          <p>Certificado não encontrado.</p>
          <button className="btn" onClick={() => navigate(-1)}>
            Voltar
          </button>
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

          <p className="meta">
            Criado em{" "}
            {new Date(item.created_at).toLocaleDateString()}
          </p>

          <div className="detalhe-body">
            <p>{item.descricao || "Sem descrição."}</p>

            {item.keywords?.length > 0 && (
              <div className="tags">
                {item.keywords.map((t, i) => (
                  <span key={i} className="tag">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="detalhe-actions">
            <button className="btn" onClick={() => navigate(-1)}>
              Voltar
            </button>
          </div>
        </article>
      </main>
    </>
  );
}
