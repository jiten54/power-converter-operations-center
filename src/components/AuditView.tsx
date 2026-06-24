import React from "react";
import { History, Shield, Clock, FileText } from "lucide-react";
import { AuditLog } from "../types";

interface AuditViewProps {
  logs: AuditLog[];
}

export default function AuditView({ logs }: AuditViewProps) {
  return (
    <div className="space-y-6 text-slate-300 font-sans" id="audit-logs-view">
      
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center">
          <History size={20} className="text-blue-500 mr-2" />
          Chronological Operations Audit Ledger
        </h1>
        <p className="text-xs text-slate-400">
          Permanent ledger tracking shift activities, interlock status shifts, database edits, and deployment triggers.
        </p>
      </div>

      {/* Main Audit log list */}
      <div className="bg-[#161a23] border border-slate-800 rounded-xl overflow-hidden font-mono text-xs animate-fade-in shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" id="audit-table">
            <thead>
              <tr className="border-b border-slate-800 bg-[#0b0e14] text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <th className="px-5 py-3">Log ID</th>
                <th className="px-5 py-3">Timestamp (UTC)</th>
                <th className="px-5 py-3">User</th>
                <th className="px-5 py-3">Module</th>
                <th className="px-5 py-3">Action Headline</th>
                <th className="px-5 py-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-slate-300">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-600">
                    No logs archived inside this active session buffer.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-850/20 transition-all">
                    <td className="px-5 py-3.5 font-bold text-blue-400">{log.id}</td>
                    <td className="px-5 py-3.5 text-slate-500">
                      {new Date(log.timestamp).toISOString().replace("T", " ").substring(0, 19)}
                    </td>
                    <td className="px-5 py-3.5 font-sans font-semibold text-slate-200">{log.user}</td>
                    <td className="px-5 py-3.5">
                      <span className="bg-[#0b0e14] border border-slate-800/60 px-2 py-0.5 rounded text-indigo-400 font-bold uppercase text-[9px]">
                        {log.module}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-sans text-slate-200 font-semibold">{log.action}</td>
                    <td className="px-5 py-3.5 font-sans text-slate-400 leading-normal max-w-sm truncate" title={log.details}>
                      {log.details}
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
