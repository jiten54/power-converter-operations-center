import React, { useState } from "react";
import { 
  Database, 
  Terminal, 
  Play, 
  RefreshCw, 
  Layers, 
  Info, 
  ChevronRight, 
  Search,
  CheckCircle,
  FileCode
} from "lucide-react";

export default function SQLView() {
  const [query, setQuery] = useState("SELECT id, name, status, voltage, current FROM assets;");
  const [results, setResults] = useState<{ rows: any[]; columns: string[]; error?: string } | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const executeSQL = async () => {
    setIsExecuting(true);
    setResults(null);
    try {
      const response = await fetch("/api/sql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });
      const data = await response.json();
      setResults(data);
    } catch (err: any) {
      setResults({ rows: [], columns: [], error: `Connection failed: ${err.message}` });
    } finally {
      setIsExecuting(false);
    }
  };

  // Structured schemas list
  const tablesSchema = [
    { name: "users", desc: "Operations & engineering personnel accounts", cols: ["id (PK)", "email", "name", "role", "status"] },
    { name: "assets", desc: "Power converter physical hardware units", cols: ["id (PK)", "name", "type", "location", "status", "voltage", "current", "temperature", "efficiency", "healthScore"] },
    { name: "alarms", desc: "Active interlock faults & safety threshold alerts", cols: ["id (PK)", "assetId (FK)", "severity", "title", "description", "timestamp", "status", "assignedUser"] },
    { name: "maintenance_records", desc: "Inspections, dielectric test reports, & swap schedules", cols: ["id (PK)", "assetId (FK)", "type", "title", "description", "status", "assignedEngineer", "date", "nextDate"] },
    { name: "support_tickets", desc: "Incident filings, bugs, & change requests", cols: ["id (PK)", "title", "description", "severity", "status", "type", "rca", "resolution", "date"] }
  ];

  return (
    <div className="space-y-6 text-slate-300 font-sans" id="sql-view">
      
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center">
          <Database size={20} className="text-blue-500 mr-2" />
          PostgreSQL Interactive SQL Playground
        </h1>
        <p className="text-xs text-slate-400">
          Query physical schema tables in-memory. Demonstrates structural layouts normalized for high-availability enterprise migrations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Schemas & relations browser */}
        <div className="space-y-4 font-mono text-xs animate-fade-in">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center font-sans">
            <Layers size={15} className="text-indigo-400 mr-2" />
            Oracle / PG Schema definitions
          </h2>

          <div className="bg-[#161a23] border border-slate-800 p-4 rounded-xl space-y-4">
            <div className="space-y-3">
              {tablesSchema.map((sch) => (
                <div key={sch.name} className="bg-[#0b0e14] p-3 rounded-lg border border-slate-850 space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-bold text-blue-400">
                    <span>TABLE: {sch.name}</span>
                  </div>
                  <p className="text-[10px] font-sans text-slate-400 leading-normal mb-1">{sch.desc}</p>
                  <div className="flex flex-wrap gap-1 font-mono text-[9px]">
                    {sch.cols.map(c => (
                      <span key={c} className="bg-[#161a23] border border-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Ingress note */}
            <div className="bg-blue-950/20 border border-blue-500/10 p-3 rounded-lg flex items-start space-x-2 text-[10px] text-blue-400 font-sans">
              <Info size={14} className="shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Physical tables utilize explicit foreign keys (<code className="font-mono text-[9px] bg-blue-500/15 px-1 py-0.2 rounded">FK</code>) binding alarms and maintenance schedules to core asset rows for perfect referential compliance.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: SQL compiler & query console */}
        <div className="lg:col-span-2 space-y-4 animate-fade-in">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center font-sans">
            <Terminal size={15} className="text-blue-400 mr-2" />
            Interactive SQL Text Editor
          </h2>

          <div className="bg-[#161a23] border border-slate-800 rounded-xl overflow-hidden flex flex-col font-mono text-xs shadow-xl">
            <div className="bg-[#0b0e14] p-3 border-b border-slate-800/80 flex justify-between items-center shrink-0">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                SQL Console Input
              </span>
              <button
                onClick={executeSQL}
                disabled={isExecuting}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[11px] font-bold flex items-center space-x-1 cursor-pointer transition-all shadow-md shadow-blue-500/10"
                id="btn-run-sql"
              >
                <Play size={10} />
                <span>{isExecuting ? "Executing..." : "Execute Query"}</span>
              </button>
            </div>

            {/* SQL textarea editor */}
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={4}
              className="w-full bg-[#0b0e14] p-4 font-mono text-[11px] leading-relaxed text-blue-400 focus:outline-none border-b border-slate-800 resize-none h-[110px]"
            />

            {/* Query Outputs Results Block */}
            <div className="p-4 flex-1 bg-[#0b0e14]/40 min-h-[180px]">
              {results === null ? (
                <div className="text-slate-500 text-center py-10 font-sans">
                  Write SQL SELECT query above and click "Execute Query" to see rows output...
                </div>
              ) : results.error ? (
                <div className="bg-rose-950/20 border border-rose-500/20 p-3 rounded-lg text-rose-400 text-[11px] leading-normal flex items-start space-x-1.5">
                  <span className="font-bold text-[10px] uppercase block shrink-0">SQL Error:</span>
                  <p>{results.error}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] text-slate-500 pb-1.5 border-b border-slate-800/60">
                    <span className="flex items-center text-emerald-400 font-bold font-sans">
                      <CheckCircle size={10} className="mr-1" />
                      Query executed successfully
                    </span>
                    <span>{results.rows.length} rows returned</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-[10px] leading-relaxed text-slate-300">
                      <thead>
                        <tr className="border-b border-slate-800 bg-[#0b0e14] text-slate-400 uppercase font-bold">
                          {results.columns.map((col) => (
                            <th key={col} className="px-3 py-1.5">{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-400">
                        {results.rows.length === 0 ? (
                          <tr>
                            <td colSpan={results.columns.length} className="p-3 text-center text-slate-600 font-sans">
                              Empty result set. No records matched criteria.
                            </td>
                          </tr>
                        ) : (
                          results.rows.map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-800/10">
                              {results.columns.map((col) => (
                                <td key={col} className="px-3 py-1.5 font-bold text-slate-300">
                                  {row[col] !== null ? String(row[col]) : <em className="text-slate-600">NULL</em>}
                                </td>
                              ))}
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
