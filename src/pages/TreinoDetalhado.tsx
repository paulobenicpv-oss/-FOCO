import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { divisao, TreinoKey } from "@/lib/data";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0 },
};

export default function TreinoDetalhado() {
  const { tipo } = useParams<{ tipo: string }>();
  const treino = divisao[tipo as TreinoKey];
  const [checked, setChecked] = useState<Set<string>>(new Set());

  if (!treino) {
    return (
      <PageLayout title="Treino não encontrado" showBack>
        <p className="text-muted-foreground">Treino inválido.</p>
      </PageLayout>
    );
  }

  const allExercises = Object.values(treino.estrutura).flat();
  const progress = allExercises.length > 0 ? Math.round((checked.size / allExercises.length) * 100) : 0;

  const toggle = (ex: string) => {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(ex)) next.delete(ex);
      else next.add(ex);
      return next;
    });
  };

  return (
    <PageLayout
      title={`Treino ${tipo}`}
      subtitle={treino.titulo}
      showBack
    >
      {/* Progress bar */}
      <div className="glass-card p-4 space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground font-medium">Progresso</span>
          <span className="font-display font-bold text-primary">{progress}%</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            style={{ boxShadow: "0 0 12px hsl(145 80% 42% / 0.4)" }}
          />
        </div>
        <p className="text-[10px] text-muted-foreground text-center">
          {checked.size} de {allExercises.length} exercícios concluídos
        </p>
      </div>

      {/* Exercise groups */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {Object.entries(treino.estrutura).map(([grupo, exercicios]) => (
          <motion.div
            key={grupo}
            variants={item}
            className="glass-card p-5 space-y-3"
          >
            <h3 className="font-display text-base font-bold text-primary flex items-center gap-2">
              <div className="w-1 h-5 rounded-full bg-primary" />
              {grupo}
            </h3>
            <ul className="space-y-1">
              {exercicios.map((ex, i) => {
                const isChecked = checked.has(ex);
                return (
                  <motion.li
                    key={i}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggle(ex)}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                      isChecked
                        ? "bg-primary/8 border border-primary/20"
                        : "hover:bg-secondary/50 border border-transparent"
                    }`}
                  >
                    <motion.div
                      animate={isChecked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CheckCircle2
                        size={20}
                        className={`shrink-0 transition-colors duration-200 ${
                          isChecked ? "text-primary" : "text-muted-foreground/30"
                        }`}
                      />
                    </motion.div>
                    <span className={`text-sm transition-all duration-200 ${
                      isChecked ? "text-muted-foreground line-through" : "text-foreground"
                    }`}>
                      {ex}
                    </span>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        ))}
      </motion.div>

      {progress === 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card glow-primary-strong p-6 text-center space-y-2"
        >
          <div className="text-4xl">🎉</div>
          <h3 className="font-display text-xl font-extrabold text-gradient">Treino Concluído!</h3>
          <p className="text-sm text-muted-foreground">Excelente trabalho, campeão!</p>
        </motion.div>
      )}
    </PageLayout>
  );
}
