import React, { useState } from "react";
import { 
  Activity, 
  Gauge, 
  Cpu, 
  Zap, 
  Thermometer, 
  RefreshCw, 
  Percent, 
  Sparkles,
  Layers,
  ArrowRight
} from "lucide-react";
import { Asset } from "../types";
import TelemetryChart from "./TelemetryChart";

interface MonitoringViewProps {
  assets: Asset[];
}

export default function MonitoringView({ assets }: MonitoringViewProps) {
  // Let user pick which asset's live telemetry stream to display
  const [selectedAssetId, setSelectedAssetId] = useState(assets[0]?.id || "");
  const selectedAsset = assets.find(a => a.id === selectedAssetId) || assets[0];

  if (!selectedAsset) {
    return (
      <div className="p-8 text-center text-slate-500 font-mono">
        No active assets registered for telemetry tracking.
      </div>
    );
  }

  // Calculate real-time active power output in kW (Voltage * Current) / 1000
  const powerOutputKw = ((selectedAsset.voltage * selectedAsset.current) / 1000).toFixed(2);

  // Setup scale constraints based on converter class
  const getLimits = () => {
    switch (selectedAsset.type) {
      case "High Voltage Modulator":
        return { vMax: 120, vMin: 80, cMax: 60, cMin: 30, vUnit: "kV", cUnit: "A" };
      case "High Current Regulator":
        return { vMax: 15, vMin: 8, cMax: 6200, cMin: 5500, vUnit: "V", cUnit: "A" };
      case "Precision Rectifier":
        return { vMax: 450, vMin: 350, cMax: 300, cMin: 200, vUnit: "V", cUnit: "A" };
      default:
        return { vMax: 100, vMin: 0, cMax: 100, cMin: 0, vUnit: "V", cUnit: "A" };
    }
  };

  const limits = getLimits();

  return (
    <div className="space-y-6 text-slate-300 font-sans" id="monitoring-view">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center">
            <Activity className="text-blue-500 mr-2 shrink-0 animate-pulse" size={20} />
            Telemetry Operations Cockpit (Live)
          </h1>
          <p className="text-xs text-slate-400">
            High-speed signal acquisition plotting live wave variables. Synced from field hardware transducers.
          </p>
        </div>

        {/* Dropdown to switch asset feeds */}
        <div className="flex items-center space-x-3 font-mono text-xs">
          <span className="text-slate-500 font-bold uppercase text-[10px]">Active Transducer Feed:</span>
          <select
            value={selectedAssetId}
            onChange={(e) => setSelectedAssetId(e.target.value)}
            className="bg-[#161a23] border border-slate-800 rounded-xl px-4 py-2 text-xs font-semibold text-blue-400 focus:outline-none focus:border-blue-500/50 cursor-pointer"
            id="feed-select"
          >
            {assets.map(asset => (
              <option key={asset.id} value={asset.id}>
                {asset.id} — {asset.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Asset Metadata strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#161a23] p-4 rounded-xl border border-slate-800 font-mono text-xs animate-fade-in">
        <div className="space-y-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase">Converter Class</span>
          <p className="text-slate-200 font-bold font-sans">{selectedAsset.type}</p>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase">Physical Location</span>
          <p className="text-slate-200 font-bold font-sans">{selectedAsset.location}</p>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase">Grid Status</span>
          <span className={`inline-flex items-center space-x-1.5 px-2 py-0.5 mt-0.5 rounded-full text-[10px] font-bold ${
            selectedAsset.status === "Active" 
              ? "bg-emerald-500/10 text-emerald-400" 
              : selectedAsset.status === "Warning" 
              ? "bg-amber-500/10 text-amber-400" 
              : "bg-rose-500/10 text-rose-400"
          }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${
              selectedAsset.status === "Active" ? "bg-emerald-400" : selectedAsset.status === "Warning" ? "bg-amber-400" : "bg-rose-400"
            }`}></span>
            <span>{selectedAsset.status}</span>
          </span>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase">Hardware Health Index</span>
          <p className="text-slate-200 font-bold">{selectedAsset.healthScore}%</p>
        </div>
      </div>

      {/* Dual Waveform Grid (The precision SVG charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Voltage Waveform plot */}
        <TelemetryChart
          label="Terminal DC Output Voltage"
          value={selectedAsset.voltage}
          unit={limits.vUnit}
          color="#3b82f6" // blue-500
          maxLimit={limits.vMax}
          minLimit={limits.vMin}
        />

        {/* Current Waveform plot */}
        <TelemetryChart
          label="Inductive Magnet Load Current"
          value={selectedAsset.current}
          unit={limits.cUnit}
          color="#60a5fa" // blue-400
          maxLimit={limits.cMax}
          minLimit={limits.cMin}
        />

      </div>

      {/* Telemetric Gauge dials cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Metric 1: Power calculation */}
        <div className="bg-[#161a23] border border-slate-800 p-5 rounded-xl flex flex-col justify-between relative animate-fade-in">
          <div className="absolute right-4 top-4 text-blue-500/10">
            <Zap size={60} />
          </div>
          <div className="space-y-1 font-mono">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Real-Time Power Consumption</span>
            <h3 className="text-2xl font-black text-white tracking-tight flex items-baseline font-sans">
              {powerOutputKw}
              <span className="text-xs font-normal text-slate-400 ml-1">kW</span>
            </h3>
            <p className="text-[10px] text-slate-400 leading-relaxed font-sans mt-2">
              Calculated dynamically as <code className="text-blue-400 font-mono">Voltage × Current</code> load coefficients.
            </p>
          </div>
        </div>

        {/* Metric 2: Thermal dynamics */}
        <div className="bg-[#161a23] border border-slate-800 p-5 rounded-xl flex flex-col justify-between relative animate-fade-in">
          <div className="absolute right-4 top-4 text-rose-500/10">
            <Thermometer size={60} />
          </div>
          <div className="space-y-1 font-mono">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Thyristor Junction Temperature</span>
            <h3 className={`text-2xl font-black tracking-tight flex items-baseline font-sans ${
              selectedAsset.temperature > 75 ? "text-rose-400" : selectedAsset.temperature > 50 ? "text-amber-400" : "text-emerald-400"
            }`}>
              {selectedAsset.temperature.toFixed(1)}
              <span className="text-xs font-normal text-slate-400 ml-1">°C</span>
            </h3>
            <p className="text-[10px] text-slate-400 leading-relaxed font-sans mt-2">
              Junction thermistor rating. Critical alarm trips set at <code className="text-rose-400 font-mono">85.0°C</code>.
            </p>
          </div>
        </div>

        {/* Metric 3: Power Efficiency */}
        <div className="bg-[#161a23] border border-slate-800 p-5 rounded-xl flex flex-col justify-between relative animate-fade-in">
          <div className="absolute right-4 top-4 text-emerald-500/10">
            <Percent size={60} />
          </div>
          <div className="space-y-1 font-mono">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Active Conversion Efficiency</span>
            <h3 className="text-2xl font-black text-emerald-400 tracking-tight flex items-baseline font-sans">
              {selectedAsset.efficiency.toFixed(2)}
              <span className="text-xs font-normal text-slate-400 ml-1">%</span>
            </h3>
            <p className="text-[10px] text-slate-400 leading-relaxed font-sans mt-2">
              Ratio of RMS output power relative to primary auxiliary grid source current.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
