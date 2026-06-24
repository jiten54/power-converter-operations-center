import React, { useState, useEffect } from "react";
import { 
  User, 
  Asset, 
  Alarm, 
  MaintenanceRecord, 
  SupportTicket, 
  Requirement, 
  Sprint, 
  BacklogItem, 
  AuditLog, 
  SystemNotification 
} from "./types";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import DashboardView from "./components/DashboardView";
import AssetManagerView from "./components/AssetManagerView";
import MonitoringView from "./components/MonitoringView";
import AlarmView from "./components/AlarmView";
import MaintenanceView from "./components/MaintenanceView";
import SupportView from "./components/SupportView";
import RequirementsView from "./components/RequirementsView";
import ScrumView from "./components/ScrumView";
import DevOpsView from "./components/DevOpsView";
import SQLView from "./components/SQLView";
import AuditView from "./components/AuditView";
import { 
  ShieldAlert, 
  Terminal, 
  Lock, 
  KeyRound, 
  ArrowRight,
  Sparkles
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Entities state
  const [assets, setAssets] = useState<Asset[]>([]);
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceRecord[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [backlogItems, setBacklogItems] = useState<BacklogItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);

  // Auth form state
  const [email, setEmail] = useState("jitenmoni8@gmail.com");
  const [password, setPassword] = useState("password");
  const [authError, setAuthError] = useState("");

  // ==========================================
  // API FETCH & STATE MANAGEMENT
  // ==========================================

  const fetchInitialData = async () => {
    try {
      const responses = await Promise.all([
        fetch("/api/auth/user").then(r => r.json()),
        fetch("/api/assets").then(r => r.json()),
        fetch("/api/alarms").then(r => r.json()),
        fetch("/api/maintenance").then(r => r.json()),
        fetch("/api/support").then(r => r.json()),
        fetch("/api/requirements").then(r => r.json()),
        fetch("/api/scrum/sprints").then(r => r.json()),
        fetch("/api/scrum/backlog").then(r => r.json()),
        fetch("/api/audit-logs").then(r => r.json()),
        fetch("/api/notifications").then(r => r.json())
      ]);

      setCurrentUser(responses[0].user);
      setAssets(responses[1]);
      setAlarms(responses[2]);
      setMaintenance(responses[3]);
      setTickets(responses[4]);
      setRequirements(responses[5]);
      setSprints(responses[6]);
      setBacklogItems(responses[7]);
      setAuditLogs(responses[8]);
      setNotifications(responses[9]);
    } catch (err) {
      console.error("Failed to load operations datastores:", err);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Connect Server-Sent Events (SSE) telemetry updates stream
  useEffect(() => {
    const eventSource = new EventSource("/api/telemetry/stream");
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.assets) setAssets(data.assets);
      if (data.alarms) setAlarms(data.alarms);
      if (data.notifications) setNotifications(data.notifications);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // Sync auxiliary log logs
  const syncAuditLogs = async () => {
    const res = await fetch("/api/audit-logs");
    const logs = await res.json();
    setAuditLogs(logs);
  };

  // ==========================================
  // MODULE ACTION DISPATCHERS
  // ==========================================

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentUser(data.user);
        syncAuditLogs();
      } else {
        setAuthError(data.error);
      }
    } catch (err) {
      setAuthError("Failed to authenticate session with control server.");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setCurrentUser(null);
  };

  // Assets Operations
  const handleCreateAsset = async (newAsset: Omit<Asset, "id">) => {
    const res = await fetch("/api/assets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAsset)
    });
    if (res.ok) {
      const asset = await res.json();
      setAssets(prev => [...prev, asset]);
      syncAuditLogs();
    }
  };

  const handleEditAsset = async (id: string, updated: Partial<Asset>) => {
    const res = await fetch(`/api/assets/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated)
    });
    if (res.ok) {
      const asset = await res.json();
      setAssets(prev => prev.map(a => a.id === id ? asset : a));
      syncAuditLogs();
    }
  };

  const handleDeleteAsset = async (id: string) => {
    const res = await fetch(`/api/assets/${id}`, { method: "DELETE" });
    if (res.ok) {
      setAssets(prev => prev.filter(a => a.id !== id));
      syncAuditLogs();
    }
  };

  // Alarms Operations
  const handleAcknowledgeAlarm = async (id: string) => {
    const res = await fetch(`/api/alarms/${id}/acknowledge`, { method: "PUT" });
    if (res.ok) {
      const alarm = await res.json();
      setAlarms(prev => prev.map(a => a.id === id ? alarm : a));
      syncAuditLogs();
    }
  };

  const handleResolveAlarm = async (id: string) => {
    const res = await fetch(`/api/alarms/${id}/resolve`, { method: "PUT" });
    if (res.ok) {
      const alarm = await res.json();
      setAlarms(prev => prev.map(a => a.id === id ? alarm : a));
      // Reload assets to capture returned warning states
      const assetsRes = await fetch("/api/assets");
      const assetsData = await assetsRes.json();
      setAssets(assetsData);
      syncAuditLogs();
    }
  };

  const handleEscalateAlarm = async (id: string) => {
    const res = await fetch(`/api/alarms/${id}/escalate`, { method: "PUT" });
    if (res.ok) {
      const alarm = await res.json();
      setAlarms(prev => prev.map(a => a.id === id ? alarm : a));
      syncAuditLogs();
    }
  };

  // Maintenance Operations
  const handleCreateMaint = async (newMaint: Omit<MaintenanceRecord, "id" | "status">) => {
    const res = await fetch("/api/maintenance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMaint)
    });
    if (res.ok) {
      const maint = await res.json();
      setMaintenance(prev => [...prev, maint]);
      syncAuditLogs();
    }
  };

  const handleUpdateMaint = async (id: string, updated: Partial<MaintenanceRecord>) => {
    const res = await fetch(`/api/maintenance/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated)
    });
    if (res.ok) {
      const maint = await res.json();
      setMaintenance(prev => prev.map(m => m.id === id ? maint : m));
      syncAuditLogs();
    }
  };

  // Support Operations
  const handleCreateTicket = async (newTicket: Omit<SupportTicket, "id" | "status" | "date">) => {
    const res = await fetch("/api/support", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTicket)
    });
    if (res.ok) {
      const ticket = await res.json();
      setTickets(prev => [ticket, ...prev]);
      syncAuditLogs();
    }
  };

  const handleUpdateTicket = async (id: string, updated: Partial<SupportTicket>) => {
    const res = await fetch(`/api/support/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated)
    });
    if (res.ok) {
      const ticket = await res.json();
      setTickets(prev => prev.map(t => t.id === id ? ticket : t));
      syncAuditLogs();
    }
  };

  // Requirements Operations
  const handleCreateReq = async (newReq: Omit<Requirement, "id" | "status" | "history">) => {
    const res = await fetch("/api/requirements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newReq)
    });
    if (res.ok) {
      const req = await res.json();
      setRequirements(prev => [...prev, req]);
      syncAuditLogs();
    }
  };

  const handleUpdateReqStatus = async (id: string, status: Requirement["status"]) => {
    const res = await fetch(`/api/requirements/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      const req = await res.json();
      setRequirements(prev => prev.map(r => r.id === id ? req : r));
      syncAuditLogs();
    }
  };

  // Scrum Backlog Operations
  const handleCreateBacklogItem = async (newItem: Omit<BacklogItem, "id">) => {
    const res = await fetch("/api/scrum/backlog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem)
    });
    if (res.ok) {
      const item = await res.json();
      setBacklogItems(prev => [...prev, item]);
      syncAuditLogs();
    }
  };

  const handleUpdateBacklogItem = async (id: string, updated: Partial<BacklogItem>) => {
    const res = await fetch(`/api/scrum/backlog/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated)
    });
    if (res.ok) {
      const item = await res.json();
      setBacklogItems(prev => prev.map(b => b.id === id ? item : b));
      syncAuditLogs();
    }
  };

  const handleMarkNotificationsRead = async () => {
    await fetch("/api/notifications/read-all", { method: "PUT" });
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Calculate high-level statistics
  const totalScore = assets.reduce((sum, a) => sum + a.healthScore, 0);
  const healthScore = assets.length > 0 ? Math.round(totalScore / assets.length) : 100;
  const activeAlarmsCount = alarms.filter(a => a.status === "Active" || a.status === "Acknowledged").length;

  // Render correct panel view
  const renderViewContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardView
            assets={assets}
            alarms={alarms}
            maintenance={maintenance}
            tickets={tickets}
            sprints={sprints}
            setActiveTab={setActiveTab}
            currentUser={currentUser}
          />
        );
      case "assets":
        return (
          <AssetManagerView
            assets={assets}
            onCreateAsset={handleCreateAsset}
            onEditAsset={handleEditAsset}
            onDeleteAsset={handleDeleteAsset}
            userRole={currentUser?.role || "Operator"}
          />
        );
      case "monitoring":
        return <MonitoringView assets={assets} />;
      case "alarms":
        return (
          <AlarmView
            alarms={alarms}
            onAcknowledge={handleAcknowledgeAlarm}
            onResolve={handleResolveAlarm}
            onEscalate={handleEscalateAlarm}
            userRole={currentUser?.role || "Operator"}
          />
        );
      case "maintenance":
        return (
          <MaintenanceView
            maintenance={maintenance}
            assets={assets}
            onCreateMaint={handleCreateMaint}
            onUpdateMaint={handleUpdateMaint}
            userRole={currentUser?.role || "Operator"}
          />
        );
      case "support":
        return (
          <SupportView
            tickets={tickets}
            onCreateTicket={handleCreateTicket}
            onUpdateTicket={handleUpdateTicket}
            userRole={currentUser?.role || "Operator"}
          />
        );
      case "requirements":
        return (
          <RequirementsView
            requirements={requirements}
            onCreateReq={handleCreateReq}
            onUpdateReqStatus={handleUpdateReqStatus}
            userRole={currentUser?.role || "Operator"}
          />
        );
      case "scrum":
        return (
          <ScrumView
            sprints={sprints}
            backlogItems={backlogItems}
            onCreateBacklogItem={handleCreateBacklogItem}
            onUpdateBacklogItem={handleUpdateBacklogItem}
            userRole={currentUser?.role || "Operator"}
          />
        );
      case "devops":
        return <DevOpsView />;
      case "sql":
        return <SQLView />;
      case "audit":
        return <AuditView logs={auditLogs} />;
      default:
        return <div className="text-center py-20">Control module under development...</div>;
    }
  };

  // If not logged in, show elegant control-panel authentication interface
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex flex-col justify-center items-center p-4 relative font-mono text-xs select-none selection:bg-blue-500/30 selection:text-white" id="auth-screen">
        
        {/* Dynamic mesh lines background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950/20 via-[#0b0e14] to-[#0b0e14] pointer-events-none z-0"></div>

        <div className="w-full max-w-md bg-[#161a23] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative z-10 p-6 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-blue-400 mb-2">
              <ShieldAlert size={28} />
            </div>
            <h1 className="text-lg font-sans font-black text-white tracking-widest uppercase">
              COCKPIT SECURITY ACCESS
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">
              POWER CONVERTER OPERATIONS CENTER
            </p>
          </div>

          {authError && (
            <div className="bg-rose-950/20 border border-rose-500/20 px-4 py-3 rounded-xl text-rose-400 leading-normal text-center">
              {authError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-slate-400 font-bold uppercase text-[9px] tracking-wider block">Operational Email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@cern.ch"
                  className="w-full bg-[#0b0e14] border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-bold uppercase text-[9px] tracking-wider block">Security Credentials Passphrase</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••••"
                  className="w-full bg-[#0b0e14] border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-sans font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-200 flex items-center justify-center space-x-1.5 cursor-pointer"
              id="btn-login-submit"
            >
              <span>Verify Signature</span>
              <ArrowRight size={13} />
            </button>
          </form>

          {/* Quick instructions for logging in during presentation */}
          <div className="bg-[#0b0e14]/60 border border-slate-800 p-3 rounded-xl text-[10px] leading-relaxed text-slate-500">
            <span className="font-bold text-blue-400 uppercase block mb-1">Shift handover credentials:</span>
            Default Operator Account: <code className="text-slate-300">jitenmoni8@gmail.com</code> (Administrator)<br />
            No setup necessary. System connects automatically.
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Dashboard Layout
  return (
    <div className="flex h-screen bg-[#0b0e14] overflow-hidden font-sans text-slate-300 select-none animate-fade-in" id="operations-layout">
      
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLogout={handleLogout}
        alarmCount={activeAlarmsCount}
      />

      {/* Main Operations Terminal Panel */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Sync Header */}
        <Header
          notifications={notifications}
          onMarkNotificationsRead={handleMarkNotificationsRead}
          healthScore={healthScore}
          currentUser={currentUser}
          activeAlarmsCount={activeAlarmsCount}
        />

        {/* Action Panel Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#0b0e14]/40 relative">
          <div className="max-w-7xl mx-auto w-full">
            {renderViewContent()}
          </div>
        </main>
      </div>

    </div>
  );
}
