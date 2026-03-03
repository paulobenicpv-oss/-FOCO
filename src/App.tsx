import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import TreinoDetalhado from "./pages/TreinoDetalhado";
import Calendario from "./pages/Calendario";
import EvolucaoTreino from "./pages/EvolucaoTreino";
import EvolucaoFisico from "./pages/EvolucaoFisico";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/treino/:tipo" element={<TreinoDetalhado />} />
          <Route path="/calendario" element={<Calendario />} />
          <Route path="/evolucao-treino" element={<EvolucaoTreino />} />
          <Route path="/evolucao-fisico" element={<EvolucaoFisico />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
