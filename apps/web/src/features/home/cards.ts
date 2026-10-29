export type CardPref = { id: string; visible: boolean };

export const CARD_CATALOG = [
  { id: "agenda", title: "Agenda", text: "Compromissos e eventos" },
  { id: "tarefas", title: "Tarefas", text: "O que precisa ser feito" },
  { id: "compras", title: "Lista de compras", text: "Mercado e afins" },
  { id: "diario", title: "Diário", text: "Seu dia, em palavras" },
  { id: "faculdade", title: "Faculdade", text: "Disciplinas, provas e prazos" },
  { id: "notas", title: "Notas", text: "Anotações rápidas" },
  { id: "pessoal", title: "Meu espaço pessoal", text: "Memórias e coleções" },
];

// Junta a escolha salva com o catálogo atual:
// ignora cartões que não existem mais e acrescenta os novos no final.
export function resolveCards(saved: CardPref[] | null | undefined): CardPref[] {
  const known = new Set(CARD_CATALOG.map((c) => c.id));
  const seen = new Set<string>();
  const result: CardPref[] = [];

  for (const s of saved ?? []) {
    if (known.has(s.id) && !seen.has(s.id)) {
      result.push({ id: s.id, visible: s.visible !== false });
      seen.add(s.id);
    }
  }
  for (const c of CARD_CATALOG) {
    if (!seen.has(c.id)) result.push({ id: c.id, visible: true });
  }
  return result;
}