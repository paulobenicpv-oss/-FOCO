import { Link } from "react-router-dom";
import { Zap, ChevronRight, Flame, Target, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import PageLayout from "@/components/PageLayout";
import { divisao, TreinoKey, useCalendario } from "@/lib/data";

const treinoMeta: Record<string, { icon: string; gradient: string; accent: string }> = {
  A: { icon: "💪", gradient: "from-emerald-500/15 via-emerald-400/5 to-transparent", accent: "border-emerald-500/20" },
  B: { icon: "🦵", gradient: "from-sky-500/15 via-sky-400/5 to-transparent", accent: "border-sky-500/20" },
  C: { icon: "🏋️", gradient: "from-amber-500/15 via-amber-400/5 to-transparent", accent: "border-amber-500/20" },
  D: { icon: "🔥", gradient: "from-violet-500/15 via-violet-400/5 to-transparent", accent: "border-violet-500/20" },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1 },
};

export default function Dashboard() {
  const { entries, getForDate } = useCalendario();
  const todayStr = new Date().toISOString().split("T")[0];
  const treinoHoje = getForDate(todayStr);

  // Calculate streak
  const today = new Date();
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const ds = d.toISOString().split("T")[0];
    if (entries.find(e => e.data === ds)) {
      streak++;
    } else if (i > 0) break;
  }

  // This month count
  const thisMonth = entries.filter(e => e.data.startsWith(todayStr.slice(0, 7))).length;

  return (
    <PageLayout title="Academia Profissional">
      {/* Hero section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card glow-primary p-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
        <div className="relative text-center space-y-3">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Zap className="mx-auto text-primary" size={36} />
          </motion.div>
          <h2 className="font-display text-2xl font-extrabold text-gradient">
            Bora Treinar!
          </h2>
          {treinoHoje ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20">
              <Flame size={16} className="text-primary" />
              <span className="text-sm font-bold text-primary">TREINO {treinoHoje} HOJE</span>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Nenhum treino registrado para hoje
            </p>
          )}
        </div>
      </motion.div>

      {/* Quick stats */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-3"
      >
        <motion.div variants={item} className="stat-card">
          <Flame className="mx-auto text-warning mb-2" size={22} />
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Sequência</div>
          <div className="font-display text-2xl font-extrabold mt-1">
            {streak}
            <span className="text-xs text-muted-foreground font-normal ml-1">dias</span>
          </div>
        </motion.div>
        <motion.div variants={item} className="stat-card">
          <Calendar className="mx-auto text-info mb-2" size={22} />
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Este mês</div>
          <div className="font-display text-2xl font-extrabold mt-1">
            {thisMonth}
            <span className="text-xs text-muted-foreground font-normal ml-1">treinos</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Section title */}
      <div className="flex items-center gap-3 pt-2">
        <Target size={16} className="text-primary" />
        <h3 className="font-display text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Divisão de Treino
        </h3>
        <div className="flex-1 h-px bg-border/40" />
      </div>

      {/* Workout cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-3"
      >
        {(Object.keys(divisao) as TreinoKey[]).map((key) => {
          const meta = treinoMeta[key];
          const exerciseCount = Object.values(divisao[key].estrutura).flat().length;
          return (
            <motion.div key={key} variants={item}>
              <Link
                to={`/treino/${key}`}
                className={`glass-card-hover block p-5 bg-gradient-to-br ${meta.gradient} group`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{meta.icon}</span>
                  <ChevronRight
                    size={16}
                    className="text-muted-foreground/40 group-hover:text-primary transition-all duration-300 group-hover:translate-x-0.5"
                  />
                </div>
                <div className="font-display text-lg font-extrabold text-foreground">
                  Treino {key}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {divisao[key].titulo}
                </div>
                <div className="mt-3 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                  <span className="text-[10px] text-muted-foreground font-medium">
                    {exerciseCount} exercícios
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </PageLayout>
  );
}
