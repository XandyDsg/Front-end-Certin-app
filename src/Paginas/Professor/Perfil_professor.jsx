import { useEffect, useState } from "react";
import Navbar from "../../Componentes/Navbar.jsx";
import "../../Interface/dashboard.css";

export default function PerfilProfessor() {
  const [user, setUser] = useState(null);
  const [anuncios, setAnuncios] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tipo, setTipo] = useState("projeto");

  useEffect(() => {
  async function carregarProfessor() {
    try {
      const res = await fetch("/usuarios/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("certin_token")}`,
        },
      });

      if (!res.ok) throw new Error("Não autorizado");

      const data = await res.json();

      if (data.tipo !== "professor") {
        throw new Error("Usuário não é professor");
      }

      setUser(data);
    } catch (err) {
      console.error(err);
      setUser(null);
    }
  }

  carregarProfessor();

  const storedAnuncios =
    JSON.parse(localStorage.getItem("certin_anuncios")) || [];
  setAnuncios(storedAnuncios);
}, []);


  return (
    <>
      <Navbar />

      <main className="dashboard-page">
        {/* PERFIL */}
        <section className="profile">
          <div className="avatar">👨‍🏫</div>
          <div className="info">
            <h3>{user.nome}</h3>
            <p>{user.email}</p>
            <span className="tag">Professor</span>
          </div>
        </section>

        {/* ANÚNCIOS */}
        <section className="my-certs">
          <h3>Projetos e Bolsas</h3>

          <form onSubmit={criarAnuncio} className="profile-edit-form">
            <label className="form-field">
              <span className="field-label">Título</span>
              <input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex: Projeto de Iniciação Científica"
              />
            </label>

            <label className="form-field">
              <span className="field-label">Descrição</span>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva o projeto ou bolsa"
              />
            </label>

            <label className="form-field">
              <span className="field-label">Tipo</span>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
              >
                <option value="projeto">Projeto</option>
                <option value="bolsa">Bolsa</option>
              </select>
            </label>

            <button className="btn" type="submit">
              Publicar anúncio
            </button>
          </form>

          <div className="cert-grid">
            {anuncios.length === 0 && (
              <p>Você ainda não publicou anúncios.</p>
            )}

            {anuncios.map((a) => (
              <div key={a.id} className="card">
                <h4>{a.titulo}</h4>
                <small>
                  {a.tipo.toUpperCase()} • {a.data}
                </small>
                <p>{a.descricao}</p>

                <a
                  href={`mailto:${a.email}`}
                  className="btn ghost"
                >
                  Contato: {a.email}
                </a>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
