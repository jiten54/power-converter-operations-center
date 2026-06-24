import React, { useState } from "react";
import { 
  Wrench, 
  Plus, 
  Calendar, 
  ClipboardList, 
  Check, 
  User, 
  Clock, 
  CheckCircle, 
  FileText,
  Layers,
  X
} from "lucide-react";
import { MaintenanceRecord, Asset, UserRole } from "../types";

interface MaintenanceViewProps {
  maintenance: MaintenanceRecord[];
  assets: Asset[];
  onCreateMaint: (maint: Omit<MaintenanceRecord, "id" | "status">) => void;
  onUpdateMaint: (id: string, record: Partial<MaintenanceRecord>) => void;
  userRole: UserRole;
}

export default function MaintenanceView({
  maintenance,
  assets,
  onCreateMaint,
  onUpdateMaint,
  userRole
}: MaintenanceViewProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedMaint, setSelectedMaint] = useState<MaintenanceRecord | null>(null);

  // Form states
  const [assetId, setAssetId] = useState(assets[0]?.id || "");
  const [type, setType] = useState<"Preventive" | "Corrective">("Preventive");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedEngineer, setAssignedEngineer] = useState("Marc Dubois");
  const [date, setDate] = useState("");
  const [nextDate, setNextDate] = useState("");

  // Report details state
  const [report, setReport] = useState("");

  const isEngineer = userRole === "System Administrator" || userRole === "Maintenance Engineer" || userRole === "Power Converter Engineer";

  const handleOpenCreate = () => {
    setAssetId(assets[0]?.id || "");
    setType("Preventive");
    setTitle("");
    setDescription("");
    setAssignedEngineer("Marc Dubois");
    setDate(new Date().toISOString().split('T')[0]);
    setNextDate(new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    setShowCreateModal(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateMaint({
      assetId,
      type,
      title,
      description,
      assignedEngineer,
      date,
      nextDate
    });
    setShowCreateModal(false);
  };

  const handleOpenReport = (maint: MaintenanceRecord) => {
    setSelectedMaint(maint);
    setReport(maint.report || "");
    setShowReportModal(true);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMaint) {
      onUpdateMaint(selectedMaint.id, {
        report,
        status: "Completed"
      });
      setShowReportModal(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "In Progress": return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
      case "Scheduled": return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      default: return "bg-slate-800 text-slate-400";
    }
  };

  return (
    <div className="space-y-6 text-slate-300 font-sans" id="maintenance-view">
      
      {/* Title bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Maintenance Operations & Work Orders</h1>
          <p className="text-xs text-slate-400">Log preventive inspections, dielectric insulation tests, and execute trigger system calibrations.</p>
        </div>
        {isEngineer && (
          <button
            onClick={handleOpenCreate}
            id="btn-create-workorder"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-slate-100 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-lg shadow-blue-500/15 cursor-pointer"
          >
            <Plus size={14} />
            <span>Create Work Order</span>
          </button>
        )}
      </div>

      {/* Main Grid: Active records + Calendar visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Work Orders */}
        <div className="lg:col-span-2 space-y-4 animate-fade-in">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center font-sans">
            <ClipboardList size={15} className="text-blue-400 mr-2" />
            Active Maintenance Log Ledger
          </h2>

          <div className="space-y-3">
            {maintenance.map((record) => (
              <div 
                key={record.id} 
                className="bg-[#161a23] border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:border-slate-700/80"
                id={`work-order-${record.id}`}
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                    <span className="font-bold text-blue-400">{record.id}</span>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      record.type === "Preventive" ? "bg-indigo-500/10 text-indigo-400" : "bg-rose-500/10 text-rose-400"
                    }`}>
                      {record.type}
                    </span>
                    <span className="text-slate-400">Target Asset: <strong className="text-slate-200">{record.assetId}</strong></span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </div>
                  
                  <h3 className="font-sans font-bold text-xs text-slate-200">{record.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">{record.description}</p>
                  
                  {record.report && (
                    <div className="bg-[#0b0e14] p-2.5 rounded border border-slate-800/60 text-[11px] font-mono leading-relaxed mt-2 text-slate-400">
                      <strong className="text-blue-400 text-[10px] uppercase block mb-0.5">Post-Intervention Report:</strong>
                      {record.report}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-500 font-mono">
                    <span className="flex items-center space-x-1">
                      <User size={11} />
                      <span>Engineer: {record.assignedEngineer}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Calendar size={11} />
                      <span>Date: {record.date}</span>
                    </span>
                  </div>
                </div>

                {/* Status operations */}
                {record.status !== "Completed" && isEngineer && (
                  <div className="flex space-x-2 shrink-0 self-end md:self-center">
                    {record.status === "Scheduled" && (
                      <button
                        onClick={() => onUpdateMaint(record.id, { status: "In Progress" })}
                        className="px-3 py-1.5 bg-blue-950 hover:bg-blue-900 text-blue-400 border border-blue-500/25 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        Start Work
                      </button>
                    )}
                    {record.status === "In Progress" && (
                      <button
                        onClick={() => handleOpenReport(record)}
                        className="px-3 py-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-500/25 rounded-lg text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                      >
                        <FileText size={12} />
                        <span>Log Report & Complete</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Calendar visualizer mock card */}
        <div className="space-y-4 animate-fade-in">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center font-sans">
            <Calendar size={15} className="text-indigo-400 mr-2" />
            Scheduling Calendar
          </h2>

          <div className="bg-[#161a23] border border-slate-800 p-4 rounded-xl space-y-4 font-mono text-xs">
            <div className="bg-[#0b0e14] p-3 rounded-lg border border-slate-800/60 space-y-2">
              <span className="text-[10px] text-slate-500 font-bold uppercase">This Week's Schedule</span>
              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between items-center border-b border-slate-800/40 pb-1.5">
                  <span className="text-slate-400">Wed (Jun 24)</span>
                  <span className="text-slate-200 font-sans font-medium">Cooling loop swap (In Progress)</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-800/40 pb-1.5">
                  <span className="text-slate-400">Thu (Jun 25)</span>
                  <span className="text-slate-200 font-sans font-medium">Thyratron Trigger Board replacement</span>
                </div>
                <div className="flex justify-between items-center pb-0.5">
                  <span className="text-slate-400">Sat (Jun 27)</span>
                  <span className="text-slate-500 font-sans">Scheduled Backup Tests</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* CREATE WORK ORDER MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#161a23] border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-800 bg-[#0b0e14] flex items-center justify-between">
              <span className="font-bold text-sm text-slate-100 uppercase tracking-wider">Log New Work Order</span>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-100 p-1 rounded-lg cursor-pointer">
                <X size={15} />
              </button>
            </div>
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-slate-400 font-bold">Target Power Converter Asset</label>
                <select
                  value={assetId}
                  onChange={(e) => setAssetId(e.target.value)}
                  className="w-full bg-[#0b0e14] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500/40 cursor-pointer"
                >
                  {assets.map(a => (
                    <option key={a.id} value={a.id}>{a.id} — {a.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold">Classification Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-[#0b0e14] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500/40 cursor-pointer"
                  >
                    <option value="Preventive">Preventive</option>
                    <option value="Corrective">Corrective</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold">Assigned Engineer</label>
                  <input
                    type="text"
                    required
                    value={assignedEngineer}
                    onChange={(e) => setAssignedEngineer(e.target.value)}
                    className="w-full bg-[#0b0e14] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500/40"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-slate-400 font-bold">Work Order Headline Summary</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Dielectric insulation test on capacitor lines"
                  className="w-full bg-[#0b0e14] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500/40"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-400 font-bold">Scope of Intervention Tasks</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe electrical safety protocols and step-by-step diagnostic procedures..."
                  className="w-full bg-[#0b0e14] border border-slate-800 rounded-lg p-2.5 text-slate-200 resize-none font-sans focus:outline-none focus:border-blue-500/40"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold">Scheduled Execution Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#0b0e14] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500/40 cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold">Next Recommended Cycle Date</label>
                  <input
                    type="date"
                    required
                    value={nextDate}
                    onChange={(e) => setNextDate(e.target.value)}
                    className="w-full bg-[#0b0e14] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500/40 cursor-pointer"
                  />
                </div>
              </div>
              <div className="pt-4 border-t border-slate-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-[#0b0e14] text-slate-300 hover:bg-slate-800 border border-slate-800 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-500 rounded-xl flex items-center space-x-1 cursor-pointer"
                >
                  <Check size={13} />
                  <span>Log Work Order</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LOG REPORT MODAL */}
      {showReportModal && selectedMaint && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#161a23] border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-800 bg-[#0b0e14] flex items-center justify-between">
              <span className="font-bold text-sm text-slate-100 uppercase tracking-wider">Log Field Report: {selectedMaint.id}</span>
              <button onClick={() => setShowReportModal(false)} className="text-slate-400 hover:text-slate-100 p-1 rounded-lg cursor-pointer">
                <X size={15} />
              </button>
            </div>
            <form onSubmit={handleReportSubmit} className="p-6 space-y-4 text-xs font-mono">
              <div className="bg-[#0b0e14] p-3 rounded-lg border border-slate-800/60">
                <span className="text-[10px] text-slate-500 font-bold block uppercase mb-1">Intervention Headline</span>
                <p className="text-slate-200 font-sans font-semibold">{selectedMaint.title}</p>
                <p className="text-slate-400 font-sans text-[11px] leading-relaxed mt-1">{selectedMaint.description}</p>
              </div>
              
              <div className="space-y-1">
                <label className="text-slate-400 font-bold">Write Diagnostic & Technical Results</label>
                <textarea
                  required
                  rows={4}
                  value={report}
                  onChange={(e) => setReport(e.target.value)}
                  placeholder="Record actual physical readings e.g., Insulation dielectric loss ratio tan δ = 0.002, resistance values 12 GΩ, and coolant pressure limits stabilized."
                  className="w-full bg-[#0b0e14] border border-slate-800 rounded-lg p-2.5 text-slate-200 resize-none font-mono focus:outline-none focus:border-blue-500/40"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 bg-[#0b0e14] text-slate-300 hover:bg-slate-800 border border-slate-800 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl flex items-center space-x-1 cursor-pointer"
                >
                  <CheckCircle size={13} />
                  <span>Complete Intervention</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
