import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Componentes/Navbar";
import Card from "../Componentes/Card";
import "../Interface/dashboard.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function PaginaPesquisaUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);
  const [certificados, setCertificados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        // PERFIL
        const resUser = await fetch(`${API_URL}/usuarios/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("certin_token")}`,
          },
        });

        if (!resUser.ok) throw new Error("Usuário não encontrado");

        const userData = await resUser.json();
        setUsuario(userData);

        // CERTIFICADOS (rota pública)
        const resCerts = await fetch(
          `${API_URL}/certificados/usuario/${id}
`
        );

        if (resCerts.ok) {
          const certsData = await resCerts.json();
          setCertificados(certsData);
        }
      } catch (err) {
        console.error(err);
        setUsuario(null);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="dashboard-page">
          <p>Carregando perfil...</p>
        </main>
      </>
    );
  }

  if (!usuario) {
    return (
      <>
        <Navbar />
        <main className="dashboard-page">
          <p>Usuário não encontrado.</p>
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

      <main className="dashboard-page">
        {/* PERFIL */}
        <section className="profile">
          <div className="avatar">👤</div>
          <div className="info">
            <h3>{usuario.nome}</h3>
            <p>{usuario.email}</p>
            <p>
              {usuario.curso || "—"} • {usuario.instituicao || ""}
              {usuario.semestre && ` • ${usuario.semestre}º semestre`}
            </p>
          </div>
        </section>

        {/* FORMAÇÕES */}
        <section className="my-certs">
          <h3>Formações</h3>
          <div className="cert-grid">
            {usuario.formacoes?.length === 0 && (
              <p>Nenhuma formação cadastrada.</p>
            )}
            {usuario.formacoes?.map((f, index) => (
              <Card key={index} title={f.curso} subtitle={f.instituicao}>
                <p>{f.ano}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* IDIOMAS */}
        <section className="my-certs">
          <h3>Idiomas</h3>
          <div className="cert-grid">
            {usuario.idiomas?.length === 0 && (
              <p>Nenhum idioma cadastrado.</p>
            )}
            {usuario.idiomas?.map((i, index) => (
              <Card key={index} title={i.idioma} subtitle={i.nivel} />
            ))}
          </div>
        </section>

        {/* CERTIFICADOS */}
        <section className="my-certs">
          <h3>Certificados</h3>
          <div className="cert-grid">
            {certificados.length === 0 && (
              <p>Nenhum certificado cadastrado.</p>
            )}
            {certificados.map((c) => (
              <Card
                key={c.id}
                title={c.titulo || c.nome_certificado}
                subtitle={new Date(c.data_criacao).toLocaleDateString()}
              >
                <p>{c.descricao}</p>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
