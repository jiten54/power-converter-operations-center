import React, { useState } from "react";
import { 
  LifeBuoy, 
  Plus, 
  Search, 
  HelpCircle, 
  BookOpen, 
  Activity, 
  Bug, 
  AlertOctagon,
  Check, 
  Edit3,
  X
} from "lucide-react";
import { SupportTicket, UserRole } from "../types";

interface SupportViewProps {
  tickets: SupportTicket[];
  onCreateTicket: (ticket: Omit<SupportTicket, "id" | "status" | "date">) => void;
  onUpdateTicket: (id: string, ticket: Partial<SupportTicket>) => void;
  userRole: UserRole;
}

export default function SupportView({
  tickets,
  onCreateTicket,
  onUpdateTicket,
  userRole
}: SupportViewProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRCAModal, setShowRCAModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<"Critical" | "High" | "Medium" | "Low">("Medium");
  const [type, setType] = useState<"Bug" | "Incident" | "Feature Request">("Incident");

  // RCA states
  const [rca, setRca] = useState("");
  const [resolution, setResolution] = useState("");
  const [ticketStatus, setTicketStatus] = useState<any>("Investigating");

  // Knowledge base search
  const [kbSearch, setKbSearch] = useState("");

  const kbArticles = [
    { id: "KB-101", title: "Active Filter Bank Voltage Ripple Troubleshooting", category: "Power Circuits", body: "1. Monitor secondary harmonics on the oscilloscope.\n2. Verify dielectric loss factor tan δ on active capacitor bank.\n3. Calibrate phase-locked loop (PLL) synchronization timings in Modbus settings." },
    { id: "KB-102", title: "Thyratron Trigger Board Replacement Procedure", category: "Safety & Interlocks", body: "1. Engage main 18kV incoming breakers. Wait 5 minutes for capacitor discharge.\n2. Ensure ground hooks are attached to physical terminals.\n3. Disconnect auxiliary cables, swap trigger board PC-TRIG-X1, restore power." },
    { id: "KB-103", title: "Resolving Modbus Gateway Buffer Overflow", category: "Data Systems", body: "Ensure Gateway polling speed is restricted to values >= 50ms inside auxiliary configuration profiles. Connection pooling handles recycling automatically." }
  ];

  const filteredKb = kbArticles.filter(art => 
    art.title.toLowerCase().includes(kbSearch.toLowerCase()) || 
    art.body.toLowerCase().includes(kbSearch.toLowerCase()) ||
    art.category.toLowerCase().includes(kbSearch.toLowerCase())
  );

  const handleOpenCreate = () => {
    setTitle("");
    setDescription("");
    setSeverity("Medium");
    setType("Incident");
    setShowCreateModal(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateTicket({
      title,
      description,
      severity,
      type
    });
    setShowCreateModal(false);
  };

  const handleOpenRCA = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setRca(ticket.rca || "");
    setResolution(ticket.resolution || "");
    setTicketStatus(ticket.status);
    setShowRCAModal(true);
  };

  const handleRCASubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTicket) {
      onUpdateTicket(selectedTicket.id, {
        rca,
        resolution,
        status: ticketStatus
      });
      setShowRCAModal(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-300 font-sans" id="support-view">
      
      {/* Header title block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center">
            <LifeBuoy size={20} className="text-blue-500 mr-2" />
            Support pipelines & Incident logs
          </h1>
          <p className="text-xs text-slate-400">File bug reports, triage converter trips, and write thorough Root Cause Analysis (RCA) ledgers.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          id="btn-file-ticket"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-slate-100 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-lg cursor-pointer"
        >
          <Plus size={14} />
          <span>File Support Ticket</span>
        </button>
      </div>

      {/* Main split grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Support Tickets */}
        <div className="lg:col-span-2 space-y-4 animate-fade-in">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center font-sans">
            <AlertOctagon size={15} className="text-blue-400 mr-2" />
            Active Incidents & Issues
          </h2>

          <div className="space-y-3">
            {tickets.map((ticket) => (
              <div 
                key={ticket.id} 
                className="bg-[#161a23] border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-700/80 transition-all"
                id={`support-ticket-${ticket.id}`}
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                    <span className="font-bold text-blue-400">{ticket.id}</span>
                    <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      ticket.type === "Bug" ? "bg-rose-500/10 text-rose-400" : ticket.type === "Incident" ? "bg-amber-500/10 text-amber-400" : "bg-blue-500/10 text-blue-400"
                    }`}>
                      {ticket.type === "Bug" ? <Bug size={10} className="mr-0.5" /> : <Activity size={10} className="mr-0.5" />}
                      <span>{ticket.type}</span>
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      ticket.severity === "Critical" 
                        ? "bg-rose-500/20 text-rose-400 border border-rose-500/20" 
                        : ticket.severity === "High" 
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                        : "bg-slate-800 text-slate-400"
                    }`}>
                      {ticket.severity}
                    </span>
                    <span className="bg-[#0b0e14] px-2 py-0.5 rounded text-slate-400 border border-slate-800/40 text-[10px] font-bold">
                      {ticket.status}
                    </span>
                  </div>

                  <h3 className="font-sans font-bold text-xs text-slate-200">{ticket.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">{ticket.description}</p>

                  {/* RCA Section if logs exist */}
                  {(ticket.rca || ticket.resolution) && (
                    <div className="bg-[#0b0e14] p-3 rounded-lg border border-slate-800/60 text-[11px] font-mono leading-relaxed mt-2 space-y-1 text-slate-400">
                      {ticket.rca && (
                        <div>
                          <strong className="text-amber-500 text-[9px] uppercase block">Root Cause (RCA):</strong>
                          {ticket.rca}
                        </div>
                      )}
                      {ticket.resolution && (
                        <div className="pt-1.5 border-t border-slate-800 mt-1.5">
                          <strong className="text-emerald-500 text-[9px] uppercase block">Action/Resolution:</strong>
                          {ticket.resolution}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="text-[10px] text-slate-500 font-mono pt-1">
                    Filed: {ticket.date}
                  </div>
                </div>

                {/* Operations controls */}
                <div className="shrink-0 self-end md:self-center">
                  <button
                    onClick={() => handleOpenRCA(ticket)}
                    className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                  >
                    <Edit3 size={12} />
                    <span>RCA & Status</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Knowledge Base Section */}
        <div className="space-y-4 animate-fade-in">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center font-sans">
            <BookOpen size={15} className="text-indigo-400 mr-2" />
            Control room KB Lookup
          </h2>

          <div className="bg-[#161a23] border border-slate-800 p-4 rounded-xl space-y-4">
            <div className="relative font-mono text-xs">
              <Search className="absolute left-2.5 top-2.5 text-slate-500" size={13} />
              <input
                type="text"
                placeholder="Search procedures and docs..."
                value={kbSearch}
                onChange={(e) => setKbSearch(e.target.value)}
                className="w-full bg-[#0b0e14] border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500/40 transition-colors"
              />
            </div>

            <div className="space-y-3">
              {filteredKb.map((art) => (
                <div key={art.id} className="p-3 bg-[#0b0e14]/50 rounded-lg border border-slate-800 space-y-1.5">
                  <div className="flex justify-between items-center text-[9px] font-mono font-bold uppercase">
                    <span className="text-blue-400">{art.category}</span>
                    <span className="text-slate-500">{art.id}</span>
                  </div>
                  <h4 className="text-xs font-bold font-sans text-slate-200 leading-snug">{art.title}</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-mono whitespace-pre-line bg-[#0b0e14] p-2 rounded border border-slate-800/40">
                    {art.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* CREATE TICKET MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#161a23] border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-800 bg-[#0b0e14] flex items-center justify-between">
              <span className="font-bold text-sm text-slate-100 uppercase tracking-wider">File Support Ticket</span>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-100 p-1 rounded-lg cursor-pointer">
                <X size={15} />
              </button>
            </div>
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold">Issue Type Class</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-[#0b0e14] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500/40 cursor-pointer"
                  >
                    <option value="Incident">Incident (Field Fault)</option>
                    <option value="Bug">Software Bug</option>
                    <option value="Feature Request">Auxiliary Feature Request</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold">Severity Priority</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as any)}
                    className="w-full bg-[#0b0e14] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500/40 cursor-pointer"
                  >
                    <option value="Critical">Critical (System Down)</option>
                    <option value="High">High (Performance Deficit)</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-slate-400 font-bold">Ticket Header Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Modbus communications drop under telemetry bursts"
                  className="w-full bg-[#0b0e14] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500/40"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-bold">Description of Symptoms</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide precise details of hardware symptoms, software stack trace errors, and relevant parameters..."
                  className="w-full bg-[#0b0e14] border border-slate-800 rounded-lg p-2.5 text-slate-200 resize-none font-sans focus:outline-none focus:border-blue-500/40"
                />
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
                  <span>Submit Ticket</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RCA & STATUS EDIT MODAL */}
      {showRCAModal && selectedTicket && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#161a23] border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-800 bg-[#0b0e14] flex items-center justify-between">
              <span className="font-bold text-sm text-slate-100 uppercase tracking-wider">Root Cause (RCA) Ledger: {selectedTicket.id}</span>
              <button onClick={() => setShowRCAModal(false)} className="text-slate-400 hover:text-slate-100 p-1 rounded-lg cursor-pointer">
                <X size={15} />
              </button>
            </div>
            <form onSubmit={handleRCASubmit} className="p-6 space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-slate-400 font-bold">Update Operational Status</label>
                <select
                  value={ticketStatus}
                  onChange={(e) => setTicketStatus(e.target.value)}
                  className="w-full bg-[#0b0e14] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500/40 cursor-pointer"
                >
                  <option value="Open">Open</option>
                  <option value="Investigating">Investigating</option>
                  <option value="Pending Fix">Pending Fix</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-bold">Root Cause Analysis (RCA)</label>
                <textarea
                  rows={3}
                  value={rca}
                  onChange={(e) => setRca(e.target.value)}
                  placeholder="Record failure mechanism, hardware traces, and why safety tolerances were breached..."
                  className="w-full bg-[#0b0e14] border border-slate-800 rounded-lg p-2.5 text-slate-200 resize-none font-mono focus:outline-none focus:border-blue-500/40"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-bold">Permanent Resolution Action taken</label>
                <textarea
                  rows={3}
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  placeholder="Explain the patches, physical board swaps, and parameter limits configured to prevent recurrence."
                  className="w-full bg-[#0b0e14] border border-slate-800 rounded-lg p-2.5 text-slate-200 resize-none font-mono focus:outline-none focus:border-blue-500/40"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowRCAModal(false)}
                  className="px-4 py-2 bg-[#0b0e14] text-slate-300 hover:bg-slate-800 border border-slate-850 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-slate-100 rounded-xl flex items-center space-x-1 cursor-pointer"
                >
                  <Check size={13} />
                  <span>Update Incident File</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
