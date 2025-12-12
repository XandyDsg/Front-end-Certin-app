import { useEffect, useState, useCallback } from "react";
import Navbar from "../Componentes/Navbar";
import Card from "../Componentes/Card";
import Modal from "../Componentes/Modal";
import Input from "../Componentes/Input";
import "../Interface/dashboard.css";

const STORAGE_KEYS = {
  USER: "certin_user",
  FEED: "certin_feed",
  FORMACOES: "certin_formacoes",
  IDIOMAS: "certin_idiomas",
};

const DEFAULT_USER_NAME = "Usuário Teste";

function parseJSON(value, fallback) {
  try {
    return JSON.parse(value ?? "null") ?? fallback;
  } catch {
    return fallback;
  }
}

function load(key, fallback) {
  return parseJSON(localStorage.getItem(key), fallback);
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export default function Dashboard() {
  // --- estados principais ---
  const [user, setUser] = useState(null);
  const [myCerts, setMyCerts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // tabs
  const [activeTab, setActiveTab] = useState("perfil"); // 'perfil' | 'formacoes'

  // perfil edit
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editDescricao, setEditDescricao] = useState("");
  const [editCurso, setEditCurso] = useState("");
  const [editInstituicao, setEditInstituicao] = useState("");
  const [editSemestre, setEditSemestre] = useState("");

  // certificado (form)
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tags, setTags] = useState("");
  const [preview, setPreview] = useState(null);

  // formações e idiomas
  const [formacoes, setFormacoes] = useState([]);
  const [idiomas, setIdiomas] = useState([]);

  // campos formações
  const [eduInstituicao, setEduInstituicao] = useState("");
  const [eduCurso, setEduCurso] = useState("");
  const [eduAno, setEduAno] = useState("");

  // campos idiomas
  const [idiomaNome, setIdiomaNome] = useState("");
  const [idiomaNivel, setIdiomaNivel] = useState("Básico");

  // --- carregar dados iniciais ---
  useEffect(() => {
    const storedUser = load(STORAGE_KEYS.USER, null);
    setUser(storedUser);

    const feed = load(STORAGE_KEYS.FEED, []);
    const ownerName = storedUser?.nome ?? DEFAULT_USER_NAME;
    setMyCerts(feed.filter((f) => f.usuario === ownerName));

    setFormacoes(load(STORAGE_KEYS.FORMACOES, []));
    setIdiomas(load(STORAGE_KEYS.IDIOMAS, []));
  }, []);

  // --- helpers de imagem ---
  const handleImageChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return setPreview(null);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  }, []);

  // --- certificados ---
  const adicionarCertificado = useCallback(
    (e) => {
      e.preventDefault();
      if (!titulo.trim()) return alert("Informe o título");

      const feed = load(STORAGE_KEYS.FEED, []);
      const novo = {
        id: Date.now(),
        usuario: user?.nome ?? DEFAULT_USER_NAME,
        titulo: titulo.trim(),
        descricao,
        imagem: preview,
        data: new Date().toISOString().slice(0, 10),
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      };

      const updatedFeed = [novo, ...feed];
      save(STORAGE_KEYS.FEED, updatedFeed);
      setMyCerts((prev) => [novo, ...prev]);

      // limpar formulário
      setTitulo("");
      setDescricao("");
      setTags("");
      setPreview(null);
      setShowModal(false);
    },
    [titulo, descricao, preview, tags, user]
  );

  const deletarCert = useCallback((id) => {
    if (!confirm("Tem certeza que deseja deletar este certificado?")) return;
    const feed = load(STORAGE_KEYS.FEED, []);
    const updatedFeed = feed.filter((f) => f.id !== id);
    save(STORAGE_KEYS.FEED, updatedFeed);
    setMyCerts((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // --- logout ---
  function logout() {
    localStorage.removeItem(STORAGE_KEYS.USER);
    window.location.href = "/";
  }

  // --- perfil: edição ---
  function editarPerfil() {
    setEditDescricao(user?.descricao ?? "");
    setEditCurso(user?.curso ?? "");
    setEditInstituicao(user?.instituicao ?? "");
    setEditSemestre(user?.semestre ?? "");
    setIsEditingProfile(true);
  }

  function salvarPerfil(e) {
    e.preventDefault();
    const updatedUser = {
      ...(user || {}),
      descricao: editDescricao,
      curso: editCurso,
      instituicao: editInstituicao,
      semestre: editSemestre,
    };
    save(STORAGE_KEYS.USER, updatedUser);
    setUser(updatedUser);
    setIsEditingProfile(false);
  }

  function cancelarEdicao() {
    setIsEditingProfile(false);
  }

  // --- formações ---
  const adicionarFormacao = useCallback(
    (e) => {
      e.preventDefault();
      if (!eduCurso.trim() && !eduInstituicao.trim()) return alert("Preencha curso ou instituição");
      const nova = { id: Date.now(), curso: eduCurso.trim(), instituicao: eduInstituicao.trim(), ano: eduAno.trim() };
      const updated = [nova, ...formacoes];
      setFormacoes(updated);
      save(STORAGE_KEYS.FORMACOES, updated);
      setEduCurso("");
      setEduInstituicao("");
      setEduAno("");
    },
    [eduCurso, eduInstituicao, eduAno, formacoes]
  );

  const deletarFormacao = useCallback(
    (id) => {
      if (!confirm("Deletar formação?")) return;
      const updated = formacoes.filter((f) => f.id !== id);
      setFormacoes(updated);
      save(STORAGE_KEYS.FORMACOES, updated);
    },
    [formacoes]
  );

  // --- idiomas ---
  const adicionarIdioma = useCallback(
    (e) => {
      e.preventDefault();
      if (!idiomaNome.trim()) return alert("Informe o idioma");
      const novo = { id: Date.now(), idioma: idiomaNome.trim(), nivel: idiomaNivel };
      const updated = [novo, ...idiomas];
      setIdiomas(updated);
      save(STORAGE_KEYS.IDIOMAS, updated);
      setIdiomaNome("");
      setIdiomaNivel("Básico");
    },
    [idiomaNome, idiomaNivel, idiomas]
  );

  const deletarIdioma = useCallback(
    (id) => {
      if (!confirm("Deletar idioma?")) return;
      const updated = idiomas.filter((i) => i.id !== id);
      setIdiomas(updated);
      save(STORAGE_KEYS.IDIOMAS, updated);
    },
    [idiomas]
  );

  // --- render ---
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

        {activeTab === "perfil" && (
          <>
            <section className="profile">
              <div className="avatar">👤</div>
              <div className="info">
                <h3>{user?.nome ?? DEFAULT_USER_NAME}</h3>
                <p>{user?.email}</p>

                {!isEditingProfile ? (
                  <>
                    <p className="desc">{user?.descricao ?? "Adicione uma descrição ao seu perfil."}</p>
                    <div className="profile-meta">
                      <p className="status">
                        {user?.curso ?? "Curso não informado"} &middot; {user?.instituicao ?? "Instituição não informada"} &middot;{" "}
                        {user?.semestre ? `${user.semestre}º semestre` : "Semestre não informado"}
                      </p>
                      <p className="total-certs">Total de certificados: {myCerts.length}</p>
                    </div>
                    <div className="profile-actions">
                      <button className="btn" onClick={() => setShowModal(true)}>
                        Adicionar Certificado
                      </button>
                      <button className="btn" onClick={editarPerfil}>
                        Editar Perfil
                      </button>
                      <button className="btn ghost" onClick={logout}>
                        Sair
                      </button>
                    </div>
                  </>
                ) : (
                  <form className="profile-edit-form" onSubmit={salvarPerfil}>
                    <label className="form-field">
                      <span className="field-label">Descrição</span>
                      <textarea value={editDescricao} onChange={(e) => setEditDescricao(e.target.value)} />
                    </label>
                    <label className="form-field">
                      <span className="field-label">Curso</span>
                      <input value={editCurso} onChange={(e) => setEditCurso(e.target.value)} />
                    </label>
                    <label className="form-field">
                      <span className="field-label">Instituição</span>
                      <input value={editInstituicao} onChange={(e) => setEditInstituicao(e.target.value)} />
                    </label>
                    <label className="form-field">
                      <span className="field-label">Semestre</span>
                      <input type="number" min="0" value={editSemestre} onChange={(e) => setEditSemestre(e.target.value)} />
                    </label>
                    <div className="profile-actions">
                      <button className="btn" type="submit">
                        Salvar
                      </button>
                      <button className="btn ghost" type="button" onClick={cancelarEdicao}>
                        Cancelar
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </section>

            <section className="my-certs">
              <h3>Meus Certificados</h3>
              <div className="cert-grid">
                {myCerts.length === 0 && <p>Você ainda não adicionou certificados visíveis aqui.</p>}
                {myCerts.map((c) => (
                  <Card key={c.id} title={c.titulo} subtitle={c.data}>
                    <p>{c.descricao}</p>
                    <div style={{ marginTop: 8 }}>
                      <button className="btn ghost" onClick={() => deletarCert(c.id)}>
                        Deletar
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </>
        )}

        {activeTab === "formacoes" && (
          <section className="formacoes-section">
            <div className="two-col">
              <div className="col">
                <h3>Formações</h3>
                <form onSubmit={adicionarFormacao} className="small-form">
                  <label className="form-field">
                    <span className="field-label">Curso</span>
                    <input value={eduCurso} onChange={(e) => setEduCurso(e.target.value)} placeholder="Nome do curso" />
                  </label>
                  <label className="form-field">
                    <span className="field-label">Instituição</span>
                    <input value={eduInstituicao} onChange={(e) => setEduInstituicao(e.target.value)} placeholder="Instituição" />
                  </label>
                  <label className="form-field">
                    <span className="field-label">Ano / Conclusão</span>
                    <input value={eduAno} onChange={(e) => setEduAno(e.target.value)} placeholder="Ex: 2022" />
                  </label>
                  <div className="form-actions">
                    <button className="btn" type="submit">
                      Adicionar Formação
                    </button>
                  </div>
                </form>

                <div className="list">
                  {formacoes.length === 0 && <p>Sem formações cadastradas.</p>}
                  {formacoes.map((f) => (
                    <Card key={f.id} title={f.curso || "—"} subtitle={f.instituicao || ""}>
                      <p>{f.ano}</p>
                      <div style={{ marginTop: 8 }}>
                        <button className="btn ghost" onClick={() => deletarFormacao(f.id)}>
                          Remover
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="col">
                <h3>Idiomas</h3>
                <form onSubmit={adicionarIdioma} className="small-form">
                  <label className="form-field">
                    <span className="field-label">Idioma</span>
                    <input value={idiomaNome} onChange={(e) => setIdiomaNome(e.target.value)} placeholder="Ex: Inglês" />
                  </label>
                  <label className="form-field">
                    <span className="field-label">Nível</span>
                    <select value={idiomaNivel} onChange={(e) => setIdiomaNivel(e.target.value)}>
                      <option>Básico</option>
                      <option>Intermediário</option>
                      <option>Avançado</option>
                      <option>Fluente</option>
                      <option>Nativo</option>
                    </select>
                  </label>
                  <div className="form-actions">
                    <button className="btn" type="submit">
                      Adicionar Idioma
                    </button>
                  </div>
                </form>

                <div className="list">
                  {idiomas.length === 0 && <p>Sem idiomas cadastrados.</p>}
                  {idiomas.map((i) => (
                    <Card key={i.id} title={i.idioma} subtitle={i.nivel}>
                      <div style={{ marginTop: 8 }}>
                        <button className="btn ghost" onClick={() => deletarIdioma(i.id)}>
                          Remover
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <Modal show={showModal} onClose={() => setShowModal(false)} title="Adicionar Certificado">
        <form onSubmit={adicionarCertificado} className="modal-form">
          <Input label="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
          <label className="form-field">
            <span className="field-label">Descrição</span>
            <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} />
          </label>
          <label className="form-field">
            <span className="field-label">Tags (vírgula separa)</span>
            <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Ex: Extensão, Pesquisa" />
          </label>
          <label className="form-field">
            <span className="field-label">Imagem (opcional)</span>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </label>
          {preview && <img src={preview} alt="preview" className="preview-img" />}
          <div className="modal-actions">
            <button className="btn" type="submit">
              Salvar
            </button>
            <button className="btn ghost" type="button" onClick={() => setShowModal(false)}>
              Cancelar
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
