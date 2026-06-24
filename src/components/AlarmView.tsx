import React from "react";
import { 
  AlertTriangle, 
  Check, 
  ShieldAlert, 
  ArrowUpRight, 
  BellRing, 
  CheckCircle2, 
  History,
  TrendingUp,
  UserCheck
} from "lucide-react";
import { Alarm, UserRole } from "../types";

interface AlarmViewProps {
  alarms: Alarm[];
  onAcknowledge: (id: string) => void;
  onResolve: (id: string) => void;
  onEscalate: (id: string) => void;
  userRole: UserRole;
}

export default function AlarmView({
  alarms,
  onAcknowledge,
  onResolve,
  onEscalate,
  userRole
}: AlarmViewProps) {
  const activeAlarms = alarms.filter(a => a.status === "Active" || a.status === "Acknowledged");
  const resolvedAlarms = alarms.filter(a => a.status === "Resolved");

  const criticalCount = activeAlarms.filter(a => a.severity === "Critical").length;
  const highCount = activeAlarms.filter(a => a.severity === "High").length;
  const mediumCount = activeAlarms.filter(a => a.severity === "Medium").length;
  const lowCount = activeAlarms.filter(a => a.severity === "Low").length;

  const isEngineer = userRole !== "Operator"; // Engineers & Admins can write changes

  return (
    <div className="space-y-6 text-slate-300 font-sans" id="alarms-view">
      
      {/* Title block */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center">
          <BellRing size={20} className="text-rose-500 mr-2 shrink-0 animate-pulse" />
          Hardware Safety Interlocks & Alarms
        </h1>
        <p className="text-xs text-slate-400">
          Industrial safety console monitoring over-temperature conditions, voltage ripple excursions, and beam interlocks.
        </p>
      </div>

      {/* Alarm Statistics grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        <div className="bg-[#161a23] p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
          <span className="text-slate-500 font-bold text-[10px] uppercase">Active Critical</span>
          <div className="flex items-baseline space-x-1 mt-1">
            <span className={`text-2xl font-black ${criticalCount > 0 ? "text-rose-400 animate-pulse" : "text-slate-400"}`}>
              {criticalCount}
            </span>
          </div>
          <span className="text-[9px] text-slate-500 mt-2">Requires immediate SCADA swap</span>
        </div>
        <div className="bg-[#161a23] p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
          <span className="text-slate-500 font-bold text-[10px] uppercase">High Priority</span>
          <div className="flex items-baseline space-x-1 mt-1">
            <span className={`text-2xl font-black ${highCount > 0 ? "text-amber-400" : "text-slate-400"}`}>
              {highCount}
            </span>
          </div>
          <span className="text-[9px] text-slate-500 mt-2">Thermal loop excursions</span>
        </div>
        <div className="bg-[#161a23] p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
          <span className="text-slate-500 font-bold text-[10px] uppercase">Medium & Low</span>
          <div className="flex items-baseline space-x-1 mt-1">
            <span className="text-2xl font-black text-slate-300">
              {mediumCount + lowCount}
            </span>
          </div>
          <span className="text-[9px] text-slate-500 mt-2">Filter ripple deviations</span>
        </div>
        <div className="bg-[#161a23] p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
          <span className="text-slate-500 font-bold text-[10px] uppercase">Acknowledged Alarms</span>
          <div className="flex items-baseline space-x-1 mt-1">
            <span className="text-2xl font-black text-blue-400">
              {activeAlarms.filter(a => a.status === "Acknowledged").length}
            </span>
          </div>
          <span className="text-[9px] text-slate-500 mt-2">Being triaged by shift teams</span>
        </div>
      </div>

      {/* Primary active alarms listing */}
      <div className="bg-[#161a23] border border-slate-800 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center">
          <ShieldAlert size={15} className="text-rose-500 mr-2" />
          Active Interlocks & Safety Trips ({activeAlarms.length})
        </h2>

        <div className="space-y-3">
          {activeAlarms.length === 0 ? (
            <div className="p-8 text-center text-slate-500 font-mono text-xs border border-dashed border-slate-800 rounded-xl">
              All safety interlock thresholds normal. No pending hardware alarms.
            </div>
          ) : (
            activeAlarms.map((alarm) => (
              <div 
                key={alarm.id} 
                className={`p-4 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all ${
                  alarm.severity === "Critical" 
                    ? "bg-rose-950/20 border-rose-500/25" 
                    : alarm.severity === "High" 
                    ? "bg-amber-950/15 border-amber-500/20" 
                    : "bg-[#0b0e14]/50 border-slate-800"
                }`}
                id={`alarm-card-${alarm.id}`}
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-blue-400 text-xs">{alarm.id}</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold font-mono uppercase ${
                      alarm.severity === "Critical" 
                        ? "bg-rose-500/20 text-rose-400" 
                        : alarm.severity === "High" 
                        ? "bg-amber-500/20 text-amber-400" 
                        : "bg-slate-800 text-slate-400"
                    }`}>
                      {alarm.severity}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Converter: <strong className="text-slate-200">{alarm.assetId}</strong></span>
                    {alarm.status === "Acknowledged" && (
                      <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-500/10 text-[9px] font-bold font-mono">
                        <UserCheck size={10} />
                        <span>ACK BY: {alarm.assignedUser}</span>
                      </span>
                    )}
                  </div>
                  <h3 className="font-sans font-bold text-xs text-slate-200">{alarm.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">{alarm.description}</p>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Tripped: {new Date(alarm.timestamp).toLocaleString()} • Escalation level: {alarm.escalationLevel}
                  </div>
                </div>

                {/* Operator controls */}
                <div className="flex space-x-2 self-end md:self-center shrink-0">
                  {alarm.status === "Active" && isEngineer && (
                    <button
                      onClick={() => onAcknowledge(alarm.id)}
                      id={`btn-ack-${alarm.id}`}
                      className="px-3.5 py-1.5 bg-blue-950 hover:bg-blue-900 text-blue-400 border border-blue-500/25 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all cursor-pointer"
                    >
                      <Check size={12} />
                      <span>Acknowledge</span>
                    </button>
                  )}
                  {isEngineer && (
                    <>
                      <button
                        onClick={() => onResolve(alarm.id)}
                        id={`btn-resolve-${alarm.id}`}
                        className="px-3.5 py-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-500/25 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all cursor-pointer"
                      >
                        <CheckCircle2 size={12} />
                        <span>Resolve</span>
                      </button>
                      <button
                        onClick={() => onEscalate(alarm.id)}
                        id={`btn-escalate-${alarm.id}`}
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all cursor-pointer"
                        title="Escalate critical priority"
                      >
                        <ArrowUpRight size={12} />
                        <span>Escalate</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* History log block */}
      <div className="bg-[#161a23] border border-slate-800 rounded-xl p-5 space-y-4 font-mono text-xs">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center font-sans">
          <History size={15} className="text-slate-400 mr-2" />
          Resolved Alarms Ledger (Audit Archive)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-[#0f121a] text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Asset</th>
                <th className="px-4 py-2">Severity</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Audit Timestamp</th>
                <th className="px-4 py-2 text-right">State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-[11px] text-slate-400">
              {resolvedAlarms.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-slate-600">
                    No historic records in the active buffer session.
                  </td>
                </tr>
              ) : (
                resolvedAlarms.map((alarm) => (
                  <tr key={alarm.id} className="hover:bg-[#0f121a]/50">
                    <td className="px-4 py-2 font-bold text-slate-500">{alarm.id}</td>
                    <td className="px-4 py-2 text-slate-300">{alarm.assetId}</td>
                    <td className="px-4 py-2 uppercase font-bold text-[9px]">{alarm.severity}</td>
                    <td className="px-4 py-2 font-sans truncate max-w-xs">{alarm.title}</td>
                    <td className="px-4 py-2 text-slate-500">{new Date(alarm.timestamp).toLocaleTimeString()}</td>
                    <td className="px-4 py-2 text-right">
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-[#0b0e14] text-slate-500 font-bold text-[9px]">
                        RESOLVED
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
