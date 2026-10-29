import { useState, type FormEvent } from "react";
import { supabase } from "../../data/supabase";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");
    setBusy(true);

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: name.trim() } },
      });
      if (error) setError(traduzir(error.message));
      else if (!data.session) setInfo("Conta criada! Confirme seu e-mail para entrar.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(traduzir(error.message));
    }
    setBusy(false);
  }

  return (
    <div className="app auth">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h1>MEU UNIVERSO</h1>
        <p className="muted">
          {mode === "login" ? "Entre na sua conta" : "Crie sua conta"}
        </p>

        {mode === "signup" && (
          <input
            placeholder="Como quer ser chamado(a)?"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha (mínimo 6 caracteres)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />

        {error && <p className="msg error">{error}</p>}
        {info && <p className="msg info">{info}</p>}

        <button type="submit" className="primary" disabled={busy}>
          {busy ? "Aguarde..." : mode === "login" ? "Entrar" : "Cadastrar"}
        </button>
        <button
          type="button"
          className="link"
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setError("");
            setInfo("");
          }}
        >
          {mode === "login" ? "Não tem conta? Cadastre-se" : "Já tem conta? Entrar"}
        </button>
      </form>
    </div>
  );
}

function traduzir(msg: string) {
  if (msg.includes("Invalid login credentials")) return "E-mail ou senha incorretos.";
  if (msg.includes("already registered")) return "Este e-mail já está cadastrado.";
  if (msg.includes("Password should be")) return "A senha precisa ter ao menos 6 caracteres.";
  return msg;
}