import { useEffect, useState } from "react";
import Navbar from "../../Componentes/Navbar.jsx";
import "../../Interface/feed.css";

export default function VagasProjetos() {
  const [user, setUser] = useState(null);
  const [anuncios, setAnuncios] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("certin_user");
    const storedAnuncios = localStorage.getItem("certin_anuncios");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    if (storedAnuncios) {
      setAnuncios(JSON.parse(storedAnuncios));
    }
  }, []);

  return (
    <>
     <Navbar />
    <main className="feed-page">
      <section className="feed-header">
        <h2>Vagas e Projetos</h2>
        <p>Sem vagas por aqui...</p>
      </section>
    </main>
    </>
  );
}
