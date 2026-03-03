import { useState } from "react";
import { Trophy, TrendingUp, Plus, Trash2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import PageLayout from "@/components/PageLayout";
import { useEvolucaoTreino } from "@/lib/data";
import { toast } from "sonner";

export default function EvolucaoTreino() {
  const { entries, addEntry, getPRs, getMediaSemana } = useEvolucaoTreino();
  const [exercicio, setExercicio] = useState("");
  const [peso, setPeso] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exercicio || !peso) return;
    addEntry(exercicio, parseFloat(peso));
    toast.success(`${exercicio} – ${peso}kg registrado!`);
    setExercicio("");
    setPeso("");
    setShowForm(false);
  };

  const prs = getPRs();
  const media = getMediaSemana();

  const chartData = entries.slice(-20).map((e) => ({
    data: e.data.slice(5),
    peso: e.peso,
    exercicio: e.exercicio,
  }));

  return (
    <PageLayout title="Evolução Treino">
      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-2 gap-3"
      >
        <div className="stat-card">
          <TrendingUp className="mx-auto text-primary mb-2" size={22} />
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Média Semana</div>
          <div className="font-display text-2xl font-extrabold mt-1">{media}<span className="text-xs text-muted-foreground font-normal ml-1">kg</span></div>
        </div>
        <div className="stat-card">
          <Trophy className="mx-auto text-warning mb-2" size={22} />
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Recordes</div>
          <div className="font-display text-2xl font-extrabold mt-1">{Object.keys(prs).length}</div>
        </div>
      </motion.div>

      {/* Toggle form button */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowForm(!showForm)}
        className={`btn-primary w-full py-3 flex items-center justify-center gap-2 ${showForm ? "bg-secondary text-foreground shadow-none" : ""}`}
        style={showForm ? { boxShadow: "none" } : {}}
      >
        <Plus size={18} className={`transition-transform duration-200 ${showForm ? "rotate-45" : ""}`} />
        {showForm ? "Fechar" : "Registrar Carga"}
      </motion.button>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="glass-card p-4 space-y-3 overflow-hidden"
          >
            <input
              value={exercicio}
              onChange={(e) => setExercicio(e.target.value)}
              placeholder="Nome do exercício"
              className="input-field"
              required
              autoFocus
            />
            <input
              type="number"
              step="0.1"
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
              placeholder="Peso (kg)"
              className="input-field"
              required
            />
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="btn-primary w-full py-3"
            >
              Salvar Registro
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Chart */}
      {chartData.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-4"
        >
          <h3 className="font-display font-bold text-sm mb-4 flex items-center gap-2">
            <div className="w-1 h-4 rounded-full bg-primary" />
            Evolução de Carga
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorPeso" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(145 80% 42%)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(145 80% 42%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(225 15% 16%)" />
              <XAxis dataKey="data" tick={{ fontSize: 10, fill: "hsl(225 10% 50%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(225 10% 50%)" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "hsl(225 20% 10%)",
                  border: "1px solid hsl(225 15% 20%)",
                  borderRadius: 12,
                  color: "hsl(0 0% 96%)",
                  fontSize: 12,
                }}
                formatter={(value: number, _name: string, props: { payload: { exercicio: string } }) => [
                  `${value} kg`,
                  props.payload.exercicio,
                ]}
              />
              <Area
                type="monotone"
                dataKey="peso"
                stroke="hsl(145 80% 42%)"
                strokeWidth={2.5}
                fill="url(#colorPeso)"
                dot={{ fill: "hsl(145 80% 42%)", r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "hsl(145 80% 42%)", stroke: "hsl(225 25% 6%)", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* PRs */}
      {Object.keys(prs).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-4"
        >
          <h3 className="font-display font-bold text-sm mb-3 flex items-center gap-2">
            <div className="w-1 h-4 rounded-full bg-warning" />
            Recordes Pessoais
          </h3>
          <div className="space-y-1.5">
            {Object.entries(prs).map(([ex, p], i) => (
              <motion.div
                key={ex}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary/40 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Trophy size={14} className="text-warning/60" />
                  <span className="text-sm text-foreground/80">{ex}</span>
                </div>
                <span className="font-display font-bold text-primary text-sm">{p} kg</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recent entries */}
      {entries.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-4"
        >
          <h3 className="font-display font-bold text-sm mb-3 flex items-center gap-2">
            <div className="w-1 h-4 rounded-full bg-info" />
            Últimos Registros
          </h3>
          <div className="space-y-1">
            {entries.slice(-5).reverse().map((e, i) => (
              <div key={e.id} className="flex items-center justify-between p-2.5 rounded-lg text-xs">
                <span className="text-muted-foreground">{e.data}</span>
                <span className="text-foreground/80">{e.exercicio}</span>
                <span className="font-bold text-primary">{e.peso} kg</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </PageLayout>
  );
}
