import React, { useState } from "react";
import { 
  Kanban, 
  Plus, 
  Layers, 
  TrendingDown, 
  Check, 
  User, 
  ArrowRight, 
  CheckCircle, 
  Play,
  X,
  Gauge
} from "lucide-react";
import { BacklogItem, Sprint, UserRole } from "../types";

interface ScrumViewProps {
  sprints: Sprint[];
  backlogItems: BacklogItem[];
  onCreateBacklogItem: (item: Omit<BacklogItem, "id">) => void;
  onUpdateBacklogItem: (id: string, item: Partial<BacklogItem>) => void;
  userRole: UserRole;
}

export default function ScrumView({
  sprints,
  backlogItems,
  onCreateBacklogItem,
  onUpdateBacklogItem,
  userRole
}: ScrumViewProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const activeSprint = sprints.find(s => s.status === "Active") || sprints[0];

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [storyPoints, setStoryPoints] = useState(3);
  const [assignedUser, setAssignedUser] = useState("Dr. Sarah Jenkins");
  const [priority, setPriority] = useState<"Critical" | "High" | "Medium" | "Low">("Medium");

  const isScrumMember = userRole !== "Operator";

  const handleOpenCreate = () => {
    setTitle("");
    setDescription("");
    setStoryPoints(3);
    setAssignedUser("Dr. Sarah Jenkins");
    setPriority("High");
    setShowCreateModal(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateBacklogItem({
      title,
      description,
      sprintId: activeSprint.id,
      storyPoints: Number(storyPoints),
      status: "Backlog",
      assignedUser,
      priority
    });
    setShowCreateModal(false);
  };

  const cycleStatus = (id: string, currentStatus: BacklogItem["status"]) => {
    const sequence: BacklogItem["status"][] = ["Backlog", "To Do", "In Progress", "Review", "Done"];
    const nextIdx = (sequence.indexOf(currentStatus) + 1) % sequence.length;
    onUpdateBacklogItem(id, { status: sequence[nextIdx] });
  };

  // Kanban Columns
  const columns: { id: BacklogItem["status"]; title: string; color: string }[] = [
    { id: "To Do", title: "Sprint To Do", color: "border-slate-800 text-slate-400 bg-[#161a23]/30" },
    { id: "In Progress", title: "In Progress", color: "border-blue-500/20 text-blue-400 bg-blue-950/10" },
    { id: "Review", title: "Engineering Review", color: "border-indigo-500/20 text-indigo-400 bg-indigo-950/10" },
    { id: "Done", title: "Done & Verified", color: "border-emerald-500/20 text-emerald-400 bg-emerald-950/10" }
  ];

  // SVG Burndown coordinates (Planned Ideal vs Actual Burndown)
  // Story points: Sprint starts at 40 SP. Over 10 days, ideal goes to 0. Actual is current at day 6 (now).
  const burndownIdeal = "20,20 80,45 140,70 200,95 260,120 320,145 380,170";
  const burndownActual = "20,20 80,25 140,55 200,65 260,85 280,105"; // Day 5 is last done

  return (
    <div className="space-y-6 text-slate-300 font-sans" id="scrum-workspace">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center">
            <Kanban size={20} className="text-blue-500 mr-2" />
            Agile Scrum Sprint Board
          </h1>
          <p className="text-xs text-slate-400">Track task weight story points, velocity goals, and manage the active sprint board columns.</p>
        </div>
        {isScrumMember && (
          <button
            onClick={handleOpenCreate}
            id="btn-add-backlog"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-slate-100 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-lg shadow-blue-500/15 cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Backlog Card</span>
          </button>
        )}
      </div>

      {/* Sprints selection details banner */}
      {activeSprint && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#161a23] p-4 rounded-xl border border-slate-800 font-mono text-xs animate-fade-in">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Active Target Sprint</span>
            <p className="text-slate-100 font-bold font-sans">{activeSprint.name}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Dates Range</span>
            <p className="text-slate-200 font-bold">{activeSprint.startDate} to {activeSprint.endDate}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Sprint Velocity Goal</span>
            <p className="text-slate-200 font-bold">{activeSprint.velocityGoal} Story Points</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Completed Velocity</span>
            <p className="text-emerald-400 font-bold">{activeSprint.actualVelocity} Story Points Completed</p>
          </div>
        </div>
      )}

      {/* Multi-Column Scrum Layout: Kanban Board + Burndown Chart */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Kanban Board columns (spanning 3 cols) */}
        <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4">
          {columns.map((col) => {
            const colItems = backlogItems.filter(b => b.sprintId === activeSprint?.id && b.status === col.id);
            return (
              <div 
                key={col.id} 
                className={`border border-slate-800/80 rounded-xl p-3 flex flex-col min-h-[400px] ${col.color}`}
              >
                {/* Column title */}
                <div className="flex justify-between items-center mb-3 text-[11px] font-mono font-bold uppercase tracking-wider px-1">
                  <span>{col.title}</span>
                  <span className="bg-[#0b0e14] border border-slate-800/60 text-slate-400 px-1.5 py-0.2 rounded">
                    {colItems.length}
                  </span>
                </div>

                {/* Column Items */}
                <div className="space-y-2.5 flex-1 overflow-y-auto">
                  {colItems.length === 0 ? (
                    <div className="text-center text-[10px] text-slate-600 py-8 border border-dashed border-slate-800/40 rounded-lg">
                      Empty column.
                    </div>
                  ) : (
                    colItems.map((item) => (
                      <div 
                        key={item.id} 
                        className="bg-[#161a23] border border-slate-800/80 p-3 rounded-lg flex flex-col justify-between space-y-3 cursor-pointer hover:border-slate-700 transition-all shadow-md select-none"
                        onClick={() => cycleStatus(item.id, item.status)}
                        id={`kanban-card-${item.id}`}
                      >
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[9px] font-mono font-bold">
                            <span className="text-blue-400">{item.id}</span>
                            <span className="bg-[#0b0e14] border border-slate-850 px-1.5 rounded text-slate-400">
                              {item.storyPoints} SP
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-200 leading-snug">{item.title}</h4>
                          <p className="text-[10px] text-slate-400 leading-relaxed font-sans">{item.description}</p>
                        </div>

                        <div className="flex justify-between items-center text-[9px] font-mono border-t border-slate-800/60 pt-2 text-slate-500">
                          <span className="flex items-center space-x-1">
                            <User size={10} />
                            <span className="truncate max-w-[80px]">{item.assignedUser}</span>
                          </span>
                          <span className="text-blue-400 font-bold flex items-center space-x-0.5 uppercase hover:text-blue-300">
                            <span>Cycle</span>
                            <ArrowRight size={8} />
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sprint Metrics panel (spanning 1 col) */}
        <div className="space-y-4 font-mono text-xs animate-fade-in">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center font-sans">
            <TrendingDown size={15} className="text-blue-500 mr-2" />
            Burndown Burn Rate
          </h2>

          <div className="bg-[#161a23] border border-slate-800 p-4 rounded-xl space-y-4">
            
            {/* Burndown Chart visualizer */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Sprint 8 Burndown Velocity</span>
              <div className="bg-[#0b0e14] rounded-lg border border-slate-800/80 p-2 relative min-h-[200px] flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 400 180" className="w-full h-full">
                  {/* Grid Lines */}
                  <line x1="20" y1="20" x2="380" y2="20" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3,3" />
                  <line x1="20" y1="70" x2="380" y2="70" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3,3" />
                  <line x1="20" y1="120" x2="380" y2="120" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3,3" />
                  <line x1="20" y1="170" x2="380" y2="170" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3,3" />
                  
                  {/* Ideal burndown line (Dashed gray) */}
                  <polyline fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4,4" points={burndownIdeal} />
                  
                  {/* Actual burndown line (Blue solid) */}
                  <polyline fill="none" stroke="#3b82f6" strokeWidth="2.5" points={burndownActual} />
                  
                  {/* Sweep Markers */}
                  <circle cx="280" cy="105" r="4" fill="#3b82f6" className="animate-ping" />
                  
                  {/* Legends */}
                  <text x="30" y="15" fill="#64748b" fontSize="8">40 SP</text>
                  <text x="350" y="165" fill="#64748b" fontSize="8">Day 10</text>
                </svg>
              </div>
              <div className="flex justify-between text-[10px] font-bold text-slate-500 px-1 pt-1">
                <span className="flex items-center"><span className="w-2 h-0.5 bg-slate-500 inline-block mr-1"></span>Ideal line</span>
                <span className="flex items-center"><span className="w-2 h-0.5 bg-blue-500 inline-block mr-1"></span>Actual Burn</span>
              </div>
            </div>

            {/* Backlog List */}
            <div className="bg-[#0b0e14] p-3 rounded-lg border border-slate-800/80 space-y-2">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Product Backlog Buffer</span>
              <div className="space-y-2 text-[11px]">
                {backlogItems.filter(b => b.status === "Backlog").map((item) => (
                  <div key={item.id} className="flex justify-between items-center border-b border-slate-800/40 pb-1.5 last:border-b-0 last:pb-0">
                    <span className="text-slate-400 truncate max-w-[120px]">{item.title}</span>
                    <span className="text-blue-400 font-bold">{item.storyPoints} SP</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* CREATE BACKLOG CARD MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#161a23] border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-800 bg-[#0b0e14] flex items-center justify-between">
              <span className="font-bold text-sm text-slate-100 uppercase tracking-wider">Add Backlog card</span>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-100 p-1 rounded-lg cursor-pointer">
                <X size={15} />
              </button>
            </div>
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold">Story Weight points (SP)</label>
                  <select
                    value={storyPoints}
                    onChange={(e) => setStoryPoints(Number(e.target.value))}
                    className="w-full bg-[#0b0e14] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500/40 cursor-pointer"
                  >
                    <option value={1}>1 Point (Minor Refactoring)</option>
                    <option value={2}>2 Points</option>
                    <option value={3}>3 Points (Standard Component)</option>
                    <option value={5}>5 Points (System Hookup)</option>
                    <option value={8}>8 Points (Sub-Module Design)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-[#0b0e14] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500/40 cursor-pointer"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-bold">Card Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Map pod security configurations in kubernetes yaml"
                  className="w-full bg-[#0b0e14] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500/40"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-bold">Task Objectives Spec</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail step-by-step programming tasks or testing criteria..."
                  className="w-full bg-[#0b0e14] border border-slate-800 rounded-lg p-2.5 text-slate-200 resize-none font-sans focus:outline-none focus:border-blue-500/40"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-bold">Assigned Scrum Member</label>
                <input
                  type="text"
                  required
                  value={assignedUser}
                  onChange={(e) => setAssignedUser(e.target.value)}
                  className="w-full bg-[#0b0e14] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500/40"
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
                  <span>Log Backlog Card</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
