/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AlertTriangle, 
  BarChart3, 
  Settings2, 
  Database, 
  ChevronRight, 
  ShieldCheck, 
  Zap,
  Clock,
  Droplets,
  Construction,
  Info,
  CheckCircle2,
  XCircle,
  LayoutDashboard,
  BrainCircuit,
  Settings,
  Moon,
  Sun
} from 'lucide-react';
import { INITIAL_RISKS, CONSUMPTION_HISTORY } from './data';
import { MaterialRisk, RiskLevel } from './types';
import { cn } from './lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  Legend
} from 'recharts';

// --- Sub-components ---

interface RiskCardProps {
  risk: MaterialRisk;
  key?: string | number;
}

const RiskCard = ({ risk }: RiskCardProps) => {
  const isHigh = risk.riskLevel === 'HIGH';

  const riskColor = {
    HIGH: 'border-red-500/50 bg-red-500/[0.03] text-red-600 dark:text-red-400',
    MEDIUM: 'border-amber-500/50 bg-amber-500/[0.03] text-amber-600 dark:text-amber-400',
    LOW: 'border-emerald-500/50 bg-emerald-500/[0.03] text-emerald-600 dark:text-emerald-400',
  }[risk.riskLevel];

  const riskLabel = {
    HIGH: 'CRÍTICO',
    MEDIUM: 'MÉDIO',
    LOW: 'BAIXO',
  }[risk.riskLevel];

  const shadowColor = {
    HIGH: 'shadow-red-500/10 dark:shadow-red-500/20',
    MEDIUM: 'shadow-amber-500/10',
    LOW: 'shadow-emerald-500/10',
  }[risk.riskLevel];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: 1,
      }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4, scale: isHigh ? 1.01 : 1.02 }}
      className={cn(
        "relative flex flex-col justify-between overflow-hidden rounded-2xl border p-5 transition-all duration-300",
        riskColor,
        shadowColor,
        "shadow-xl backdrop-blur-md",
        isHigh ? "md:col-span-2 h-[340px]" : "h-[300px]",
        "bg-white/80 dark:bg-bg-secondary/40"
      )}
    >
      {isHigh && (
        <motion.div 
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-0 bg-red-500/[0.05] pointer-events-none"
        />
      )}

      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[9px] font-mono uppercase tracking-[0.2em] opacity-50 dark:opacity-40">{risk.stage}</span>
            <h3 className={cn("mt-1 font-bold text-text-primary tracking-tight leading-tight", isHigh ? "text-2xl" : "text-lg")}>{risk.name}</h3>
          </div>
          <div className={cn(
            "rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-widest",
            risk.riskLevel === 'HIGH' ? 'bg-red-500 text-white' : 
            risk.riskLevel === 'MEDIUM' ? 'bg-amber-500 text-black' : 'bg-emerald-500 text-white'
          )}>
            {riskLabel}
          </div>
        </div>

        <div className={cn("flex items-end justify-between", isHigh ? "mt-10" : "mt-6")}>
          <div>
            <p className="text-[9px] font-mono uppercase opacity-50 dark:opacity-40 tracking-wider">Probabilidade Perda</p>
            <p className={cn("font-black text-text-primary", isHigh ? "text-4xl" : "text-2xl")}>
              {(risk.riskScore * 100).toFixed(0)}<span className="text-sm opacity-30">/100</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-mono uppercase opacity-50 dark:opacity-40 tracking-wider">Desperdício</p>
            <p className={cn("font-black text-text-primary", isHigh ? "text-4xl" : "text-2xl")}>{risk.estimatedWaste}</p>
          </div>
        </div>

        <div className={cn("overflow-hidden rounded-full bg-black/5 dark:bg-white/5", isHigh ? "mt-6 h-2" : "mt-4 h-1.5")}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${risk.riskScore * 100}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className={cn(
              "h-full rounded-full transition-all",
              risk.riskLevel === 'HIGH' ? 'bg-gradient-to-r from-red-600 to-red-400' : 
              risk.riskLevel === 'MEDIUM' ? 'bg-amber-500' : 'bg-emerald-500'
            )}
          />
        </div>
      </div>

      <div className={cn(
        "relative z-10 flex items-start gap-3 rounded-xl p-3.5 transition-colors mt-auto",
        isHigh ? "bg-red-500/5 dark:bg-red-500/10 border border-red-500/10 shadow-inner" : "bg-black/5 dark:bg-black/20"
      )}>
        <Zap className={cn("mt-0.5 h-4 w-4 shrink-0", isHigh ? "text-red-500 dark:text-red-400" : "text-amber-500 dark:text-amber-400")} />
        <p className={cn("text-xs leading-relaxed", isHigh ? "text-text-primary font-medium" : "text-text-secondary")}>
          <span className="font-bold opacity-60 uppercase text-[8px] tracking-widest block mb-0.5">Ação Preventiva</span>
          {risk.recommendation}
        </p>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [risks, setRisks] = useState<MaterialRisk[]>(INITIAL_RISKS);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analysis'>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Simulation State
  const [formData, setFormData] = useState({
    material: 'Concreto (C30)',
    stage: 'Suporte Estrutural',
    consumption: 1200,
    productivity: 85,
    weather: 'Úmido'
  });

  const [lastRun, setLastRun] = useState<string>('12:04:32');

  // Deep Analysis State
  const [analysisParams, setAnalysisParams] = useState({
    productivity: 72,
    weather: 'Úmido',
    logistics: 85,
    material: 'Argamassa (M10)'
  });

  const analysisRiskScore = useMemo(() => {
    let score = (100 - analysisParams.productivity) * 0.4;
    if (analysisParams.weather === 'Úmido') score += 20;
    if (analysisParams.weather === 'Extremo') score += 40;
    score += (100 - analysisParams.logistics) * 0.2;
    return Math.min(100, Math.max(0, score));
  }, [analysisParams]);

  const factorDecomposition = useMemo(() => [
    { name: 'Clima', value: analysisParams.weather === 'Seco' ? 10 : analysisParams.weather === 'Úmido' ? 30 : 50, fill: '#ef4444' },
    { name: 'Execução', value: (100 - analysisParams.productivity), fill: '#3b82f6' },
    { name: 'Logística', value: (100 - analysisParams.logistics), fill: '#10b981' },
    { name: 'Fase Obra', value: 15, fill: '#ec4899' },
  ], [analysisParams]);

  const trendData = useMemo(() => [
    { day: 'Seg', risk: 45 },
    { day: 'Ter', risk: 52 },
    { day: 'Qua', risk: 48 },
    { day: 'Qui', risk: 70 },
    { day: 'Sex', risk: analysisRiskScore },
  ], [analysisRiskScore]);

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    // Simulated delay
    setTimeout(() => {
      const newRisk: MaterialRisk = {
        id: Math.random().toString(),
        name: formData.material,
        stage: formData.stage,
        riskLevel: formData.productivity < 70 ? 'HIGH' : formData.productivity < 90 ? 'MEDIUM' : 'LOW',
        riskScore: (100 - formData.productivity) / 100 + (formData.weather === 'Úmido' ? 0.2 : 0),
        estimatedWaste: formData.productivity < 70 ? '14-16%' : '5-8%',
        recommendation: `Otimizar o uso de ${formData.material} em ${formData.stage}. Aumentar o monitoramento durante a condição de tempo ${formData.weather}.`,
        status: 'warning'
      };
      setRisks([newRisk, ...risks.slice(0, 3)]);
      setIsAnalyzing(false);
      setLastRun(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1500);
  };

  const highRisksCount = useMemo(() => risks.filter(r => r.riskLevel === 'HIGH').length, [risks]);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary font-sans selection:bg-blue-500/30 transition-colors duration-300">
      {/* Sidebar - Desktop Only */}
      <aside className="fixed left-0 top-0 hidden h-full w-20 flex-col items-center border-r border-border-primary bg-bg-secondary/40 py-8 lg:flex backdrop-blur-xl">
        <div className="mb-12 rounded-xl bg-blue-600 p-2 text-white shadow-lg shadow-blue-500/20">
          <BrainCircuit className="h-8 w-8" />
        </div>
        <nav className="flex flex-col gap-6">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={cn("p-3 rounded-xl transition-all", activeTab === 'dashboard' ? "bg-blue-500/10 text-blue-500" : "text-text-secondary hover:text-text-primary")}
          >
            <LayoutDashboard className="h-6 w-6" />
          </button>
          <button 
            onClick={() => setActiveTab('analysis')}
            className={cn("p-3 rounded-xl transition-all", activeTab === 'analysis' ? "bg-blue-500/10 text-blue-500" : "text-text-secondary hover:text-text-primary")}
          >
            <BarChart3 className="h-6 w-6" />
          </button>
        </nav>
        <div className="mt-auto flex flex-col gap-6">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-3 rounded-xl text-text-secondary hover:text-text-primary transition-all bg-bg-secondary hover:bg-border-primary"
            title={isDarkMode ? "Mudar para tema claro" : "Mudar para tema escuro"}
          >
            {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
          </button>
          <button className="p-3 text-text-secondary hover:text-text-primary transition-all">
            <Settings className="h-6 w-6" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="lg:pl-20">
        {/* Header */}
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border-primary bg-bg-primary/80 px-6 py-4 backdrop-blur-xl md:px-12">
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-text-primary flex items-center gap-2">
              BUILD<span className="text-blue-600">GUARD</span>
              <span className="hidden md:inline-flex items-center rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-mono font-bold text-blue-600 outline outline-1 outline-blue-500/20">
                IA PREDITIVA v2.4
              </span>
            </h1>
            <p className="text-xs text-text-secondary font-mono">OBRA: CENTRAL PLAZA TOWER 01</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden border-r border-border-primary pr-4 text-right md:block">
              <p className="text-[10px] font-mono uppercase text-text-secondary">Última Execução</p>
              <p className="text-sm font-mono font-bold text-blue-600">{lastRun}</p>
            </div>
            <div className="hidden items-center gap-2 text-sm md:flex">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-text-secondary font-medium lowercase">ia ativa</span>
            </div>
            <div className="h-10 w-10 overflow-hidden rounded-full border border-border-primary cursor-pointer hover:border-blue-500/30 transition-all">
              <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix" alt="User" />
            </div>
          </div>
        </header>

        <div className="max-w-7xl px-6 py-8 md:px-12">
          {/* Top Stats */}
          <section className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Perda Estimada Total', value: `~R$ ${ (highRisksCount * 4500).toLocaleString() }`, icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/5' },
              { label: 'Alertas Críticos', value: highRisksCount, icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/5' },
              { label: 'Material mais Crítico', value: risks[0]?.name || 'Nenhum', icon: Database, color: 'text-blue-500', bg: 'bg-blue-500/5' },
              { label: 'Etapa Sob Risco', value: risks[0]?.stage || 'Nenhuma', icon: Construction, color: 'text-emerald-500', bg: 'bg-emerald-500/5' },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-2xl border border-border-primary bg-bg-secondary p-6 transition-all hover:border-blue-500/20 shadow-sm"
              >
                <div className={cn("mb-4 flex h-10 w-10 items-center justify-center rounded-lg", stat.bg)}>
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
                <p className="text-xs font-mono uppercase tracking-widest text-text-secondary">{stat.label}</p>
                <h2 className="mt-1 text-2xl font-black text-text-primary tracking-tighter">{stat.value}</h2>
              </motion.div>
            ))}
          </section>

          {/* Tab switching content */}
          {activeTab === 'dashboard' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-12"
            >
              {/* Risks Section */}
              <section>
                <div className="mb-10 rounded-2xl border border-red-500/20 bg-red-500/5 px-6 py-4 flex items-center justify-between backdrop-blur-sm">
                   <div className="flex items-center gap-4">
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="h-3 w-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                      />
                      <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                        ⚠️ {highRisksCount} materiais com risco crítico de desperdício detectados
                      </h2>
                   </div>
                   <span className="text-[10px] font-mono text-red-500 font-bold animate-pulse uppercase tracking-[0.2em]">Urgente</span>
                </div>

                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-black text-text-primary tracking-tighter uppercase">Centro de Comando Preditivo</h2>
                    <div className="h-1.5 w-1.5 rounded-full bg-border-primary" />
                    <span className="text-[10px] font-mono text-text-secondary uppercase tracking-widest">Sincronizado: {lastRun}</span>
                  </div>
                  <button className="text-[10px] font-bold text-blue-600 hover:text-blue-500 transition-colors uppercase tracking-widest flex items-center gap-1 group bg-blue-500/5 px-4 py-2 rounded-full border border-blue-500/10">
                    Relatório Completo <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <AnimatePresence mode="popLayout">
                    {risks.map((risk) => (
                      <RiskCard key={risk.id} risk={risk} />
                    ))}
                  </AnimatePresence>
                </div>
              </section>

              {/* Data and Table Section */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Consumption Chart */}
                <div className="lg:col-span-8 space-y-6">
                  <div className="rounded-2xl border border-border-primary bg-bg-secondary p-5 shadow-sm">
                    <div className="mb-8 flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-text-primary tracking-tight">Desvio de Consumo em Tempo Real</h3>
                        <p className="text-xs text-text-secondary font-mono">Consumo Real (IA) vs. Planejado (Cronograma)</p>
                      </div>
                      <div className="flex gap-8 text-right">
                        <div>
                           <p className="text-[9px] font-mono text-text-secondary uppercase tracking-widest mb-1">Delta Acumulado</p>
                           <p className="text-xl font-black text-red-500 tracking-tighter">2.418 un</p>
                        </div>
                        <div>
                           <p className="text-[9px] font-mono text-text-secondary uppercase tracking-widest mb-1">Impacto Financeiro</p>
                           <p className="text-xl font-black text-red-400 tracking-tighter">+12.4%</p>
                        </div>
                      </div>
                    </div>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={CONSUMPTION_HISTORY}>
                          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border-primary" vertical={false} />
                          <XAxis 
                            dataKey="name" 
                            stroke="currentColor"
                            className="text-text-secondary"
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false} 
                            dy={10}
                          />
                          <YAxis 
                            stroke="currentColor"
                            className="text-text-secondary"
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false} 
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'var(--bg-secondary)', 
                              borderColor: 'var(--border-primary)', 
                              borderRadius: '12px',
                              color: 'var(--text-primary)'
                            }}
                            itemStyle={{ color: 'var(--text-primary)' }}
                          />
                          <Legend wrapperStyle={{ paddingTop: '20px' }} />
                          <Bar dataKey="planned" fill="#3b82f6" name="Consumo Planejado" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="estimated" fill="#ec4899" name="Predição Preditiva IA" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Material Table */}
                  <div className="overflow-hidden rounded-2xl border border-border-primary bg-bg-secondary shadow-sm">
                    <div className="border-b border-border-primary bg-bg-primary/50 px-6 py-4">
                      <h3 className="font-bold text-text-primary uppercase tracking-widest text-xs">Análise Estruturada</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="border-b border-border-primary bg-bg-secondary text-[10px] uppercase tracking-wider text-text-secondary font-mono">
                          <tr>
                            <th className="px-6 py-4 font-normal">Material</th>
                            <th className="px-6 py-4 font-normal">Etapa</th>
                            <th className="px-6 py-4 font-normal">Risco</th>
                            <th className="px-6 py-4 font-normal">Resíduo (%)</th>
                            <th className="px-6 py-4 font-normal">Ação</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border-primary">
                          {risks.map((item) => (
                            <tr key={item.id} className="group hover:bg-bg-primary/40 transition-colors">
                              <td className="whitespace-nowrap px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 rounded bg-bg-primary flex items-center justify-center border border-border-primary">
                                    <Database className="h-4 w-4 text-blue-500" />
                                  </div>
                                  <span className="font-bold text-text-primary">{item.name}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-text-secondary font-mono text-xs">{item.stage}</td>
                              <td className="px-6 py-4">
                                <span className={cn(
                                  "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-tighter",
                                  item.riskLevel === 'HIGH' ? "text-red-500 bg-red-500/10" : 
                                  item.riskLevel === 'MEDIUM' ? "text-amber-500 bg-amber-500/10" : "text-emerald-500 bg-emerald-500/10"
                                )}>
                                  {item.riskLevel === 'HIGH' ? 'CRÍTICO' : item.riskLevel === 'MEDIUM' ? 'MÉDIO' : 'BAIXO'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-text-primary font-bold">{item.estimatedWaste}</td>
                              <td className="px-6 py-4">
                                <button className="rounded-lg border border-border-primary p-2 text-text-secondary hover:text-blue-500 hover:border-blue-500/30 transition-all opacity-0 group-hover:opacity-100">
                                  <ChevronRight className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Analysis Panel */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="rounded-3xl border border-blue-500/20 bg-blue-500/[0.03] p-7 backdrop-blur-xl relative overflow-hidden group shadow-2xl">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-all">
                      <BrainCircuit className="h-28 w-28 text-blue-500" />
                    </div>
                    <div className="relative z-10 text-left">
                      <div className="mb-8 flex items-center gap-4">
                        <div className="rounded-2xl bg-blue-500 text-white shadow-xl shadow-blue-500/20 p-2.5">
                          <Settings2 className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-black uppercase tracking-tighter text-text-primary">Simular Risco</h3>
                          <p className="text-[9px] text-blue-500 font-mono tracking-widest uppercase">Engine v2.4</p>
                        </div>
                      </div>
                      
                      <div className="space-y-5">
                        <div>
                          <label className="mb-2 block text-[10px] font-mono uppercase text-text-secondary tracking-widest font-bold">Tipo de Material</label>
                          <select 
                            className="w-full rounded-xl border border-border-primary bg-bg-primary p-3 text-sm focus:border-blue-500/50 focus:ring-0 outline-none text-text-primary shadow-inner"
                            value={formData.material}
                            onChange={(e) => setFormData({...formData, material: e.target.value})}
                          >
                            <option>Concreto (C30)</option>
                            <option>Cimento de Alta Resistência</option>
                            <option>Barra de Aço</option>
                            <option>Alvenaria</option>
                          </select>
                        </div>
                        <div>
                          <label className="mb-2 block text-[10px] font-mono uppercase text-text-secondary tracking-widest font-bold">Etapa da Obra</label>
                          <select 
                            className="w-full rounded-xl border border-border-primary bg-bg-primary p-3 text-sm focus:border-blue-500/50 focus:ring-0 outline-none text-text-primary shadow-inner"
                             value={formData.stage}
                             onChange={(e) => setFormData({...formData, stage: e.target.value})}
                          >
                            <option>Fundações</option>
                            <option>Suporte Estrutural</option>
                            <option>Acabamento</option>
                            <option>Obras Hidrossanitárias</option>
                          </select>
                        </div>
                        <div>
                          <label className="mb-2 block text-[10px] font-mono uppercase text-text-secondary tracking-widest font-bold">Consumo Planejado (un)</label>
                          <input 
                            type="number" 
                            className="w-full rounded-xl border border-border-primary bg-bg-primary p-3 text-sm outline-none focus:border-blue-500/50 text-text-primary shadow-inner" 
                            defaultValue={1200} 
                          />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-2">
                             <label className="block text-[10px] font-mono uppercase text-text-secondary tracking-widest font-bold">Produtividade</label>
                             <span className="text-xs font-bold text-blue-600">{formData.productivity}%</span>
                          </div>
                          <input 
                            type="range" 
                            className="w-full h-1.5 bg-border-primary rounded-lg appearance-none cursor-pointer accent-blue-500" 
                            min="0" 
                            max="100" 
                            value={formData.productivity}
                            onChange={(e) => setFormData({...formData, productivity: parseInt(e.target.value)})}
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-[10px] font-mono uppercase text-text-secondary tracking-widest font-bold">Condição Climática</label>
                          <div className="grid grid-cols-2 gap-2">
                            {['Seco', 'Úmido'].map(w => (
                              <button 
                                key={w}
                                onClick={() => setFormData({...formData, weather: w})}
                                className={cn(
                                  "rounded-xl border p-3 text-xs font-bold transition-all uppercase tracking-widest",
                                  formData.weather === w ? "border-blue-500 bg-blue-500/10 text-blue-600" : "border-border-primary bg-bg-primary text-text-secondary hover:border-blue-500/30"
                                )}
                              >
                                {w}
                              </button>
                            ))}
                          </div>
                        </div>

                        <button 
                          onClick={handleRunAnalysis}
                          disabled={isAnalyzing}
                          className="mt-6 w-full group relative overflow-hidden rounded-xl bg-blue-600 px-6 py-4 font-bold text-white transition-all hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-500/20"
                        >
                          <div className="flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
                            {isAnalyzing ? (
                              <>
                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                                  <BrainCircuit className="h-5 w-5" />
                                </motion.div>
                                Analisando...
                              </>
                            ) : (
                              <>
                                <Zap className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                Iniciar Predição
                              </>
                            )}
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* System Status */}
                  <div className="rounded-2xl border border-border-primary bg-bg-secondary p-5 space-y-4 shadow-sm">
                     <h4 className="text-[10px] font-mono uppercase text-text-secondary tracking-widest font-bold">Diagnose em Tempo Real</h4>
                     <div className="space-y-3">
                        <div className="flex items-center justify-between">
                           <span className="text-xs text-text-secondary flex items-center gap-2"><Clock className="h-3 w-3" /> Latência IA</span>
                           <span className="text-[10px] font-mono font-bold text-emerald-600">12ms</span>
                        </div>
                        <div className="flex items-center justify-between">
                           <span className="text-xs text-text-secondary flex items-center gap-2"><Droplets className="h-3 w-3" /> Sensores</span>
                           <span className="text-[10px] font-mono font-bold text-emerald-600">Ativos (42)</span>
                        </div>
                        <div className="h-1.5 w-full bg-border-primary rounded-full overflow-hidden">
                           <motion.div 
                              animate={{ x: [-100, 400] }} 
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }} 
                              className="h-full w-20 bg-blue-500/30"
                           />
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Analysis Tab */}
          {activeTab === 'analysis' && (
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="space-y-8"
            >
               {/* Header Analysis */}
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                 <div className="max-w-2xl">
                   <h2 className="text-3xl font-black text-text-primary tracking-tighter uppercase">Inteligência de Causa Raiz</h2>
                   <p className="mt-2 text-text-secondary text-lg">Decomposição analítica: Entenda os fatores que impulsionam o desperdício em tempo real.</p>
                 </div>
                 <div className="flex gap-3">
                   <select 
                    className="rounded-xl border border-border-primary bg-bg-secondary px-4 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-blue-500/50 shadow-sm"
                    value={analysisParams.material}
                    onChange={(e) => setAnalysisParams(p => ({ ...p, material: e.target.value }))}
                   >
                     {risks.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                   </select>
                 </div>
               </div>

               <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                 {/* Left: Causal Controls */}
                 <div className="lg:col-span-4 space-y-6">
                    <div className="rounded-3xl border border-border-primary bg-bg-secondary p-8 shadow-xl">
                       <div className="mb-8 flex items-center gap-3">
                          <div className="rounded-lg bg-blue-500/20 p-2 text-blue-600 dark:text-blue-400">
                             <Settings2 className="h-5 w-5" />
                          </div>
                          <h3 className="font-bold text-text-primary uppercase tracking-widest text-xs">Simulador de Hipóteses</h3>
                       </div>

                       <div className="space-y-8">
                         <div className="space-y-4">
                           <div className="flex justify-between">
                              <label className="text-[10px] font-mono text-text-secondary uppercase tracking-widest font-bold">Produtividade Equipe</label>
                              <span className="text-xs font-bold text-blue-600">{analysisParams.productivity}%</span>
                           </div>
                           <input 
                              type="range" 
                              className="w-full h-1.5 bg-border-primary rounded-lg appearance-none cursor-pointer accent-blue-500" 
                              value={analysisParams.productivity}
                              onChange={(e) => setAnalysisParams(p => ({ ...p, productivity: parseInt(e.target.value) }))}
                           />
                           <p className="text-[10px] text-text-secondary italic">Uma queda de 10% na produtividade aumenta o risco em ~4%.</p>
                         </div>

                         <div className="space-y-4">
                            <label className="text-[10px] font-mono text-text-secondary uppercase tracking-widest font-bold">Condição Climática</label>
                            <div className="grid grid-cols-3 gap-2">
                               {['Seco', 'Úmido', 'Extremo'].map(w => (
                                 <button 
                                    key={w}
                                    onClick={() => setAnalysisParams(p => ({ ...p, weather: w }))}
                                    className={cn(
                                      "rounded-xl border py-2 text-[10px] font-bold transition-all uppercase tracking-widest",
                                      analysisParams.weather === w 
                                        ? "border-blue-500 bg-blue-500/10 text-blue-600" 
                                        : "border-border-primary bg-bg-primary text-text-secondary hover:border-blue-500/30"
                                    )}
                                 >
                                   {w}
                                 </button>
                               ))}
                            </div>
                         </div>

                         <div className="space-y-4">
                           <div className="flex justify-between">
                              <label className="text-[10px] font-mono text-text-secondary uppercase tracking-widest font-bold">Eficiência Logística</label>
                              <span className="text-xs font-bold text-emerald-600">{analysisParams.logistics}%</span>
                           </div>
                           <input 
                              type="range" 
                              className="w-full h-1.5 bg-border-primary rounded-lg appearance-none cursor-pointer accent-emerald-500" 
                              value={analysisParams.logistics}
                              onChange={(e) => setAnalysisParams(p => ({ ...p, logistics: parseInt(e.target.value) }))}
                           />
                         </div>

                         <div className="rounded-2xl bg-blue-500/5 border border-blue-500/10 p-5 shadow-inner">
                           <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400">
                             <Info className="h-4 w-4" />
                             <span className="text-[10px] font-bold uppercase tracking-widest">IA Insight</span>
                           </div>
                           <p className="text-xs text-text-secondary leading-relaxed">
                             Se a produtividade subir para <span className="text-text-primary font-bold">95%</span>, a perda estimada de <span className="text-text-primary font-bold">{analysisParams.material}</span> cai para <span className="text-emerald-600 font-bold">~4.2%</span>.
                           </p>
                         </div>
                       </div>
                    </div>
                 </div>

                 {/* Center/Right: Visual Analysis */}
                 <div className="lg:col-span-8 space-y-6">
                    {/* Risk Summary Card */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="rounded-3xl border border-border-primary bg-bg-secondary p-8 shadow-sm">
                          <p className="text-[10px] font-mono text-text-secondary uppercase tracking-widest font-bold mb-2">Risco Simulado</p>
                          <div className="flex items-baseline gap-2">
                             <h4 className={cn(
                               "text-6xl font-black tracking-tighter",
                               analysisRiskScore > 70 ? "text-red-500" : analysisRiskScore > 40 ? "text-amber-500" : "text-emerald-500"
                             )}>
                               {analysisRiskScore.toFixed(0)}%
                             </h4>
                             <span className="text-xs font-black text-text-secondary uppercase opacity-50">Score Preditivo</span>
                          </div>
                          <p className="mt-4 text-xs text-text-secondary leading-relaxed">
                             <span className="text-text-primary font-bold uppercase text-[10px] tracking-widest">Diagnóstico</span>
                             <br />
                             {
                               analysisRiskScore > 70 
                                 ? "O risco é crítico devido à combinação de fatores climáticos adversos e baixa eficiência de execução."
                                 : "Operação dentro dos parâmetros de normalidade, mas requer atenção à logística."
                             }
                          </p>
                       </div>

                       <div className="rounded-3xl border border-border-primary bg-bg-secondary p-8 shadow-sm">
                          <p className="text-[10px] font-mono text-text-secondary uppercase tracking-widest font-bold mb-6">Decomposição de Fatores</p>
                          <div className="h-32 w-full">
                             <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={factorDecomposition} layout="vertical">
                                   <XAxis type="number" hide />
                                   <YAxis dataKey="name" type="category" stroke="currentColor" className="text-text-secondary" fontSize={10} width={70} axisLine={false} tickLine={false} />
                                   <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '8px' }} />
                                   <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={10} />
                                </BarChart>
                             </ResponsiveContainer>
                          </div>
                       </div>
                    </div>

                    {/* Trend Chart */}
                    <div className="rounded-3xl border border-border-primary bg-bg-secondary p-8 shadow-sm">
                       <div className="mb-8 flex items-center justify-between">
                          <div>
                             <h3 className="text-lg font-bold text-text-primary tracking-tight">Tendência de Risco (Sete Dias)</h3>
                             <p className="text-xs text-text-secondary font-mono">Padrões históricos de comportamento preditivo</p>
                          </div>
                          <div className="flex items-center gap-2 text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                             <Clock className="h-3.5 w-3.5" />
                             <span className="text-[10px] font-black uppercase tracking-widest">Alta</span>
                          </div>
                       </div>
                       <div className="h-64 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                             <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border-primary" vertical={false} />
                                <XAxis dataKey="day" stroke="currentColor" className="text-text-secondary" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="currentColor" className="text-text-secondary" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip 
                                   contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '12px' }}
                                   itemStyle={{ color: 'var(--text-primary)' }}
                                />
                                <Line 
                                   type="monotone" 
                                   dataKey="risk" 
                                   stroke="#3b82f6" 
                                   strokeWidth={4} 
                                   dot={{ fill: '#3b82f6', r: 6, strokeWidth: 0 }} 
                                   activeDot={{ r: 8, strokeWidth: 0 }}
                                />
                             </LineChart>
                          </ResponsiveContainer>
                       </div>
                    </div>
                 </div>
               </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Mobile Navigation - Only visible on small screens */}
      <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around border-t border-border-primary bg-bg-secondary/90 p-4 backdrop-blur-xl lg:hidden">
        <button onClick={() => setActiveTab('dashboard')} className={cn("p-2", activeTab === 'dashboard' ? "text-blue-500" : "text-text-secondary")}>
          <LayoutDashboard className="h-6 w-6" />
        </button>
        <button onClick={() => setActiveTab('analysis')} className={cn("p-2", activeTab === 'analysis' ? "text-blue-500" : "text-text-secondary")}>
          <BarChart3 className="h-6 w-6" />
        </button>
        <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 text-text-secondary">
          {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
        </button>
         <button className="p-2 text-text-secondary">
          <Settings className="h-6 w-6" />
        </button>
      </nav>
    </div>
  );
}
