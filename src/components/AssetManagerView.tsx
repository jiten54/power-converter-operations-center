import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  SlidersHorizontal, 
  Edit, 
  Trash2, 
  X, 
  Check, 
  MapPin, 
  User, 
  Wrench, 
  Layers, 
  Gauge, 
  Calendar,
  AlertCircle
} from "lucide-react";
import { Asset, UserRole } from "../types";

interface AssetManagerViewProps {
  assets: Asset[];
  onCreateAsset: (asset: Omit<Asset, "id">) => void;
  onEditAsset: (id: string, asset: Partial<Asset>) => void;
  onDeleteAsset: (id: string) => void;
  userRole: UserRole;
}

export default function AssetManagerView({
  assets,
  onCreateAsset,
  onEditAsset,
  onDeleteAsset,
  userRole
}: AssetManagerViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  
  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [type, setType] = useState("Precision Rectifier");
  const [location, setLocation] = useState("LHC Sector 1-2");
  const [status, setStatus] = useState<"Active" | "Warning" | "Offline">("Active");
  const [voltage, setVoltage] = useState(0);
  const [current, setCurrent] = useState(0);
  const [temperature, setTemperature] = useState(25);
  const [healthScore, setHealthScore] = useState(90);
  const [assignedEngineer, setAssignedEngineer] = useState("Dr. Sarah Jenkins");
  const [installationDate, setInstallationDate] = useState("2026-06-24");
  const [lastMaintenanceDate, setLastMaintenanceDate] = useState("2026-06-24");
  const [nextMaintenanceDate, setNextMaintenanceDate] = useState("2026-12-24");

  // Determine permissions
  const isWritable = userRole === "System Administrator" || userRole === "Power Converter Engineer";

  // Filtered Assets list
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          asset.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || asset.status === statusFilter;
    const matchesType = typeFilter === "All" || asset.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleOpenCreate = () => {
    setName("");
    setType("Precision Rectifier");
    setLocation("LHC Sector 1-2 (Point 1)");
    setStatus("Active");
    setVoltage(230);
    setCurrent(15);
    setTemperature(35);
    setHealthScore(100);
    setAssignedEngineer("Dr. Sarah Jenkins");
    setInstallationDate(new Date().toISOString().split('T')[0]);
    setLastMaintenanceDate(new Date().toISOString().split('T')[0]);
    setNextMaintenanceDate(new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    setShowCreateModal(true);
  };

  const handleOpenEdit = (asset: Asset) => {
    setSelectedAsset(asset);
    setName(asset.name);
    setType(asset.type);
    setLocation(asset.location);
    setStatus(asset.status);
    setVoltage(asset.voltage);
    setCurrent(asset.current);
    setTemperature(asset.temperature);
    setHealthScore(asset.healthScore);
    setAssignedEngineer(asset.assignedEngineer);
    setInstallationDate(asset.installationDate);
    setLastMaintenanceDate(asset.lastMaintenanceDate);
    setNextMaintenanceDate(asset.nextMaintenanceDate);
    setShowEditModal(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateAsset({
      name,
      type,
      location,
      status,
      voltage: Number(voltage),
      current: Number(current),
      temperature: Number(temperature),
      efficiency: 95.0,
      healthScore: Number(healthScore),
      assignedEngineer,
      installationDate,
      lastMaintenanceDate,
      nextMaintenanceDate
    });
    setShowCreateModal(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAsset) {
      onEditAsset(selectedAsset.id, {
        name,
        type,
        location,
        status,
        voltage: Number(voltage),
        current: Number(current),
        temperature: Number(temperature),
        healthScore: Number(healthScore),
        assignedEngineer,
        installationDate,
        lastMaintenanceDate,
        nextMaintenanceDate
      });
      setShowEditModal(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-300 font-sans" id="asset-manager-view">
      
      {/* Title Bar & Quick Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Modular Power Converter Inventory</h1>
          <p className="text-xs text-slate-400">Manage, inspect, and register CERN heavy industrial power supplies and high-stability rectifiers.</p>
        </div>
        {isWritable && (
          <button
            onClick={handleOpenCreate}
            id="btn-register-asset"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-slate-100 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-lg shadow-blue-500/15 cursor-pointer"
          >
            <Plus size={14} />
            <span>Register Asset</span>
          </button>
        )}
      </div>

      {/* Grid Filter Bar controls */}
      <div className="bg-[#161a23] p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5 text-slate-500" size={14} />
          <input
            type="text"
            placeholder="Search by ID, Name or Area location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0b0e14] border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors"
            id="asset-search"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <SlidersHorizontal size={12} className="text-slate-500" />
            <span className="text-slate-500 font-bold text-[10px] uppercase">Filters:</span>
          </div>
          
          {/* Status Filter Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0b0e14] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500/40 cursor-pointer"
            id="filter-status"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Warning">Warning</option>
            <option value="Offline">Offline</option>
          </select>

          {/* Converter Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-[#0b0e14] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500/40 cursor-pointer"
            id="filter-type"
          >
            <option value="All">All Types</option>
            <option value="High Voltage Modulator">HV Modulator</option>
            <option value="High Current Regulator">HC Regulator</option>
            <option value="Precision Rectifier">Precision Rectifier</option>
            <option value="Cryogenic Converter">Cryogenic Converter</option>
            <option value="Pulsed Modulator">Pulsed Modulator</option>
          </select>
        </div>
      </div>

      {/* Asset Grid Tables List */}
      <div className="bg-[#161a23] border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono" id="assets-table">
            <thead>
              <tr className="border-b border-slate-800 bg-[#0f121a] text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <th className="px-5 py-3">Asset ID</th>
                <th className="px-5 py-3">Specification</th>
                <th className="px-5 py-3">Location</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Telemetry Ratings</th>
                <th className="px-5 py-3 text-center">Health</th>
                <th className="px-5 py-3">Engineer</th>
                {isWritable && <th className="px-5 py-3 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-xs">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    No active assets match the designated search filter metrics.
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-[#0f121a]/50 transition-all">
                    {/* ID */}
                    <td className="px-5 py-3.5 font-bold text-blue-400">
                      {asset.id}
                    </td>
                    
                    {/* Spec Name / Type */}
                    <td className="px-5 py-3.5">
                      <div className="flex flex-col">
                        <span className="font-sans font-semibold text-slate-200">{asset.name}</span>
                        <span className="text-[10px] text-slate-400">{asset.type}</span>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-5 py-3.5 text-slate-300">
                      <div className="flex items-center space-x-1">
                        <MapPin size={11} className="text-slate-500" />
                        <span>{asset.location}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        asset.status === "Active" 
                          ? "bg-emerald-500/10 text-emerald-400" 
                          : asset.status === "Warning" 
                          ? "bg-amber-500/10 text-amber-400" 
                          : "bg-rose-500/10 text-rose-400"
                      }`}>
                        <span className={`h-1 w-1 rounded-full ${
                          asset.status === "Active" ? "bg-emerald-400" : asset.status === "Warning" ? "bg-amber-400" : "bg-rose-400"
                        }`}></span>
                        <span>{asset.status}</span>
                      </span>
                    </td>

                    {/* Live Telemetry */}
                    <td className="px-5 py-3.5 text-right text-slate-200">
                      <div className="flex flex-col">
                        <span>{asset.voltage.toLocaleString()}V / {asset.current.toLocaleString()}A</span>
                        <span className="text-[9px] text-slate-500">T: {asset.temperature}°C</span>
                      </div>
                    </td>

                    {/* Health score badge */}
                    <td className="px-5 py-3.5 text-center">
                      <span className={`font-bold font-mono px-1.5 py-0.5 rounded text-[10px] ${
                        asset.healthScore > 90 ? "text-emerald-400" : asset.healthScore > 75 ? "text-amber-400" : "text-rose-400"
                      }`}>
                        {asset.healthScore}%
                      </span>
                    </td>

                    {/* Engineer */}
                    <td className="px-5 py-3.5 text-slate-400 font-sans">
                      <div className="flex items-center space-x-1">
                        <User size={11} className="text-slate-500" />
                        <span className="truncate max-w-[120px]">{asset.assignedEngineer}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    {isWritable && (
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleOpenEdit(asset)}
                            className="p-1 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition-all"
                            title="Edit converter metrics"
                          >
                            <Edit size={13} />
                          </button>
                          <button
                            onClick={() => onDeleteAsset(asset.id)}
                            className="p-1 text-slate-400 hover:text-rose-500 hover:bg-slate-800 rounded transition-all"
                            title="Decommission converter"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MODAL DIALOG */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
              <span className="font-bold text-sm text-slate-100 uppercase tracking-wider">Register Power Converter Asset</span>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-100 p-1 rounded-lg">
                <X size={15} />
              </button>
            </div>
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold">Asset Identifier Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Quadrupole Magnets Regulator"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold">Converter Architecture Class</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                  >
                    <option value="High Voltage Modulator">High Voltage Modulator</option>
                    <option value="High Current Regulator">High Current Regulator</option>
                    <option value="Precision Rectifier">Precision Rectifier</option>
                    <option value="Cryogenic Converter">Cryogenic Converter</option>
                    <option value="Pulsed Modulator">Pulsed Modulator</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold">Deployment Physical Location</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold">Shift Engineer Assignment</label>
                  <input
                    type="text"
                    required
                    value={assignedEngineer}
                    onChange={(e) => setAssignedEngineer(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold">Voltage Nominal Rating (V)</label>
                  <input
                    type="number"
                    required
                    value={voltage}
                    onChange={(e) => setVoltage(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold">Current Nominal Rating (A)</label>
                  <input
                    type="number"
                    required
                    value={current}
                    onChange={(e) => setCurrent(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold">Installation Commission Date</label>
                  <input
                    type="date"
                    required
                    value={installationDate}
                    onChange={(e) => setInstallationDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold">Next Maintenance Due Date</label>
                  <input
                    type="date"
                    required
                    value={nextMaintenanceDate}
                    onChange={(e) => setNextMaintenanceDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                  />
                </div>
              </div>
              <div className="pt-4 border-t border-slate-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 text-white hover:bg-cyan-500 rounded-xl flex items-center space-x-1"
                >
                  <Check size={13} />
                  <span>Register Asset</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL DIALOG */}
      {showEditModal && selectedAsset && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
              <span className="font-bold text-sm text-slate-100 uppercase tracking-wider">Configure Asset: {selectedAsset.id}</span>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-100 p-1 rounded-lg">
                <X size={15} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold">Asset Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold">Deployment Location</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold">Current Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                  >
                    <option value="Active">Active</option>
                    <option value="Warning">Warning</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold">Shift Engineer Assignment</label>
                  <input
                    type="text"
                    required
                    value={assignedEngineer}
                    onChange={(e) => setAssignedEngineer(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold">Nominal Voltage (V)</label>
                  <input
                    type="number"
                    required
                    value={voltage}
                    onChange={(e) => setVoltage(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold">Nominal Current (A)</label>
                  <input
                    type="number"
                    required
                    value={current}
                    onChange={(e) => setCurrent(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold">Health Index (%)</label>
                  <input
                    type="number"
                    required
                    value={healthScore}
                    onChange={(e) => setHealthScore(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold">Next Maintenance Date</label>
                  <input
                    type="date"
                    required
                    value={nextMaintenanceDate}
                    onChange={(e) => setNextMaintenanceDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                  />
                </div>
              </div>
              <div className="pt-4 border-t border-slate-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 text-white hover:bg-cyan-500 rounded-xl flex items-center space-x-1"
                >
                  <Check size={13} />
                  <span>Update Configurations</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
