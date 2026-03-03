import { useState } from "react";
import { Scale, TrendingDown, TrendingUp, Plus, Activity } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import PageLayout from "@/components/PageLayout";
import { useEvolucaoFisico } from "@/lib/data";
import { toast } from "sonner";

export default function EvolucaoFisico() {
  const { entries, addEntry } = useEvolucaoFisico();
  const [peso, setPeso] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!peso) return;
    addEntry(parseFloat(peso));
    toast.success(`Peso ${peso}kg registrado!`);
    setPeso("");
    setShowForm(false);
  };

  const chartData = entries.map((e) => ({
    data: e.data.slice(5),
    peso: e.peso,
  }));

  const lastWeight = entries.length > 0 ? entries[entries.length - 1].peso : null;
  const firstWeight = entries.length > 0 ? entries[0].peso : null;
  const diff = lastWeight && firstWeight ? Math.round((lastWeight - firstWeight) * 10) / 10 : null;
  
  // Last 7 days trend
  const last7 = entries.slice(-7);
  const weekTrend = last7.length >= 2
    ? Math.round((last7[last7.length - 1].peso - last7[0].peso) * 10) / 10
    : null;

  // Min / max
  const minWeight = entries.length > 0 ? Math.min(...entries.map(e => e.peso)) : null;
  const maxWeight = entries.length > 0 ? Math.max(...entries.map(e => e.peso)) : null;

  return (
    <PageLayout title="Evolução Física">
      {/* Stats grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-2 gap-3"
      >
        <div className="stat-card">
          <Scale className="mx-auto text-primary mb-2" size={22} />
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Peso Atual</div>
          <div className="font-display text-2xl font-extrabold mt-1">
            {lastWeight ? <>{lastWeight}<span className="text-xs text-muted-foreground font-normal ml-1">kg</span></> : "—"}
          </div>
        </div>
        <div className="stat-card">
          {diff !== null && diff < 0 ? (
            <TrendingDown className="mx-auto text-primary mb-2" size={22} />
          ) : (
            <TrendingUp className="mx-auto text-destructive mb-2" size={22} />
          )}
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Variação Total</div>
          <div className={`font-display text-2xl font-extrabold mt-1 ${
            diff !== null && diff < 0 ? "text-primary" : diff !== null && diff > 0 ? "text-destructive" : ""
          }`}>
            {diff !== null ? `${diff > 0 ? "+" : ""}${diff}` : "—"}
            {diff !== null && <span className="text-xs font-normal ml-1">kg</span>}
          </div>
        </div>
      </motion.div>

      {/* Extra stats */}
      {entries.length >= 2 && (
        <div className="grid grid-cols-3 gap-2">
          <div className="glass-card p-3 text-center">
            <div className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">Mínimo</div>
            <div className="font-display text-sm font-bold mt-1 text-info">{minWeight} kg</div>
          </div>
          <div className="glass-card p-3 text-center">
            <div className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">Máximo</div>
            <div className="font-display text-sm font-bold mt-1 text-warning">{maxWeight} kg</div>
          </div>
          <div className="glass-card p-3 text-center">
            <div className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">7 dias</div>
            <div className={`font-display text-sm font-bold mt-1 ${
              weekTrend !== null && weekTrend < 0 ? "text-primary" : weekTrend !== null && weekTrend > 0 ? "text-destructive" : "text-foreground"
            }`}>
              {weekTrend !== null ? `${weekTrend > 0 ? "+" : ""}${weekTrend}` : "—"}
            </div>
          </div>
        </div>
      )}

      {/* Toggle form */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowForm(!showForm)}
        className={`btn-primary w-full py-3 flex items-center justify-center gap-2 ${showForm ? "bg-secondary text-foreground shadow-none" : ""}`}
        style={showForm ? { boxShadow: "none" } : {}}
      >
        <Plus size={18} className={`transition-transform duration-200 ${showForm ? "rotate-45" : ""}`} />
        {showForm ? "Fechar" : "Registrar Peso"}
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
              type="number"
              step="0.1"
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
              placeholder="Peso corporal (kg)"
              className="input-field"
              required
              autoFocus
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
            <div className="w-1 h-4 rounded-full bg-info" />
            Evolução do Peso
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorPesoFisico" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(200 80% 55%)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(200 80% 55%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(225 15% 16%)" />
              <XAxis dataKey="data" tick={{ fontSize: 10, fill: "hsl(225 10% 50%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(225 10% 50%)" }} axisLine={false} tickLine={false} domain={["dataMin - 2", "dataMax + 2"]} />
              <Tooltip
                contentStyle={{
                  background: "hsl(225 20% 10%)",
                  border: "1px solid hsl(225 15% 20%)",
                  borderRadius: 12,
                  color: "hsl(0 0% 96%)",
                  fontSize: 12,
                }}
                formatter={(value: number) => [`${value} kg`, "Peso"]}
              />
              <Area
                type="monotone"
                dataKey="peso"
                stroke="hsl(200 80% 55%)"
                strokeWidth={2.5}
                fill="url(#colorPesoFisico)"
                dot={{ fill: "hsl(200 80% 55%)", r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "hsl(200 80% 55%)", stroke: "hsl(225 25% 6%)", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* History */}
      {entries.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-4"
        >
          <h3 className="font-display font-bold text-sm mb-3 flex items-center gap-2">
            <div className="w-1 h-4 rounded-full bg-primary" />
            Histórico
          </h3>
          <div className="space-y-1">
            {entries.slice(-8).reverse().map((e, i) => (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.03 * i }}
                className="flex items-center justify-between p-2.5 rounded-lg text-xs hover:bg-secondary/30 transition-colors"
              >
                <span className="text-muted-foreground">{e.data}</span>
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-foreground">{e.peso} kg</span>
                  {i < entries.slice(-8).reverse().length - 1 && (() => {
                    const prev = entries.slice(-8).reverse()[i + 1];
                    const d = Math.round((e.peso - prev.peso) * 10) / 10;
                    if (d === 0) return null;
                    return (
                      <span className={`text-[10px] font-medium ${d < 0 ? "text-primary" : "text-destructive"}`}>
                        {d > 0 ? "+" : ""}{d}
                      </span>
                    );
                  })()}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </PageLayout>
  );
}
