import { useState, useEffect } from "react";

// Types
export interface CalendarioEntry {
  data: string;
  treino: string;
}

export interface EvolucaoTreinoEntry {
  id: string;
  data: string;
  exercicio: string;
  peso: number;
}

export interface EvolucaoFisicoEntry {
  id: string;
  data: string;
  peso: number;
}

// Divisão de treino
export const divisao = {
  A: {
    titulo: "Peito + Bíceps",
    estrutura: {
      Peito: [
        "Supino Inclinado – 4x6-8 (pesado)",
        "Supino Reto Máquina – 4x8 (pesado)",
        "Peck Deck – 3x12",
        "Crossover – 3x12",
      ],
      Bíceps: [
        "Rosca Direta (barra ou polia) – 3x8-10",
        "Rosca Scott – 3x10",
        "Rosca Martelo (corda ou halter) – 3x12",
      ],
    },
  },
  B: {
    titulo: "Perna (completo)",
    estrutura: {
      Perna: [
        "Agachamento Hack ou Livre – 4x6-8 pesado",
        "Leg Press – 4x10",
        "Cadeira Extensora – 3x12 (drop set na última)",
        "Mesa Flexora – 3x12",
        "Cadeira Abdutora – 3x12 ou 3x15",
        "Panturrilha – 4x15",
      ],
    },
  },
  C: {
    titulo: "Ombro + Tríceps + Abdômen",
    estrutura: {
      Ombro: [
        "Desenvolvimento (máquina ou halter) – 4x6-8",
        "Elevação Lateral – 3x12-15",
        "Peck Deck Invertido – 3x15",
      ],
      Tríceps: [
        "Tríceps Testa – 3x10",
        "Tríceps Corda – 3x12",
        "Tríceps Unilateral – 3x12",
      ],
      Abdômen: ["Abdômen – 3x15 + prancha 30–40s"],
    },
  },
  D: {
    titulo: "Costas + Panturrilha",
    estrutura: {
      Costas: [
        "Puxada Frente (pronada) – 4x6-8",
        "Remada Articulada – 4x8-10",
        "Puxada Triângulo – 3x12",
        "Remada Unilateral – 3x12",
      ],
      Panturrilha: ["Panturrilha – 4x15"],
    },
  },
} as const;

export type TreinoKey = keyof typeof divisao;

// localStorage helpers
function loadData<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveData<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Hooks
export function useCalendario() {
  const [entries, setEntries] = useState<CalendarioEntry[]>(() =>
    loadData("calendario", [])
  );

  useEffect(() => saveData("calendario", entries), [entries]);

  const addEntry = (data: string, treino: string) => {
    setEntries((prev) => {
      const filtered = prev.filter((e) => e.data !== data);
      return [...filtered, { data, treino }];
    });
  };

  const getForDate = (data: string) =>
    entries.find((e) => e.data === data)?.treino || "";

  return { entries, addEntry, getForDate };
}

export function useEvolucaoTreino() {
  const [entries, setEntries] = useState<EvolucaoTreinoEntry[]>(() =>
    loadData("evolucao_treino", [])
  );

  useEffect(() => saveData("evolucao_treino", entries), [entries]);

  const addEntry = (exercicio: string, peso: number) => {
    const newEntry: EvolucaoTreinoEntry = {
      id: crypto.randomUUID(),
      data: new Date().toISOString().split("T")[0],
      exercicio,
      peso,
    };
    setEntries((prev) => [...prev, newEntry]);
  };

  const getPRs = () => {
    const prs: Record<string, number> = {};
    entries.forEach((e) => {
      if (!prs[e.exercicio] || e.peso > prs[e.exercicio]) {
        prs[e.exercicio] = e.peso;
      }
    });
    return prs;
  };

  const getMediaSemana = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekStr = weekAgo.toISOString().split("T")[0];
    const week = entries.filter((e) => e.data >= weekStr);
    if (week.length === 0) return 0;
    return Math.round((week.reduce((s, e) => s + e.peso, 0) / week.length) * 10) / 10;
  };

  return { entries, addEntry, getPRs, getMediaSemana };
}

export function useEvolucaoFisico() {
  const [entries, setEntries] = useState<EvolucaoFisicoEntry[]>(() =>
    loadData("evolucao_fisico", [])
  );

  useEffect(() => saveData("evolucao_fisico", entries), [entries]);

  const addEntry = (peso: number) => {
    const newEntry: EvolucaoFisicoEntry = {
      id: crypto.randomUUID(),
      data: new Date().toISOString().split("T")[0],
      peso,
    };
    setEntries((prev) => [...prev, newEntry]);
  };

  return { entries, addEntry };
}
