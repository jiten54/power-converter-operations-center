import React, { useState } from "react";
import { 
  FileCheck, 
  Plus, 
  User, 
  Tag, 
  Layers, 
  History, 
  Sparkles, 
  Check, 
  X,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { Requirement, UserRole } from "../types";

interface RequirementsViewProps {
  requirements: Requirement[];
  onCreateReq: (req: Omit<Requirement, "id" | "status" | "history">) => void;
  onUpdateReqStatus: (id: string, status: Requirement["status"]) => void;
  userRole: UserRole;
}

export default function RequirementsView({
  requirements,
  onCreateReq,
  onUpdateReqStatus,
  userRole
}: RequirementsViewProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedReq, setSelectedReq] = useState<Requirement | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stakeholder, setStakeholder] = useState("");
  const [businessValue, setBusinessValue] = useState<"High" | "Medium" | "Low">("High");
  const [priority, setPriority] = useState<"Critical" | "High" | "Medium" | "Low">("High");

  const isAdmin = userRole === "System Administrator" || userRole === "Power Converter Engineer";

  const handleOpenCreate = () => {
    setTitle("");
    setDescription("");
    setStakeholder("Beam Controls (BE-CO)");
    setBusinessValue("High");
    setPriority("High");
    setShowCreateModal(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateReq({
      title,
      description,
      stakeholder,
      businessValue,
      priority
    });
    setShowCreateModal(false);
  };

  const getStatusColor = (status: Requirement["status"]) => {
    switch (status) {
      case "Approved": return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "Under Review": return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case "Rejected": return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
      case "Scheduled": return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
      default: return "bg-slate-800 text-slate-400 border border-slate-700";
    }
  };

  return (
    <div className="space-y-6 text-slate-300 font-sans" id="requirements-view">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center">
            <FileCheck size={20} className="text-blue-500 mr-2" />
            Stakeholder Requirements Tracking
          </h1>
          <p className="text-xs text-slate-400">Collaboratively outline, verify, prioritize, and approve technical specifications from the physics groups.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          id="btn-propose-req"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-lg cursor-pointer"
        >
          <Plus size={14} />
          <span>Propose Requirement</span>
        </button>
      </div>

      {/* Main listing split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Requirement proposals board */}
        <div className="lg:col-span-2 space-y-4 animate-fade-in">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center">
            <Layers size={15} className="text-blue-400 mr-2" />
            Requirement Specifications Registry
          </h2>

          <div className="space-y-4">
            {requirements.map((req) => (
              <div 
                key={req.id} 
                className="bg-[#161a23] border border-slate-800 p-5 rounded-xl space-y-3 hover:border-slate-700 transition-all cursor-pointer"
                onClick={() => setSelectedReq(req)}
                id={`req-card-${req.id}`}
              >
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div className="flex items-center space-x-2 text-xs font-mono">
                    <span className="font-bold text-blue-400">{req.id}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400 font-sans font-semibold text-[11px] bg-[#0b0e14] px-2 py-0.5 rounded border border-slate-800/60">{req.stakeholder}</span>
                  </div>
                  
                  <div className="flex space-x-2 text-[9px] font-mono font-bold">
                    <span className={`px-2 py-0.5 rounded border ${getStatusColor(req.status)}`}>
                      {req.status}
                    </span>
                    <span className="bg-[#0b0e14] text-indigo-400 border border-slate-800 px-2 py-0.5 rounded">
                      VAL: {req.businessValue}
                    </span>
                    <span className="bg-[#0b0e14] text-rose-400 border border-slate-800 px-2 py-0.5 rounded">
                      PRI: {req.priority}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-sans font-bold text-xs text-slate-100">{req.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans line-clamp-2">{req.description}</p>
                </div>

                {/* Quick actions for Administrators */}
                {req.status === "Under Review" && isAdmin && (
                  <div className="flex space-x-2 pt-2 border-t border-slate-800/60">
                    <button
                      onClick={(e) => { e.stopPropagation(); onUpdateReqStatus(req.id, "Approved"); }}
                      className="px-3 py-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-500/20 rounded text-[10px] font-bold flex items-center space-x-1 cursor-pointer"
                    >
                      <Check size={11} />
                      <span>Approve Spec</span>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onUpdateReqStatus(req.id, "Rejected"); }}
                      className="px-3 py-1 bg-rose-950 hover:bg-rose-900 text-rose-400 border border-rose-500/20 rounded text-[10px] font-bold flex items-center space-x-1 cursor-pointer"
                    >
                      <X size={11} />
                      <span>Reject Spec</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Selected spec history audit */}
        <div className="space-y-4 font-mono text-xs animate-fade-in">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center font-sans">
            <History size={15} className="text-indigo-400 mr-2" />
            Revision Change History
          </h2>

          <div className="bg-[#161a23] border border-slate-800 p-5 rounded-xl space-y-4 font-mono text-xs">
            {selectedReq ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">{selectedReq.id}</span>
                  <h4 className="text-xs font-bold text-slate-100 font-sans">{selectedReq.title}</h4>
                </div>

                <div className="space-y-2 border-t border-slate-800/60 pt-3">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Timeline of changes</span>
                  <div className="space-y-2.5">
                    {selectedReq.history.map((hist, i) => (
                      <div key={i} className="text-[11px] leading-relaxed border-l border-slate-800 pl-3 relative">
                        <span className="absolute -left-1 top-1 w-2 h-2 rounded-full bg-blue-500/50"></span>
                        <div className="flex justify-between text-[10px] text-slate-500 mb-0.5">
                          <span>{hist.user}</span>
                          <span>{hist.date}</span>
                        </div>
                        <p className="text-slate-300 font-sans">{hist.action}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 leading-relaxed font-sans">
                Select a requirement card on the left grid to view detailed revision archives and approval logs.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* CREATE PROPOSAL MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#161a23] border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-800 bg-[#0b0e14] flex items-center justify-between">
              <span className="font-bold text-sm text-slate-100 uppercase tracking-wider">Propose Technical Specification</span>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-100 p-1 rounded-lg cursor-pointer">
                <X size={15} />
              </button>
            </div>
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold">Originating Stakeholder Group</label>
                  <input
                    type="text"
                    required
                    value={stakeholder}
                    onChange={(e) => setStakeholder(e.target.value)}
                    placeholder="e.g. Beam Controls (BE-CO)"
                    className="w-full bg-[#0b0e14] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500/40"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold">Business / Physics Value</label>
                  <select
                    value={businessValue}
                    onChange={(e) => setBusinessValue(e.target.value as any)}
                    className="w-full bg-[#0b0e14] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500/40 cursor-pointer"
                  >
                    <option value="High">High (Magnet Safety Critical)</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-bold">Requirement Short Headline</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Real-time active ripple filtering system"
                  className="w-full bg-[#0b0e14] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500/40"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-bold">Detailed Technical Requirements Spec</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Elaborate on precision limits, output currents tolerances, cooling thresholds, and grid safety tolerances required..."
                  className="w-full bg-[#0b0e14] border border-slate-800 rounded-lg p-2.5 text-slate-200 resize-none font-sans focus:outline-none focus:border-blue-500/40"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-bold">Implementation Urgency Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full bg-[#0b0e14] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500/40 cursor-pointer"
                >
                  <option value="Critical">Critical (Immediate Sprint Inclusion)</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-[#0b0e14] text-slate-300 hover:bg-slate-800 border border-slate-850 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-slate-100 rounded-xl flex items-center space-x-1 cursor-pointer"
                >
                  <Check size={13} />
                  <span>Propose Spec</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
