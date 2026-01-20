import { useEffect, useState } from "react";
import Navbar from "../Componentes/Navbar";
import Card from "../Componentes/Card";
import Modal from "../Componentes/Modal";
import Input from "../Componentes/Input";
import "../Interface/dashboard.css";

const API_URL = "http://localhost:8000";

/* -------- API helper -------- */
async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("certin_token");

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  if (res.status === 401) {
    localStorage.removeItem("certin_token");
    window.location.href = "/";
    return;
  }

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Erro na requisição");
  }

  return res.json();
}

export default function Dashboard() {
  /* -------- estados principais -------- */
  const [user, setUser] = useState(null);
  const [certificados, setCertificados] = useState([]);
  const [activeTab, setActiveTab] = useState("perfil");
  const [showModal, setShowModal] = useState(false);

  /* -------- edição perfil -------- */
  const [editandoPerfil, setEditandoPerfil] = useState(false);
  const [descricao, setDescricao] = useState("");
  const [curso, setCurso] = useState("");
  const [instituicao, setInstituicao] = useState("");
  const [semestre, setSemestre] = useState("");

  /* -------- certificados -------- */
  const [titulo, setTitulo] = useState("");
  const [certDescricao, setCertDescricao] = useState("");
  const [keywords, setKeywords] = useState("");

  /* -------- formações -------- */
  const [formacoes, setFormacoes] = useState([]);
  const [formCurso, setFormCurso] = useState("");
  const [formInst, setFormInst] = useState("");
  const [formAno, setFormAno] = useState("");

  /* -------- idiomas -------- */
  const [idiomas, setIdiomas] = useState([]);
  const [idiomaNome, setIdiomaNome] = useState("");
  const [idiomaNivel, setIdiomaNivel] = useState("Básico");


  /* -------- load inicial -------- */
  useEffect(() => {
    async function load() {
      const me = await apiFetch("/usuarios/me");
      setUser(me);

      setDescricao(me.descricao || "");
      setCurso(me.curso || "");
      setInstituicao(me.instituicao || "");
      setSemestre(me.semestre || "");

      const meusCerts = await apiFetch("/certificados/me");
      setCertificados(meusCerts);

      const minhasFormacoes = await apiFetch("/usuarios/me/formacoes");
      setFormacoes(minhasFormacoes);

      const meusIdiomas = await apiFetch("/usuarios/me/idiomas");
      setIdiomas(meusIdiomas);
    }

    load();
  }, []);

  /* -------- perfil -------- */
  async function salvarPerfil(e) {
    e.preventDefault();

    const atualizado = await apiFetch("/usuarios/me", {
      method: "PUT",
      body: JSON.stringify({
        descricao,
        curso,
        instituicao,
        semestre,
        formacoes,
        idiomas,
      }),
    });

    setUser(atualizado);
    setFormacoes(atualizado.formacoes || []);
    setIdiomas(atualizado.idiomas || []);
    setEditandoPerfil(false);
  }

  /* -------- certificados -------- */
  async function adicionarCertificado(e) {
    e.preventDefault();

    const novo = await apiFetch("/certificados/criar/me", {
      method: "POST",
      body: JSON.stringify({
        titulo,
        descricao,
        keywords: keywords.split(",").map(k => k.trim()).filter(Boolean),
        data_criacao: new Date().toISOString(),
      }),
    });

    setCertificados(prev => [novo, ...prev]);
    setShowModal(false);
    setTitulo("");
    setCertDescricao("");
    setKeywords("");
  }

  async function deletarCertificado(id) {
    if (!confirm("A ação não pode ser desfeita. Deseja mesmo remover o certificado?")) return;
    await apiFetch(`/certificados/${id}`, { method: "DELETE" });
    setCertificados(prev => prev.filter(c => c.id !== id));
  }

  async function adicionarFormacao(e) {
    e.preventDefault();

    const updated = [
      { curso: formCurso, instituicao: formInst, ano: formAno },
      ...formacoes,
    ];

    const atualizado = await apiFetch("/usuarios/me", {
      method: "PUT",
      body: JSON.stringify({ formacoes: updated }),
    });

    setFormacoes(atualizado.formacoes);
    setFormCurso("");
    setFormInst("");
    setFormAno("");
  }

  async function deletarFormacao(index) {
    if (!confirm("Deseja realmente remover a formação?")) return;

    const updated = formacoes.filter((_, i) => i !== index);

    const atualizado = await apiFetch("/usuarios/me", {
      method: "PUT",
      body: JSON.stringify({
        formacoes: updated,
      }),
    });

    setFormacoes(atualizado.formacoes || []);
  }

  async function adicionarIdioma(e) {
    e.preventDefault();

    const updated = [
      { idioma: idiomaNome, nivel: idiomaNivel },
      ...idiomas,
    ];

    const atualizado = await apiFetch("/usuarios/me", {
      method: "PUT",
      body: JSON.stringify({ idiomas: updated }),
    });

    setIdiomas(atualizado.idiomas);
    setIdiomaNome("");
    setIdiomaNivel("Básico");
  }

  async function deletarIdioma(index) {
    if (!confirm("Deseja realmente remover o idioma?")) return;

    const updated = idiomas.filter((_, i) => i !== index);

    const atualizado = await apiFetch("/usuarios/me", {
      method: "PUT",
      body: JSON.stringify({
        idiomas: updated,
      }),
    });

    setIdiomas(atualizado.idiomas || []);
  }


  /* -------- logout -------- */
 async function logout() {
  try {
    await fetch(`${API_URL}/usuarios/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("certin_token")}`,
      },
    });
  } catch (err) {
    console.warn("Erro ao notificar logout");
  } finally {
    localStorage.removeItem("certin_token");
    window.location.href = "/";
  }
}
  /* -------- render -------- */
  if (!user) return null;

  return (
    <>
      <Navbar />

      <main className="dashboard-page">
        <div className="tabs">
          <button className={`tab-btn ${activeTab === "perfil" ? "active" : ""}`} onClick={() => setActiveTab("perfil")}>
            Perfil
          </button>
          <button className={`tab-btn ${activeTab === "formacoes" ? "active" : ""}`} onClick={() => setActiveTab("formacoes")}>
            Formações & Idiomas
          </button>
        </div>

        {/* PERFIL */}
        {activeTab === "perfil" && (
          <>
            <section className="profile">
              <div className="avatar">👤</div>
              <div className="info">
                <h3>{user.nome}</h3>
                <p>{user.email}</p>

                {!editandoPerfil ? (
                  <>
                    <p>{curso} • {instituicao} • {semestre}º semestre</p>
                    <button className="btn" onClick={() => setEditandoPerfil(true)}>Editar Perfil</button>
                    <button className="btn ghost" onClick={logout}>Logout</button>
                  </>
                ) : (
                  <form onSubmit={salvarPerfil} className="profile-edit-form">
                    <input value={curso} onChange={e => setCurso(e.target.value)} placeholder="Curso" />
                    <input value={instituicao} onChange={e => setInstituicao(e.target.value)} placeholder="Instituição" />
                    <input value={semestre} onChange={e => setSemestre(e.target.value)} placeholder="Semestre (somente números)" />
                    <button className="btn">Salvar</button>
                  </form>
                )}
              </div>
            </section>

            {/* CERTIFICADOS */}
            <section className="my-certs">
              <h3>Meus Certificados</h3>

              <div className="cert-grid">
                {certificados.map(c => (
                  <Card key={c.id} title={c.nome_certificado}>
                    <div className="cert-card">
                    <h4 className="cert-card-title">{c.titulo}</h4>
                    <button className="btn ghost" onClick={() => deletarCertificado(c.id)}>Deletar</button>
                    </div>
                  </Card>
                ))}
              </div>

              <button className="btn" onClick={() => setShowModal(true)}>Adicionar Certificado</button>
            </section>
          </>
        )}

        {/* FORMAÇÕES E IDIOMAS */}
        {activeTab === "formacoes" && (
          <section className="my-certs two-col">
            <div>
              <h3>Formações</h3>

              {formacoes.length === 0 && <p>Nenhuma formação cadastrada.</p>}

              {formacoes.map((f, index) => (
                <Card
                  key={index}
                  title={f.curso}
                  subtitle={f.instituicao}
                >
                  <p>{f.ano}</p>
                  <button
                    className="btn ghost"
                    onClick={() => deletarFormacao(index)}
                  >
                    Remover
                  </button>
                </Card>
              ))}


              <form onSubmit={adicionarFormacao}>
                <input value={formCurso} onChange={e => setFormCurso(e.target.value)} placeholder="Curso" />
                <input value={formInst} onChange={e => setFormInst(e.target.value)} placeholder="Instituição" />
                <input value={formAno} onChange={e => setFormAno(e.target.value)} placeholder="Ano" />
                <button className="btn">Adicionar</button>
              </form>
            </div>

            <div>
              <h3>Idiomas</h3>
              {idiomas.length === 0 && <p>Nenhum idioma cadastrado.</p>}

              {idiomas.map((i, index) => (
                <Card
                  key={index}
                  title={i.idioma}
                  subtitle={i.nivel}
                >
                  <button
                    className="btn ghost"
                    onClick={() => deletarIdioma(index)}
                  >
                    Remover
                  </button>

                </Card>
              ))}

              <form onSubmit={adicionarIdioma}>
                <input value={idiomaNome} onChange={e => setIdiomaNome(e.target.value)} placeholder="Idioma" />
                <select value={idiomaNivel} onChange={e => setIdiomaNivel(e.target.value)}>
                  <option>Básico</option>
                  <option>Intermediário</option>
                  <option>Avançado</option>
                  <option>Fluente</option>
                  <option>Nativo</option>
                </select>
                <button className="btn">Adicionar</button>
              </form>
            </div>
          </section>
        )}
      </main>

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        title="Novo Certificado"
      >
        <form onSubmit={adicionarCertificado} className="modal-form">
          <Input
            label="Instituição e Título do Certificado"
            placeholder="Ex: Curso de Extensão em Pesquisa Científica (2025)..."
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />

          <label className="form-field">
            <span className="field-label">Descrição do Trabalho</span>
            <textarea
              value={descricao}
              placeholder="Ex: Desenvolvedor de pesquisa e metodologias..."
              onChange={(e) => setDescricao(e.target.value)}
            />
          </label>

          <label className="form-field">
            <span className="field-label">Palavras-chave</span>
            <input
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="Ex: extensão, pesquisa"
            />
          </label>

          <div className="modal-actions">
            <button className="btn" type="submit">
              Salvar
            </button>
            <button
              className="btn ghost"
              type="button"
              onClick={() => setShowModal(false)}
            >
              Cancelar
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
