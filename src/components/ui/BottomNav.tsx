import { Link, useLocation } from "react-router-dom";
import { Home, Calendar, BarChart3, Dumbbell } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/calendario", icon: Calendar, label: "Calendário" },
  { path: "/evolucao-treino", icon: BarChart3, label: "Treino" },
  { path: "/evolucao-fisico", icon: Dumbbell, label: "Físico" },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-2xl border-t border-border/30 px-2 pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around items-center h-[68px] max-w-md mx-auto relative">
        {navItems.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className="relative flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-colors"
            >
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-0 bg-primary/10 rounded-2xl"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <motion.div
                animate={active ? { scale: 1.15, y: -2 } : { scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <Icon
                  size={22}
                  className={`transition-colors duration-200 ${
                    active ? "text-primary" : "text-muted-foreground"
                  }`}
                  style={active ? { filter: "drop-shadow(0 0 10px hsl(145 80% 42% / 0.5))" } : {}}
                />
              </motion.div>
              <span className={`text-[10px] font-semibold relative z-10 transition-colors duration-200 ${
                active ? "text-primary" : "text-muted-foreground"
              }`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
