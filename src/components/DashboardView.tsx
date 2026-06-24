import React from "react";
import { 
  ShieldAlert, 
  Cpu, 
  CheckCircle, 
  AlertTriangle, 
  Wrench, 
  LifeBuoy, 
  TrendingUp, 
  Users, 
  Layers, 
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { Asset, Alarm, MaintenanceRecord, SupportTicket, Sprint, User } from "../types";

interface DashboardViewProps {
  assets: Asset[];
  alarms: Alarm[];
  maintenance: MaintenanceRecord[];
  tickets: SupportTicket[];
  sprints: Sprint[];
  setActiveTab: (tab: string) => void;
  currentUser: User | null;
}

export default function DashboardView({
  assets,
  alarms,
  maintenance,
  tickets,
  sprints,
  setActiveTab,
  currentUser
}: DashboardViewProps) {
  // Compute analytics metrics
  const totalAssets = assets.length;
  const activeAssets = assets.filter(a => a.status === "Active").length;
  const offlineAssets = assets.filter(a => a.status === "Offline").length;
  const warnAssets = assets.filter(a => a.status === "Warning").length;
  
  const activeAlarms = alarms.filter(a => a.status === "Active" || a.status === "Acknowledged");
  const criticalAlarms = activeAlarms.filter(a => a.severity === "Critical").length;
  const highAlarms = activeAlarms.filter(a => a.severity === "High").length;
  
  const dueMaintenance = maintenance.filter(m => m.status === "Scheduled" || m.status === "In Progress").length;
  const openTickets = tickets.filter(t => t.status !== "Resolved").length;
  const activeSprint = sprints.find(s => s.status === "Active");

  // Mock Active Engineers on shift
  const operators = [
    { name: "Dr. Sarah Jenkins", role: "Power Converter Engineer", status: "In Control Room", contact: "Ext 4012" },
    { name: "Marc Dubois", role: "Maintenance Engineer", status: "Field Work: BA3 SPS", contact: "Ext 2291" },
    { name: "Elena Rostova", role: "Operator", status: "Console Active", contact: "Ext 9942" }
  ];

  return (
    <div className="space-y-6 font-sans text-slate-300 animate-fade-in" id="dashboard-view">
      
      {/* Dynamic Welcome Banner */}
      <div className="bg-[#161a23] border border-slate-800 rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent pointer-events-none"></div>
        <div className="space-y-1 relative z-10">
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center">
            Welcome back, {currentUser?.name} 
            <span className="text-xs bg-blue-500/15 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full ml-3 tracking-wide uppercase font-mono">
              System Admin
            </span>
          </h1>
          <p className="text-xs text-slate-400">
            LHC injector chain, SPS, and PS power systems are operating stably. Real-time telemetry is synced.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3 relative z-10">
          <button 
            onClick={() => setActiveTab("monitoring")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-500/15 hover:shadow-blue-500/20 transition-all duration-200 flex items-center space-x-1 cursor-pointer"
          >
            <span>Telemetry Cockpit</span>
            <ExternalLink size={12} />
          </button>
        </div>
      </div>

      {/* Primary KPI Indicator Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Active Converters */}
        <div className="bg-[#161a23] p-4 rounded-xl border border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">Operational Assets</span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-2xl font-extrabold text-white font-mono">{activeAssets}</span>
              <span className="text-slate-500 text-xs">/ {totalAssets}</span>
            </div>
            <div className="flex space-x-2 text-[9px] font-mono text-slate-400">
              <span className="text-emerald-400">● {activeAssets} Active</span>
              <span className="text-amber-400">▲ {warnAssets} Warn</span>
              <span className="text-rose-500">■ {offlineAssets} Off</span>
            </div>
          </div>
          <div className="p-3 bg-blue-500/5 rounded-xl border border-blue-500/10 text-blue-400">
            <Cpu size={20} />
          </div>
        </div>

        {/* KPI 2: Alarm Severity counts */}
        <div className="bg-[#161a23] p-4 rounded-xl border border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">Active Alarms</span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-2xl font-extrabold text-white font-mono">{activeAlarms.length}</span>
              {activeAlarms.length > 0 && (
                <span className="text-xs bg-rose-500/10 text-rose-400 font-semibold px-1.5 py-0.2 rounded font-mono animate-pulse">
                  ALERT
                </span>
              )}
            </div>
            <div className="flex space-x-2 text-[9px] font-mono">
              <span className="text-rose-500 font-bold">● {criticalAlarms} Critical</span>
              <span className="text-amber-500 font-semibold">▲ {highAlarms} High</span>
            </div>
          </div>
          <div className={`p-3 rounded-xl border transition-all ${
            activeAlarms.length > 0 ? "bg-rose-500/15 border-rose-500/20 text-rose-400" : "bg-slate-800/80 border-slate-700 text-slate-400"
          }`}>
            <ShieldAlert size={20} />
          </div>
        </div>

        {/* KPI 3: Scheduled maintenance */}
        <div className="bg-[#161a23] p-4 rounded-xl border border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">Maintenance Pipeline</span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-2xl font-extrabold text-white font-mono">{dueMaintenance}</span>
              <span className="text-slate-500 text-xs">Work Orders</span>
            </div>
            <div className="text-[9px] font-mono text-slate-400">
              Next scheduled: <span className="text-blue-400 font-semibold">Tomorrow 09:00</span>
            </div>
          </div>
          <div className="p-3 bg-amber-500/5 rounded-xl border border-amber-500/10 text-amber-400">
            <Wrench size={20} />
          </div>
        </div>

        {/* KPI 4: Pending incident requests */}
        <div className="bg-[#161a23] p-4 rounded-xl border border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">Pending Support</span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-2xl font-extrabold text-white font-mono">{openTickets}</span>
              <span className="text-slate-500 text-xs">Open Incidents</span>
            </div>
            <div className="text-[9px] font-mono text-emerald-400">
              Avg resolution: <span className="font-semibold">3.2 hours</span>
            </div>
          </div>
          <div className="p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10 text-indigo-400">
            <LifeBuoy size={20} />
          </div>
        </div>

      </div>

      {/* Main Multi-Column Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Alarms Alert Feed & Sprint Progress */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section: Live Alarm Queue */}
          <div className="bg-[#161a23] border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center">
                <AlertTriangle size={15} className="text-amber-400 mr-2" />
                Active Alarms Queue
              </h2>
              <button 
                onClick={() => setActiveTab("alarms")}
                className="text-[10px] font-bold text-blue-400 hover:text-blue-300 uppercase tracking-widest flex items-center space-x-0.5 cursor-pointer"
              >
                <span>Full Console</span>
                <ChevronRight size={11} />
              </button>
            </div>

            <div className="space-y-2">
              {alarms.filter(a => a.status !== "Resolved").length === 0 ? (
                <div className="p-4 bg-[#0b0e14]/50 rounded-lg text-center text-xs text-slate-500 border border-slate-800/60">
                  Perfect Status. All system alarms resolved.
                </div>
              ) : (
                alarms.filter(a => a.status !== "Resolved").slice(0, 3).map((alarm) => (
                  <div 
                    key={alarm.id} 
                    className={`p-3.5 rounded-lg border flex justify-between items-start ${
                      alarm.severity === "Critical" 
                        ? "bg-[#0b0e14] border-rose-500/30" 
                        : alarm.severity === "High" 
                        ? "bg-[#0b0e14] border-amber-500/30" 
                        : "bg-[#0b0e14]/50 border-slate-800"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className={`text-[9px] font-extrabold font-mono px-2 py-0.5 rounded-full ${
                          alarm.severity === "Critical" 
                            ? "bg-rose-500/20 text-rose-400" 
                            : alarm.severity === "High" 
                            ? "bg-amber-500/20 text-amber-400" 
                            : "bg-slate-800 text-slate-400"
                        }`}>
                          {alarm.severity}
                        </span>
                        <span className="text-xs font-semibold text-slate-200">{alarm.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-mono pl-1">
                        Converter: <strong className="text-slate-300">{alarm.assetId}</strong> • {alarm.description}
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono shrink-0">
                      {new Date(alarm.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Section: Agile Sprint Board summary */}
          <div className="bg-[#161a23] border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center">
                <Layers size={15} className="text-blue-400 mr-2" />
                Active Scrum Sprint: {activeSprint?.name}
              </h2>
              <button 
                onClick={() => setActiveTab("scrum")}
                className="text-[10px] font-bold text-blue-400 hover:text-blue-300 uppercase tracking-widest flex items-center space-x-0.5 cursor-pointer"
              >
                <span>Agile Board</span>
                <ChevronRight size={11} />
              </button>
            </div>

            {activeSprint && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#0b0e14]/40 p-4 rounded-xl border border-slate-800">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">Sprint Timeline</span>
                  <p className="text-xs font-semibold text-slate-200 font-mono">
                    {activeSprint.startDate} to {activeSprint.endDate}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">Velocity Progress</span>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-[#0b0e14] rounded-full h-1.5 overflow-hidden border border-slate-800">
                      <div 
                        className="bg-blue-500 h-full rounded-full" 
                        style={{ width: `${(activeSprint.actualVelocity / activeSprint.velocityGoal) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-slate-200 font-bold font-mono">
                      {activeSprint.actualVelocity}/{activeSprint.velocityGoal} SP
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">Current Focus</span>
                  <p className="text-xs text-slate-200 font-bold truncate">
                    High Stability Solid State Breakers
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: On-Shift Team & System Analytics Quick Link */}
        <div className="space-y-6">
          
          {/* On-Shift Team Engineers */}
          <div className="bg-[#161a23] border border-slate-800 rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center">
              <Users size={15} className="text-indigo-400 mr-2" />
              On-Shift Experts
            </h2>
            <div className="space-y-3">
              {operators.map((op, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-[#0b0e14]/50 rounded-lg border border-slate-800">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded bg-[#161a23] flex items-center justify-center font-bold text-xs text-indigo-400 font-mono border border-slate-800">
                      {op.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-slate-200">{op.name}</span>
                      <span className="text-[10px] text-indigo-400 font-mono">{op.role}</span>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="text-[9px] font-mono text-emerald-400 flex items-center space-x-1 font-bold">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse mr-1"></span>
                      Active
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono">{op.contact}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Diagnostics Panel */}
          <div className="bg-gradient-to-br from-[#161a23] to-[#0f121a] border border-slate-800 rounded-xl p-5 space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <span className="text-[10px] text-blue-400 font-mono font-bold uppercase tracking-widest">Oracle Migration Readiness</span>
              <h3 className="text-xs font-bold text-slate-100">Physical PostgreSQL Schema Compatibility</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                Physical schemas feature strict relational constraints, normalized tables structure, indexes tracking, and sequential keys designed to directly match Oracle Enterprise DB migration criteria.
              </p>
            </div>
            <button 
              onClick={() => setActiveTab("sql")}
              className="mt-3 w-full py-2 bg-[#161a23] hover:bg-[#0b0e14] text-blue-400 text-xs font-mono font-bold rounded-lg border border-blue-500/15 transition-all duration-200 flex items-center justify-center space-x-1 cursor-pointer"
            >
              <span>Query DB Table Schema (SQL)</span>
              <ChevronRight size={13} />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
