import { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import BottomNav from "./BottomNav";

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  showBack?: boolean;
}

export default function PageLayout({ title, subtitle, children, showBack = false }: PageLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-24 bg-gradient-hero bg-noise">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-2xl border-b border-border/30 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          {showBack && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-xl bg-secondary/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={18} />
            </motion.button>
          )}
          <div>
            <h1 className="font-display text-lg font-bold tracking-tight">{title}</h1>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="max-w-2xl mx-auto px-4 py-6 space-y-5"
      >
        {children}
      </motion.main>

      <BottomNav />
    </div>
  );
}
