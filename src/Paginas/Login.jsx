import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../Componentes/Input";
import Button from "../Componentes/Button";
import "../Interface/login.css";

export default function Login() {
  const [mode, setMode] = useState("login"); // 'login' or 'register'
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senha2, setSenha2] = useState("");
  const [nome, setNome] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // se já tiver user em localStorage, redireciona pro dashboard (facilitar demo)
    const user = localStorage.getItem("certin_user");
    if (user) navigate("/dashboard");
  }, []);

  function validarEmail(e) {
    return /\S+@\S+\.\S+/.test(e);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!validarEmail(email)) return setError("E-mail inválido");
    if (senha.length < 6) return setError("Senha precisa ter >= 6 caracteres");
    if (mode === "register") {
      if (senha !== senha2) return setError("As senhas não coincidem");
      if (!nome.trim()) return setError("Informe seu nome");
      // simula registro salvando no localStorage (apenas demo)
      const user = { id: Date.now(), nome, email, descricao: "Olá!", avatar: null };
      localStorage.setItem("certin_user", JSON.stringify(user));
      navigate("/dashboard");
    } else {
      // login fictício: aceita qualquer email/senha (desde que validados)
      const stored = localStorage.getItem("certin_user");
      if (stored) {
        const user = JSON.parse(stored);
        if (user.email !== email) {
          // permite login mesmo se o e-mail for diferente — professor verá fluxo
          localStorage.setItem("certin_user", JSON.stringify({ ...user, email }));
        }
      } else {
        // cria usuário mock se não existir
        const user = { id: Date.now(), nome: "Usuário Teste", email, descricao: "", avatar: null };
        localStorage.setItem("certin_user", JSON.stringify(user));
      }
      navigate("/dashboard");
    }
  }

  return (
    <>
      <main className="login-page">
        <section className="login-card">
          <h2>{mode === "login" ? "Entrar" : "Criar conta"}</h2>

          {error && <div className="form-error">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            {mode === "register" && (
              <Input label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome completo" />
            )}

            <Input label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@exemplo.com" />
            <Input label="Senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="******" />
            {mode === "register" && (
              <Input label="Confirmar senha" type="password" value={senha2} onChange={(e) => setSenha2(e.target.value)} placeholder="******" />
            )}

            <div className="login-actions">
              <Button type="submit">{mode === "login" ? "Entrar" : "Registrar"}</Button>
              <button type="button" className="link-btn" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}>
                {mode === "login" ? "Criar uma conta" : "Já tenho conta"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </>
  );
}
