import React from "react";
import { 
  LayoutDashboard, 
  Cpu, 
  Activity, 
  Bell, 
  Wrench, 
  LifeBuoy, 
  FileCheck, 
  Kanban, 
  Terminal, 
  Database, 
  History, 
  LogOut,
  Sparkles,
  ShieldAlert
} from "lucide-react";
import { User } from "../types";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User | null;
  onLogout: () => void;
  alarmCount: number;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  currentUser,
  onLogout,
  alarmCount
}: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "assets", label: "Asset Manager", icon: Cpu },
    { id: "monitoring", label: "Live Monitoring", icon: Activity },
    { id: "alarms", label: "Alarms Console", icon: Bell, badge: alarmCount },
    { id: "maintenance", label: "Maintenance Hub", icon: Wrench },
    { id: "support", label: "Support Pipelines", icon: LifeBuoy },
    { id: "requirements", label: "User Requirements", icon: FileCheck },
    { id: "scrum", label: "Agile Workspace", icon: Kanban },
    { id: "devops", label: "DevOps Orchestrator", icon: Terminal },
    { id: "sql", label: "SQL Sandbox", icon: Database },
    { id: "audit", label: "Audit Trails", icon: History }
  ];

  return (
    <aside className="w-64 bg-[#0f121a] border-r border-slate-800 flex flex-col h-screen overflow-y-auto shrink-0 select-none" id="ops-sidebar">
      {/* CERN Inspired Logo Brand from Sleek Interface Theme */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white shrink-0">PC</div>
          <div className="flex flex-col">
            <h1 className="text-xs font-bold tracking-wider text-slate-100 uppercase leading-none">PCOC Enterprise</h1>
            <span className="font-mono text-[8px] text-blue-500 font-bold uppercase tracking-widest mt-1">
              CERN COCKPIT v2.4
            </span>
          </div>
        </div>
      </div>

      {/* Logged in User Badge Profile */}
      {currentUser && (
        <div className="p-4 mx-3 my-4 bg-[#161a23] rounded-xl border border-slate-800 flex flex-col">
          <div className="flex items-center space-x-3 mb-2">
            <div className="h-9 w-9 rounded-lg bg-blue-600/10 text-blue-400 flex items-center justify-center font-bold text-sm border border-blue-500/20 shrink-0">
              {currentUser.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-slate-200 truncate">{currentUser.name}</span>
              <span className="text-[10px] text-slate-400 font-mono truncate">{currentUser.email}</span>
            </div>
          </div>
          <div className="bg-[#0b0e14] rounded px-2.5 py-1 text-center text-[9px] font-bold font-mono text-blue-400 border border-blue-500/10">
            {currentUser.role}
          </div>
        </div>
      )}

      {/* Main Navigation Modules List */}
      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium font-sans transition-all duration-200 ${
                isActive 
                  ? "bg-blue-600/10 text-blue-400 border border-blue-500/20" 
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
              }`}
            >
              <div className="flex items-center space-x-3">
                <IconComponent size={15} className={isActive ? "text-blue-400" : "text-slate-400"} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-mono ${
                  item.id === 'alarms' 
                    ? "bg-rose-500/20 text-rose-400 animate-pulse border border-rose-500/20" 
                    : "bg-slate-800 text-slate-400"
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* App Session footer controls */}
      <div className="p-4 border-t border-slate-800 bg-[#0b0e14]/40">
        <button
          onClick={onLogout}
          id="btn-logout"
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-[#161a23] hover:bg-rose-950/20 hover:text-rose-400 border border-slate-800 hover:border-rose-500/20 rounded-lg text-xs font-semibold text-slate-400 transition-all duration-200 cursor-pointer"
        >
          <LogOut size={13} />
          <span>Exit Cockpit</span>
        </button>
      </div>
    </aside>
  );
}
