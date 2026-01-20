import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../Componentes/Input";
import Button from "../Componentes/Button";
import "../Interface/login.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  const [mode, setMode] = useState("login"); // login | register
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senha2, setSenha2] = useState("");
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("aluno"); // aluno | professor
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email || !senha) {
      return setError("Preencha todos os campos");
    }

    try {
      /* ================= REGISTRO ================= */
      if (mode === "register") {
        if (!nome) return setError("Informe seu nome");
        if (senha !== senha2) return setError("As senhas não coincidem");

        const registerRes = await fetch(`${API_URL}/usuarios/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome,
            email,
            senha,
            tipo
          })
        });

        if (!registerRes.ok) {
          const err = await registerRes.json();
          throw new Error(err.detail || "Erro ao criar conta");
        }
      }

      /* ================= LOGIN ================= */
      const loginRes = await fetch(`${API_URL}/usuarios/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          senha
        })
      });


      if (!loginRes.ok) {
        const err = await loginRes.json();
        throw new Error(err.detail || "E-mail ou senha inválidos");
      }

      const { access_token } = await loginRes.json();
      localStorage.setItem("certin_token", access_token);

      /* ================= ME ================= */
      const meRes = await fetch(`${API_URL}/usuarios/me`, {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      });

      if (!meRes.ok) throw new Error("Erro ao carregar perfil");

      const user = await meRes.json();
      localStorage.setItem("certin_user", JSON.stringify(user));

      /* ================= REDIRECT ================= */
      navigate(user.tipo === "professor" ? "/Perfil_professor" : "/dashboard");

    } catch (err) {
      console.error(err);
      setError(err.message || "Erro inesperado");
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <h2>{mode === "login" ? "Bem-vindo de volta!" : "Criar conta"}</h2>

        {error && <p className="form-error">{error}</p>}

        <form className="login-form" onSubmit={handleSubmit}>
          {mode === "register" && (
            <>
              <Input
                label="Nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />

              <div className="role-select">
                <label>
                  <input
                    type="radio"
                    checked={tipo === "aluno"}
                    onChange={() => setTipo("aluno")}
                  />
                  Aluno
                </label>

                {/* <label>
                  <input
                    type="radio"
                    checked={tipo === "professor"}
                    onChange={() => setTipo("professor")}
                  />
                  Professor
                </label> */}
              </div>
            </>
          )}

          <Input
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          {mode === "register" && (
            <Input
              label="Confirmar senha"
              type="password"
              value={senha2}
              onChange={(e) => setSenha2(e.target.value)}
            />
          )}

          <Button type="submit">
            {mode === "login" ? "Entrar" : "Registrar"}
          </Button>
        </form>

        <button
          className="link-btn"
          onClick={() => {
            setMode(mode === "login" ? "register" : "login");
            setError("");
          }}
        >
          {mode === "login"
            ? "Sou novo e quero criar conta"
            : "Já possuo cadastro e quero fazer login"}
        </button>
      </section>
    </main>
  );
}
