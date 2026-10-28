import { useEffect, useState } from "react";

type Mode = "auto" | "light" | "dark";
type Glass = "on" | "reduced" | "off";

const CARDS = [
  { title: "Agenda", text: "Compromissos e eventos" },
  { title: "Tarefas", text: "O que precisa ser feito" },
  { title: "Lista de compras", text: "Mercado e afins" },
  { title: "Diário", text: "Seu dia, em palavras" },
  { title: "Faculdade", text: "Disciplinas, provas e prazos" },
  { title: "Notas", text: "Anotações rápidas" },
  { title: "Meu espaço pessoal", text: "Memórias e coleções" },
];

export default function App() {
  const [mode, setMode] = useState<Mode>("auto");
  const [glass, setGlass] = useState<Glass>("on");

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
      <h1>Bem-vindo, Kauã!</h1>

      <div className="settings">
        <label>
          Tema:{" "}
          <select value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
            <option value="auto">Automático</option>
            <option value="light">Claro</option>
            <option value="dark">Escuro</option>
          </select>
        </label>
        <label>
          Liquid Glass:{" "}
          <select value={glass} onChange={(e) => setGlass(e.target.value as Glass)}>
            <option value="on">Ativado</option>
            <option value="reduced">Reduzido</option>
            <option value="off">Desativado</option>
          </select>
        </label>
      </div>

      <div className="grid">
        {CARDS.map((c) => (
          <div className="card" key={c.title}>
            <h3>{c.title}</h3>
            <p>{c.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}