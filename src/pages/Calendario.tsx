import { useState } from "react";
import { ChevronLeft, ChevronRight, Zap, Plus, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageLayout from "@/components/PageLayout";
import { useCalendario, divisao, TreinoKey } from "@/lib/data";
import { toast } from "sonner";

const nomeMeses = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",
];

const weekDays = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const treinoColors: Record<string, string> = {
  A: "bg-emerald-500",
  B: "bg-sky-500",
  C: "bg-amber-500",
  D: "bg-violet-500",
};

export default function Calendario() {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTreino, setSelectedTreino] = useState<string>("A");

  const { addEntry, getForDate } = useCalendario();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const todayStr = today.toISOString().split("T")[0];
  const treinoHoje = getForDate(todayStr);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
    setSelectedDay(null);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
    setSelectedDay(null);
  };

  const handleSave = () => {
    if (selectedDay === null) return;
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`;
    addEntry(dateStr, selectedTreino);
    toast.success(`Treino ${selectedTreino} salvo para dia ${selectedDay}!`);
    setSelectedDay(null);
  };

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  // Count per treino type this month
  const monthCounts: Record<string, number> = {};
  for (let d = 1; d <= daysInMonth; d++) {
    const ds = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const t = getForDate(ds);
    if (t) monthCounts[t] = (monthCounts[t] || 0) + 1;
  }

  const selectedDateStr = selectedDay !== null
    ? `${year}-${String(month + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`
    : "";
  const selectedDayTreino = selectedDay !== null ? getForDate(selectedDateStr) : "";

  return (
    <PageLayout title="Calendário">
      {/* Treino de hoje */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card glow-primary p-4 flex items-center justify-center gap-2"
      >
        <Zap className="text-primary" size={18} />
        <span className="font-semibold text-sm">Hoje:</span>
        {treinoHoje ? (
          <span className="px-3 py-1 rounded-lg bg-primary/15 text-primary font-bold text-sm border border-primary/20">
            TREINO {treinoHoje}
          </span>
        ) : (
          <span className="text-muted-foreground text-sm">Nenhum treino</span>
        )}
      </motion.div>

      {/* Month navigation */}
      <div className="flex items-center justify-between glass-card p-3">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={prevMonth}
          className="w-9 h-9 rounded-xl bg-secondary/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft size={18} />
        </motion.button>
        <span className="font-display font-bold text-base">
          {nomeMeses[month]} {year}
        </span>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={nextMonth}
          className="w-9 h-9 rounded-xl bg-secondary/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronRight size={18} />
        </motion.button>
      </div>

      {/* Month summary */}
      {Object.keys(monthCounts).length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {Object.entries(monthCounts).map(([t, c]) => (
            <div key={t} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/60 text-xs font-medium">
              <div className={`w-2 h-2 rounded-full ${treinoColors[t] || "bg-primary"}`} />
              <span className="text-muted-foreground">Treino {t}:</span>
              <span className="font-bold text-foreground">{c}x</span>
            </div>
          ))}
        </div>
      )}

      {/* Calendar grid */}
      <div className="glass-card p-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((d, i) => (
            <div key={i} className="text-center text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider py-1">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, i) => {
            if (day === null) return <div key={`e${i}`} />;
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const treino = getForDate(dateStr);
            const isToday = dateStr === todayStr;
            const isSelected = day === selectedDay;
            return (
              <motion.button
                key={i}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedDay(day === selectedDay ? null : day)}
                className={`relative p-1.5 text-center min-h-[48px] flex flex-col items-center justify-center gap-0.5 rounded-xl transition-all duration-200 ${
                  isSelected
                    ? "bg-primary/15 border border-primary/40 ring-1 ring-primary/20"
                    : isToday
                    ? "bg-secondary border border-primary/30"
                    : "border border-transparent hover:bg-secondary/50"
                }`}
              >
                <span className={`text-xs font-semibold ${
                  isToday ? "text-primary" : isSelected ? "text-primary" : "text-foreground/80"
                }`}>
                  {day}
                </span>
                {treino && (
                  <div className={`w-2 h-2 rounded-full ${treinoColors[treino] || "bg-primary"}`} />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Register panel */}
      <AnimatePresence>
        {selectedDay !== null && (
          <motion.div
            initial={{ opacity: 0, y: 16, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 16, height: 0 }}
            className="glass-card p-4 space-y-4 overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-sm">
                Dia {selectedDay} – {selectedDayTreino ? `Treino ${selectedDayTreino}` : "Sem treino"}
              </h3>
              {selectedDayTreino && (
                <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold">
                  Registrado
                </span>
              )}
            </div>

            <div className="flex gap-2">
              {(Object.keys(divisao) as TreinoKey[]).map((k) => (
                <motion.button
                  key={k}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedTreino(k)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                    selectedTreino === k
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-secondary/60 text-muted-foreground hover:bg-secondary"
                  }`}
                  style={selectedTreino === k ? { boxShadow: "0 4px 14px -2px hsl(145 80% 42% / 0.3)" } : {}}
                >
                  {k}
                </motion.button>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2"
            >
              {selectedDayTreino ? <Check size={16} /> : <Plus size={16} />}
              {selectedDayTreino ? "Atualizar" : "Salvar"} Treino {selectedTreino}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
}
