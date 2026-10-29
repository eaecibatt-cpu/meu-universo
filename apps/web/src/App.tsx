import { useEffect } from "react";
import { AuthProvider, useAuth } from "./features/auth/AuthContext";
import AuthPage from "./features/auth/AuthPage";
import HomeCards from "./features/home/HomeCards";

function Home() {
  const { profile, updateProfile, signOut } = useAuth();

  const mode = profile?.theme_mode ?? "auto";
  const glass = profile?.glass_mode ?? "on";

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const dark = mode === "dark" || (mode === "auto" && media.matches);
      document.documentElement.dataset.theme = dark ? "dark" : "light";
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [mode]);

  useEffect(() => {
    document.documentElement.dataset.glass = glass;
  }, [glass]);

  return (
    <div className="app">
      <div className="topbar">
        <h1>Bem-vindo, {profile?.display_name || "você"}!</h1>
        <button onClick={signOut}>Sair</button>
      </div>

      <div className="settings">
        <label>
          Tema:{" "}
          <select
            value={mode}
            onChange={(e) => updateProfile({ theme_mode: e.target.value as "auto" | "light" | "dark" })}
          >
            <option value="auto">Automático</option>
            <option value="light">Claro</option>
            <option value="dark">Escuro</option>
          </select>
        </label>
        <label>
          Liquid Glass:{" "}
          <select
            value={glass}
            onChange={(e) => updateProfile({ glass_mode: e.target.value as "on" | "reduced" | "off" })}
          >
            <option value="on">Ativado</option>
            <option value="reduced">Reduzido</option>
            <option value="off">Desativado</option>
          </select>
        </label>
      </div>

      <HomeCards />
    </div>
  );
}

function Gate() {
  const { session, loading } = useAuth();
  if (loading) return <div className="app"><p>Carregando...</p></div>;
  return session ? <Home /> : <AuthPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  );
}