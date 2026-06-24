import React, { useState, useEffect } from "react";
import { Bell, HeartPulse, Clock, Sparkles, Check, ChevronRight } from "lucide-react";
import { SystemNotification, User } from "../types";

interface HeaderProps {
  notifications: SystemNotification[];
  onMarkNotificationsRead: () => void;
  healthScore: number;
  currentUser: User | null;
  activeAlarmsCount: number;
}

export default function Header({
  notifications,
  onMarkNotificationsRead,
  healthScore,
  currentUser,
  activeAlarmsCount
}: HeaderProps) {
  const [currentTime, setCurrentTime] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // CERN usually operates on UTC time for beam synchronized log coordination
      setCurrentTime(now.toUTCString().replace("GMT", "UTC"));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const unreadNotifications = notifications.filter(n => !n.read);

  return (
    <header className="h-16 border-b border-slate-800 bg-[#0f121a]/50 backdrop-blur-md px-8 flex items-center justify-between z-10 select-none animate-fade-in" id="ops-header">
      
      {/* Current Operational Synced UTC Clock */}
      <div className="flex items-center space-x-3 text-slate-300 font-mono text-xs">
        <Clock size={14} className="text-blue-400" />
        <span className="font-semibold">{currentTime}</span>
        <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 uppercase font-bold">
          UTC Sync
        </span>
      </div>

      {/* Control Indicators */}
      <div className="flex items-center space-x-6">
        
        {/* System Health Index score with pulse effect */}
        <div className="flex items-center space-x-2.5">
          <div className="flex flex-col text-right">
            <span className="text-[10px] text-slate-500 uppercase font-mono font-bold">
              Grid Health Index
            </span>
            <span className="text-xs text-slate-300 font-semibold">
              Steady Operations
            </span>
          </div>
          <div className="relative flex items-center justify-center">
            <div className={`h-11 w-11 rounded-full border border-slate-800 bg-[#161a23] flex flex-col items-center justify-center ${
              healthScore > 90 ? "text-emerald-400" : healthScore > 75 ? "text-amber-400" : "text-rose-400"
            }`}>
              <span className="text-xs font-bold font-mono">{healthScore}</span>
              <span className="text-[7px] uppercase font-bold text-slate-500">%</span>
            </div>
            <span className={`absolute -top-0.5 -right-0.5 flex h-2 w-2`}>
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                healthScore > 90 ? "bg-emerald-400" : healthScore > 75 ? "bg-amber-400" : "bg-rose-400"
              }`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                healthScore > 90 ? "bg-emerald-500" : healthScore > 75 ? "bg-amber-500" : "bg-rose-500"
              }`}></span>
            </span>
          </div>
        </div>

        {/* Notifications dropdown widget */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 rounded-lg border border-slate-800/60 transition-all relative cursor-pointer"
            id="btn-notifications"
          >
            <Bell size={16} />
            {unreadNotifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-[#161a23] border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50 font-mono animate-fade-in">
              <div className="p-3 border-b border-slate-800 bg-[#0f121a] flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200 uppercase tracking-wider">Recent Telemetry Events</span>
                {unreadNotifications.length > 0 && (
                  <button
                    onClick={() => {
                      onMarkNotificationsRead();
                      setShowNotifications(false);
                    }}
                    className="flex items-center space-x-1 text-[10px] text-blue-400 hover:text-blue-300 font-bold cursor-pointer"
                  >
                    <Check size={11} />
                    <span>Clear All</span>
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-800/50">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500">
                    No active operations notifications.
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`p-3 text-[11px] leading-relaxed transition-all ${
                        notif.read ? "bg-[#161a23]/20 text-slate-400" : "bg-[#0b0e14]/55 text-slate-200"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1 text-[9px]">
                        <span className={`font-bold uppercase ${
                          notif.severity === "Critical" ? "text-rose-400" : notif.severity === "High" ? "text-amber-400" : "text-blue-400"
                        }`}>{notif.type} • {notif.severity}</span>
                        <span className="text-slate-500">
                          {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p>{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
