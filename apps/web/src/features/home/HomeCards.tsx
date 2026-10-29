import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { CARD_CATALOG, resolveCards, type CardPref } from "./cards";

export default function HomeCards() {
  const { profile, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);

  const prefs = resolveCards(profile?.home_cards);
  const byId = new Map(CARD_CATALOG.map((c) => [c.id, c]));

  function save(next: CardPref[]) {
    void updateProfile({ home_cards: next });
  }

  function toggle(id: string) {
    save(prefs.map((p) => (p.id === id ? { ...p, visible: !p.visible } : p)));
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= prefs.length) return;
    const next = [...prefs];
    [next[index], next[target]] = [next[target], next[index]];
    save(next);
  }

  function reset() {
    save(CARD_CATALOG.map((c) => ({ id: c.id, visible: true })));
  }

  const visible = prefs.filter((p) => p.visible);

  return (
    <section>
      <div className="cards-header">
        <h2>Seu universo</h2>
        <button onClick={() => setEditing(!editing)}>
          {editing ? "Concluir" : "Personalizar"}
        </button>
      </div>

      {editing ? (
        <div className="card edit-list">
          {prefs.map((p, i) => {
            const info = byId.get(p.id)!;
            return (
              <div className="edit-row" key={p.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={p.visible}
                    onChange={() => toggle(p.id)}
                  />{" "}
                  {info.title}
                </label>
                <span className="edit-buttons">
                  <button
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    aria-label={"Subir " + info.title}
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => move(i, 1)}
                    disabled={i === prefs.length - 1}
                    aria-label={"Descer " + info.title}
                  >
                    ↓
                  </button>
                </span>
              </div>
            );
          })}
          <button className="link" onClick={reset}>
            Restaurar padrão
          </button>
        </div>
      ) : visible.length === 0 ? (
        <p className="muted">Nenhum cartão visível. Clique em Personalizar para escolher.</p>
      ) : (
        <div className="grid">
          {visible.map((p) => {
            const info = byId.get(p.id)!;
            return (
              <div className="card" key={p.id}>
                <h3>{info.title}</h3>
                <p>{info.text}</p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}