import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

// ==========================================
// MOCK DATABASE & STATE SYSTEM
// ==========================================

let users = [
  { id: "usr-01", email: "jitenmoni8@gmail.com", name: "Jiten Moni", role: "System Administrator", status: "Active" },
  { id: "usr-02", email: "pc.engineer@cern.ch", name: "Dr. Sarah Jenkins", role: "Power Converter Engineer", status: "Active" },
  { id: "usr-03", email: "maint.eng@cern.ch", name: "Marc Dubois", role: "Maintenance Engineer", status: "Active" },
  { id: "usr-04", email: "operator@cern.ch", name: "Elena Rostova", role: "Operator", status: "Active" }
];

let currentUser = users[0]; // Logged in by default for seamless demo

let assets = [
  { 
    id: "PC-LHC-R12", 
    name: "HV Klystron Modulator", 
    type: "High Voltage Modulator", 
    location: "LHC Sector 1-2 (Point 1)", 
    status: "Active", 
    voltage: 100.0, 
    current: 48.5, 
    temperature: 42.6, 
    efficiency: 94.2, 
    healthScore: 98, 
    assignedEngineer: "Dr. Sarah Jenkins", 
    installationDate: "2021-03-12", 
    lastMaintenanceDate: "2026-05-10", 
    nextMaintenanceDate: "2026-11-10" 
  },
  { 
    id: "PC-SPS-B3", 
    name: "Dipole Current Regulator", 
    type: "High Current Regulator", 
    location: "SPS Ring (BA3)", 
    status: "Active", 
    voltage: 11.8, 
    current: 5850.0, 
    temperature: 54.2, 
    efficiency: 91.5, 
    healthScore: 89, 
    assignedEngineer: "Dr. Sarah Jenkins", 
    installationDate: "2019-07-22", 
    lastMaintenanceDate: "2026-04-15", 
    nextMaintenanceDate: "2026-10-15" 
  },
  { 
    id: "PC-PS-C5", 
    name: "Quadrupole Rectifier", 
    type: "Precision Rectifier", 
    location: "PS Transfer Line (TT2)", 
    status: "Active", 
    voltage: 395.0, 
    current: 245.0, 
    temperature: 38.1, 
    efficiency: 96.1, 
    healthScore: 94, 
    assignedEngineer: "Marc Dubois", 
    installationDate: "2022-01-15", 
    lastMaintenanceDate: "2026-06-01", 
    nextMaintenanceDate: "2026-12-01" 
  },
  { 
    id: "PC-LHC-L45", 
    name: "Sextupole Cryo-Compensator", 
    type: "Cryogenic Converter", 
    location: "LHC Sector 4-5 (Point 4)", 
    status: "Warning", 
    voltage: 4.8, 
    current: 492.0, 
    temperature: 78.4, 
    efficiency: 88.3, 
    healthScore: 72, 
    assignedEngineer: "Marc Dubois", 
    installationDate: "2020-10-05", 
    lastMaintenanceDate: "2026-02-18", 
    nextMaintenanceDate: "2026-08-18" 
  },
  { 
    id: "PC-ISOLDE-GP", 
    name: "Heavy-Ion Deflector Modulator", 
    type: "Pulsed Modulator", 
    location: "ISOLDE Experimental Hall", 
    status: "Offline", 
    voltage: 0.0, 
    current: 0.0, 
    temperature: 21.0, 
    efficiency: 0.0, 
    healthScore: 45, 
    assignedEngineer: "Marc Dubois", 
    installationDate: "2023-04-30", 
    lastMaintenanceDate: "2026-01-20", 
    nextMaintenanceDate: "2026-07-20" 
  }
];

let alarms = [
  { 
    id: "ALM-301", 
    assetId: "PC-LHC-L45", 
    severity: "High", 
    title: "Cryogenic Temperature Warning", 
    description: "Converter cooling loop temperature threshold exceeded 75°C. Current reading: 78.4°C.", 
    timestamp: "2026-06-24T06:12:00-07:00", 
    status: "Active", 
    assignedUser: "Marc Dubois", 
    escalationLevel: 1 
  },
  { 
    id: "ALM-302", 
    assetId: "PC-ISOLDE-GP", 
    severity: "Critical", 
    title: "Interlock Relay Failure", 
    description: "Beam deflector safety interlock tripped. Thyratron failure suspected.", 
    timestamp: "2026-06-24T05:30:00-07:00", 
    status: "Acknowledged", 
    assignedUser: "Dr. Sarah Jenkins", 
    escalationLevel: 2 
  },
  { 
    id: "ALM-299", 
    assetId: "PC-SPS-B3", 
    severity: "Medium", 
    title: "Voltage Ripple Deviation", 
    description: "DC voltage ripple exceeded 0.5% RMS on primary filter bank.", 
    timestamp: "2026-06-23T18:45:00-07:00", 
    status: "Resolved", 
    assignedUser: "Dr. Sarah Jenkins", 
    escalationLevel: 1 
  }
];

let maintenanceRecords = [
  { 
    id: "MNT-901", 
    assetId: "PC-LHC-R12", 
    type: "Preventive", 
    title: "Primary Capacitor Bank Leakage Test", 
    description: "Annual dielectric insulation test on capacitors. Checked oil levels and seals. All metrics pristine.", 
    status: "Completed", 
    assignedEngineer: "Marc Dubois", 
    date: "2026-05-10", 
    nextDate: "2026-11-10", 
    report: " Dielectric loss angle tan δ = 0.002. Capacitance value standard within 1%. Insulation resistance: 10 GΩ." 
  },
  { 
    id: "MNT-902", 
    assetId: "PC-LHC-L45", 
    type: "Corrective", 
    title: "Cooling Compressor Recalibration", 
    description: "Corrective intervention following continuous heat alarms. Replacing thermal coupling fluid.", 
    status: "In Progress", 
    assignedEngineer: "Marc Dubois", 
    date: "2026-06-24", 
    nextDate: "2026-08-18", 
    report: "" 
  },
  { 
    id: "MNT-903", 
    assetId: "PC-ISOLDE-GP", 
    type: "Corrective", 
    title: "Thyratron & Trigger Board Swap", 
    description: "Emergency repair requested due to recurring safety interlock trips.", 
    status: "Scheduled", 
    assignedEngineer: "Dr. Sarah Jenkins", 
    date: "2026-06-25", 
    nextDate: "2026-07-20", 
    report: "" 
  }
];

let supportTickets = [
  { 
    id: "INC-4001", 
    title: "LHC Sect 1-2 Ripple Modulation Instability", 
    description: "Secondary ripple observed on the beam orbit feedback signal traced to PC-LHC-R12 converter harmonics.", 
    severity: "High", 
    status: "Investigating", 
    type: "Incident", 
    rca: "Suspected breakdown in the active power filter (APF) controller phase-locked loop synchronization.", 
    resolution: "", 
    date: "2026-06-24" 
  },
  { 
    id: "BUG-502", 
    title: "Modbus Over-polling Buffer Overflow", 
    description: "Gateway driver drops connection packets when polling rate drops below 10ms.", 
    severity: "Medium", 
    status: "Pending Fix", 
    type: "Bug", 
    rca: "A TCP connection pool leak inside the Modbus interface queue handler.", 
    resolution: "Implemented connection recycling and rate limiter guard inside Modbus connector.", 
    date: "2026-06-22" 
  },
  { 
    id: "INC-3982", 
    title: "PS Line Rectifier Phase Drop", 
    description: "Brief voltage sag in sector TT2 caused automatic converter shutdown.", 
    severity: "Critical", 
    status: "Resolved", 
    type: "Incident", 
    rca: "External 18kV grid transient due to localized storm activity.", 
    resolution: "Converter successfully auto-restarted on auxiliary power. Normal operation resumed in 12 seconds.", 
    date: "2026-06-18" 
  }
];

let requirements = [
  { 
    id: "REQ-101", 
    title: "Sub-ppm Precision Over-current Protection", 
    description: "Design and implement dual-channel high-speed solid-state circuit breakers with response times < 5 microseconds to protect superconducting magnets.", 
    stakeholder: "Superconducting Magnets Group (TE-MSC)", 
    businessValue: "High", 
    priority: "Critical", 
    status: "Approved", 
    history: [
      { date: "2026-06-01", user: "Dr. Sarah Jenkins", action: "Created requirement proposal" },
      { date: "2026-06-05", user: "Jiten Moni", action: "Approved and prioritized as Critical" }
    ] 
  },
  { 
    id: "REQ-102", 
    title: "Energy Recovery Grid Feedback Loop", 
    description: "Enable regenerative braking power converter modules to feed back surplus cryogenic energy directly into the local 18kV grid.", 
    stakeholder: "CERN Energy Management Group", 
    businessValue: "High", 
    priority: "High", 
    status: "Under Review", 
    history: [
      { date: "2026-06-15", user: "Marc Dubois", action: "Created proposal" }
    ] 
  },
  { 
    id: "REQ-103", 
    title: "MQTT-SN Telemetry Interface Integration", 
    description: "Implement low-overhead MQTT for sensor endpoints on auxiliary electronics enclosures.", 
    stakeholder: "Industrial Controls Section", 
    businessValue: "Medium", 
    priority: "Low", 
    status: "Draft", 
    history: [
      { date: "2026-06-20", user: "Elena Rostova", action: "Drafted specs" }
    ] 
  }
];

let sprints = [
  { id: "SPR-08", name: "Sprint 8: High Stability & High Speed Breakers", status: "Active", startDate: "2026-06-15", endDate: "2026-06-29", velocityGoal: 40, actualVelocity: 18 },
  { id: "SPR-07", name: "Sprint 7: Modbus Driver Refactoring & Core Telemetry", status: "Completed", startDate: "2026-06-01", endDate: "2026-06-15", velocityGoal: 35, actualVelocity: 38 }
];

let backlogItems = [
  { id: "BL-101", title: "Develop dual-channel SS breaker PCB prototype", description: "Design layout with ultra-low inductance copper tracks for high peak currents.", sprintId: "SPR-08", storyPoints: 8, status: "In Progress", assignedUser: "Dr. Sarah Jenkins", priority: "Critical" },
  { id: "BL-102", title: "Implement Modbus TCP connection pool recycler", description: "Solve socket leaks during telemetry polling bursts.", sprintId: "SPR-08", storyPoints: 5, status: "Done", assignedUser: "Dr. Sarah Jenkins", priority: "High" },
  { id: "BL-103", title: "Simulate IGBT pulse performance in SPICE", description: "Verify over-temperature behavior at 120% load thresholds.", sprintId: "SPR-08", storyPoints: 3, status: "To Do", assignedUser: "Marc Dubois", priority: "Medium" },
  { id: "BL-104", title: "Code SSE Telemetry Stream Endpoint", description: "Build server-sent events service for live UI telemetry update.", sprintId: "SPR-08", storyPoints: 5, status: "Done", assignedUser: "Jiten Moni", priority: "High" },
  { id: "BL-105", title: "Design database physical tables schema", description: "Generate SQL scripts compatible with Oracle DB migration.", sprintId: "SPR-08", storyPoints: 5, status: "Done", assignedUser: "Jiten Moni", priority: "High" },
  { id: "BL-106", title: "Kubernetes configuration yaml design", description: "Formulate pod affinity policies and rolling update profiles.", sprintId: "SPR-08", storyPoints: 2, status: "Review", assignedUser: "Jiten Moni", priority: "Medium" }
];

let auditLogs = [
  { id: "LOG-01", timestamp: "2026-06-24T06:30:11-07:00", user: "Jiten Moni", action: "User Login", module: "Authentication", details: "Administrator logged in from control terminal (127.0.0.1)." },
  { id: "LOG-02", timestamp: "2026-06-24T06:15:00-07:00", user: "Marc Dubois", action: "Update Maintenance status", module: "Maintenance", details: "Changed MNT-902 status to In Progress." },
  { id: "LOG-03", timestamp: "2026-06-24T05:35:12-07:00", user: "Dr. Sarah Jenkins", action: "Acknowledge Alarm", module: "Alarms", details: "Acknowledged critical alarm ALM-302 on Deflector Modulator." }
];

let notifications = [
  { id: "NTF-01", timestamp: "2026-06-24T06:12:00-07:00", type: "Alarm", message: "ALM-301 HIGH: Temperature exceeded 75°C on Sextupole Cryo-Compensator.", read: false, severity: "High" },
  { id: "NTF-02", timestamp: "2026-06-24T05:30:00-07:00", type: "Alarm", message: "ALM-302 CRITICAL: Interlock Relay Failure on Heavy-Ion Deflector.", read: false, severity: "Critical" },
  { id: "NTF-03", timestamp: "2026-06-24T06:15:00-07:00", type: "Maintenance", message: "MNT-902: Marc Dubois started work on cooling loop intervention.", read: true, severity: "Low" }
];

// Telemetry Realtime Updates (Updates live active assets via standard timer)
setInterval(() => {
  assets.forEach(asset => {
    if (asset.status === "Active" || asset.status === "Warning") {
      // Random walk generator
      if (asset.id === "PC-LHC-R12") {
        asset.voltage = +(100.0 + (Math.random() - 0.5) * 1.5).toFixed(2);
        asset.current = +(48.5 + (Math.random() - 0.5) * 0.8).toFixed(2);
        asset.temperature = +(42.6 + (Math.random() - 0.5) * 0.4).toFixed(2);
      } else if (asset.id === "PC-SPS-B3") {
        asset.voltage = +(11.8 + (Math.random() - 0.5) * 0.2).toFixed(2);
        asset.current = +(5850.0 + (Math.random() - 0.5) * 50).toFixed(1);
        asset.temperature = +(54.2 + (Math.random() - 0.5) * 0.6).toFixed(2);
      } else if (asset.id === "PC-PS-C5") {
        asset.voltage = +(395.0 + (Math.random() - 0.5) * 4).toFixed(2);
        asset.current = +(245.0 + (Math.random() - 0.5) * 2).toFixed(2);
        asset.temperature = +(38.1 + (Math.random() - 0.5) * 0.3).toFixed(2);
      } else if (asset.id === "PC-LHC-L45") {
        asset.voltage = +(4.8 + (Math.random() - 0.5) * 0.1).toFixed(2);
        asset.current = +(492.0 + (Math.random() - 0.5) * 8).toFixed(1);
        asset.temperature = +(78.4 + (Math.random() - 0.3) * 0.8).toFixed(2); // drifting up occasionally
        if (asset.temperature > 80.0) {
          asset.status = "Warning";
        }
      }
      asset.efficiency = +(94.0 + (Math.random() - 0.5) * 1.2).toFixed(2);
    }
  });
}, 2500);

// Helper helper for audit logging
function addAudit(action: string, module: string, details: string) {
  const newLog = {
    id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
    timestamp: new Date().toISOString(),
    user: currentUser ? currentUser.name : "System Daemon",
    action,
    module,
    details
  };
  auditLogs.unshift(newLog);
}

// ==========================================
// MOCK SQL QUERY PARSER (FOR ARCHITECTURE DISPLAY)
// ==========================================
function parseAndRunSQL(query: string): { rows: any[]; columns: string[]; error?: string } {
  try {
    const cleanQuery = query.trim().replace(/;$/, "");
    const selectMatch = cleanQuery.match(/^SELECT\s+(.*?)\s+FROM\s+(\w+)(?:\s+WHERE\s+(.*?))?(?:\s+ORDER\s+BY\s+(\w+)\s*(ASC|DESC)?)?$/i);
    
    if (!selectMatch) {
      return {
        rows: [],
        columns: [],
        error: "Syntax Error: Only simple SELECT queries are supported in the operations console (e.g., SELECT * FROM assets WHERE status = 'Active')"
      };
    }

    const selectCols = selectMatch[1].trim();
    const tableName = selectMatch[2].trim().toLowerCase();
    const whereClause = selectMatch[3] ? selectMatch[3].trim() : null;
    const orderByCol = selectMatch[4] ? selectMatch[4].trim() : null;
    const orderDirection = selectMatch[5] ? selectMatch[5].toUpperCase() : "ASC";

    let targetData: any[] = [];
    if (tableName === "users") targetData = users;
    else if (tableName === "assets") targetData = assets;
    else if (tableName === "alarms") targetData = alarms;
    else if (tableName === "maintenance_records" || tableName === "maintenance") targetData = maintenanceRecords;
    else if (tableName === "support_tickets" || tableName === "support") targetData = supportTickets;
    else if (tableName === "requirements") targetData = requirements;
    else if (tableName === "sprints") targetData = sprints;
    else if (tableName === "backlog_items" || tableName === "backlog") targetData = backlogItems;
    else if (tableName === "audit_logs" || tableName === "audit") targetData = auditLogs;
    else if (tableName === "notifications") targetData = notifications;
    else {
      return {
        rows: [],
        columns: [],
        error: `Database Error: Table '${tableName}' does not exist. Supported: users, assets, alarms, maintenance_records, support_tickets, requirements, sprints, backlog_items, audit_logs`
      };
    }

    // Process WHERE clause
    let filteredData = [...targetData];
    if (whereClause) {
      // Basic support for column = 'value' or column = value
      const eqMatch = whereClause.match(/^(\w+)\s*=\s*(['"]?)(.*?)\2$/i);
      if (eqMatch) {
        const col = eqMatch[1];
        const val = eqMatch[3];
        filteredData = filteredData.filter(item => {
          if (!(col in item)) return false;
          return String(item[col]).toLowerCase() === val.toLowerCase();
        });
      } else {
        // Fallback or broader matches
        return {
          rows: [],
          columns: [],
          error: "SQL Engine Limit: Only basic equality filters are supported currently, e.g., status = 'Active'"
        };
      }
    }

    // Process Order By
    if (orderByCol) {
      filteredData.sort((a, b) => {
        let valA = a[orderByCol];
        let valB = b[orderByCol];
        if (typeof valA === "string") valA = valA.toLowerCase();
        if (typeof valB === "string") valB = valB.toLowerCase();
        
        if (valA < valB) return orderDirection === "DESC" ? 1 : -1;
        if (valA > valB) return orderDirection === "DESC" ? -1 : 1;
        return 0;
      });
    }

    // Process Select columns
    let columns: string[] = [];
    if (selectCols === "*") {
      if (filteredData.length > 0) {
        columns = Object.keys(filteredData[0]);
      } else {
        columns = ["id"];
      }
    } else {
      columns = selectCols.split(",").map(c => c.trim());
    }

    const rows = filteredData.map(item => {
      const rowObj: any = {};
      columns.forEach(col => {
        rowObj[col] = item[col] !== undefined ? item[col] : null;
      });
      return rowObj;
    });

    return { rows, columns };
  } catch (err: any) {
    return { rows: [], columns: [], error: `Execution Exception: ${err.message}` };
  }
}

// ==========================================
// REST API LAYER
// ==========================================

// Authenticate / Status
app.get("/api/auth/user", (req, res) => {
  res.json({ user: currentUser });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (user) {
    currentUser = user;
    addAudit("User Login", "Authentication", `Successfully authenticated user ${user.name}`);
    res.json({ success: true, user });
  } else {
    res.status(401).json({ error: "Invalid credentials. Try using one of the pre-loaded engineers." });
  }
});

app.post("/api/auth/reset-password", (req, res) => {
  const { email } = req.body;
  res.json({ success: true, message: `Password reset instructions dispatched to ${email}` });
});

app.post("/api/auth/logout", (req, res) => {
  addAudit("User Logout", "Authentication", `Logged out ${currentUser?.name || 'unknown user'}`);
  currentUser = users[3]; // Fallback to Guest/Operator role
  res.json({ success: true });
});

// Assets Endpoints
app.get("/api/assets", (req, res) => {
  res.json(assets);
});

app.post("/api/assets", (req, res) => {
  const newAsset = { ...req.body, id: `PC-${req.body.type.includes("Volt") ? "LHC" : "SPS"}-${Math.floor(100 + Math.random() * 900)}` };
  assets.push(newAsset);
  addAudit("Create Asset", "Assets", `Registered new asset ${newAsset.id} (${newAsset.name})`);
  res.status(201).json(newAsset);
});

app.put("/api/assets/:id", (req, res) => {
  const idx = assets.findIndex(a => a.id === req.params.id);
  if (idx !== -1) {
    assets[idx] = { ...assets[idx], ...req.body };
    addAudit("Edit Asset", "Assets", `Modified configuration details for asset ${req.params.id}`);
    res.json(assets[idx]);
  } else {
    res.status(404).json({ error: "Asset not found" });
  }
});

app.delete("/api/assets/:id", (req, res) => {
  const idx = assets.findIndex(a => a.id === req.params.id);
  if (idx !== -1) {
    const deleted = assets[idx];
    assets.splice(idx, 1);
    addAudit("Delete Asset", "Assets", `Decommissioned asset ${deleted.id}`);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Asset not found" });
  }
});

// Alarms Endpoints
app.get("/api/alarms", (req, res) => {
  res.json(alarms);
});

app.put("/api/alarms/:id/acknowledge", (req, res) => {
  const alarm = alarms.find(a => a.id === req.params.id);
  if (alarm) {
    alarm.status = "Acknowledged";
    alarm.assignedUser = currentUser.name;
    addAudit("Acknowledge Alarm", "Alarms", `Acknowledged alarm ${alarm.id} for ${alarm.assetId}`);
    res.json(alarm);
  } else {
    res.status(404).json({ error: "Alarm not found" });
  }
});

app.put("/api/alarms/:id/resolve", (req, res) => {
  const alarm = alarms.find(a => a.id === req.params.id);
  if (alarm) {
    alarm.status = "Resolved";
    // Also resolve warning/offline state of the asset
    const asset = assets.find(a => a.id === alarm.assetId);
    if (asset) {
      asset.status = "Active";
      asset.temperature = 40.0;
      asset.healthScore = 95;
    }
    addAudit("Resolve Alarm", "Alarms", `Resolved alarm ${alarm.id} on ${alarm.assetId}`);
    res.json(alarm);
  } else {
    res.status(404).json({ error: "Alarm not found" });
  }
});

app.put("/api/alarms/:id/escalate", (req, res) => {
  const alarm = alarms.find(a => a.id === req.params.id);
  if (alarm) {
    alarm.escalationLevel = (alarm.escalationLevel || 1) + 1;
    addAudit("Escalate Alarm", "Alarms", `Escalated alarm ${alarm.id} to Level ${alarm.escalationLevel}`);
    res.json(alarm);
  } else {
    res.status(404).json({ error: "Alarm not found" });
  }
});

// Maintenance Endpoints
app.get("/api/maintenance", (req, res) => {
  res.json(maintenanceRecords);
});

app.post("/api/maintenance", (req, res) => {
  const newMaint = {
    ...req.body,
    id: `MNT-${Math.floor(904 + Math.random() * 1000)}`,
    status: "Scheduled"
  };
  maintenanceRecords.push(newMaint);
  addAudit("Create Work Order", "Maintenance", `Logged new work order ${newMaint.id}`);
  res.status(201).json(newMaint);
});

app.put("/api/maintenance/:id", (req, res) => {
  const maint = maintenanceRecords.find(m => m.id === req.params.id);
  if (maint) {
    Object.assign(maint, req.body);
    addAudit("Update Maintenance Record", "Maintenance", `Updated work order ${maint.id} status to ${maint.status}`);
    res.json(maint);
  } else {
    res.status(404).json({ error: "Work order not found" });
  }
});

// Support Endpoints
app.get("/api/support", (req, res) => {
  res.json(supportTickets);
});

app.post("/api/support", (req, res) => {
  const newTicket = {
    ...req.body,
    id: `${req.body.type === "Bug" ? "BUG" : "INC"}-${Math.floor(4002 + Math.random() * 1000)}`,
    status: "Open",
    date: new Date().toISOString().split('T')[0]
  };
  supportTickets.unshift(newTicket);
  addAudit("Create Support Ticket", "Support", `Filed support ticket ${newTicket.id} - ${newTicket.title}`);
  res.status(201).json(newTicket);
});

app.put("/api/support/:id", (req, res) => {
  const ticket = supportTickets.find(t => t.id === req.params.id);
  if (ticket) {
    Object.assign(ticket, req.body);
    addAudit("Update Support Ticket", "Support", `Modified ticket ${ticket.id} (${ticket.status})`);
    res.json(ticket);
  } else {
    res.status(404).json({ error: "Ticket not found" });
  }
});

app.get("/api/support/kb", (req, res) => {
  const kb = [
    { id: "KB-101", category: "Power Circuits", title: "Active Filter Bank Voltage Ripple troubleshooting", body: "Check primary oil insulation level, check PLL phase synchronization offset inside active rectifiers." },
    { id: "KB-102", category: "Interlocks", title: "Thyratron Trigger Board replacement procedure", body: "Disable primary modular 18kV incoming breakers. Wait 5 minutes for capacitor discharge. Replace board PC-TRIG-X1." },
    { id: "KB-103", category: "Agile Sprints", title: "CERN Power Operations board setup", body: "Standard Scrum workflow utilizes Kanban board tracking story weight velocities. Completed items require peer engineer approval." }
  ];
  res.json(kb);
});

// Requirements Endpoints
app.get("/api/requirements", (req, res) => {
  res.json(requirements);
});

app.post("/api/requirements", (req, res) => {
  const newReq = {
    id: `REQ-${Math.floor(104 + Math.random() * 100)}`,
    ...req.body,
    status: "Draft",
    history: [{ date: new Date().toISOString().split('T')[0], user: currentUser.name, action: "Created requirement proposal" }]
  };
  requirements.push(newReq);
  addAudit("Propose Requirement", "Requirements", `Created requirement ${newReq.id}: ${newReq.title}`);
  res.status(201).json(newReq);
});

app.put("/api/requirements/:id/status", (req, res) => {
  const reqItem = requirements.find(r => r.id === req.params.id);
  if (reqItem) {
    const oldStatus = reqItem.status;
    reqItem.status = req.body.status;
    reqItem.history.push({
      date: new Date().toISOString().split('T')[0],
      user: currentUser.name,
      action: `Status transitioned from ${oldStatus} to ${reqItem.status}`
    });
    addAudit("Update Requirement Status", "Requirements", `Changed requirement ${reqItem.id} to ${reqItem.status}`);
    res.json(reqItem);
  } else {
    res.status(404).json({ error: "Requirement not found" });
  }
});

// Scrum Agile Endpoints
app.get("/api/scrum/sprints", (req, res) => {
  res.json(sprints);
});

app.get("/api/scrum/backlog", (req, res) => {
  res.json(backlogItems);
});

app.post("/api/scrum/backlog", (req, res) => {
  const newItem = {
    id: `BL-${Math.floor(107 + Math.random() * 1000)}`,
    ...req.body
  };
  backlogItems.push(newItem);
  addAudit("Create Backlog Item", "Scrum", `Created Agile backlog item ${newItem.id}: ${newItem.title}`);
  res.status(201).json(newItem);
});

app.put("/api/scrum/backlog/:id", (req, res) => {
  const item = backlogItems.find(b => b.id === req.params.id);
  if (item) {
    const oldStatus = item.status;
    Object.assign(item, req.body);
    if (oldStatus !== item.status) {
      addAudit("Move Backlog Item", "Scrum", `Moved ${item.id} from ${oldStatus} to ${item.status}`);
    } else {
      addAudit("Edit Backlog Item", "Scrum", `Updated card details for ${item.id}`);
    }
    res.json(item);
  } else {
    res.status(404).json({ error: "Item not found" });
  }
});

// Notifications Endpoints
app.get("/api/notifications", (req, res) => {
  res.json(notifications);
});

app.put("/api/notifications/read-all", (req, res) => {
  notifications.forEach(n => n.read = true);
  res.json({ success: true });
});

// Audit Logs Endpoints
app.get("/api/audit-logs", (req, res) => {
  res.json(auditLogs);
});

// SQL Direct execution
app.post("/api/sql", (req, res) => {
  const { query } = req.body;
  const result = parseAndRunSQL(query);
  res.json(result);
});

// System Health Status Check
app.get("/api/health", (req, res) => {
  const total = assets.length;
  const active = assets.filter(a => a.status === "Active").length;
  const offline = assets.filter(a => a.status === "Offline").length;
  const healthSum = assets.reduce((sum, a) => sum + a.healthScore, 0);
  const healthScore = total > 0 ? Math.round(healthSum / total) : 100;
  
  res.json({
    status: "Healthy",
    uptime: "99.982%",
    host: "0.0.0.0:3000",
    healthScore,
    counts: { total, active, offline },
    timestamp: new Date().toISOString()
  });
});

// Live Telemetry stream (SSE - Server Sent Events)
app.get("/api/telemetry/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Send initial data instantly
  res.write(`data: ${JSON.stringify({ assets, alarms, notifications })}\n\n`);

  const intervalId = setInterval(() => {
    // Inject rare random fault
    if (Math.random() > 0.94) {
      const liveAssets = assets.filter(a => a.status === "Active");
      if (liveAssets.length > 0) {
        const victim = liveAssets[Math.floor(Math.random() * liveAssets.length)];
        victim.status = "Warning";
        victim.temperature = 79.5;
        victim.healthScore = 70;

        const alarmId = `ALM-${Math.floor(303 + Math.random() * 100)}`;
        const newAlarm = {
          id: alarmId,
          assetId: victim.id,
          severity: "High" as const,
          title: "Thermal Excursion Detected",
          description: `Automatic alarm raised. Temperature on ${victim.name} drifted past cooling parameter rules.`,
          timestamp: new Date().toISOString(),
          status: "Active" as const,
          assignedUser: "",
          escalationLevel: 1
        };
        alarms.unshift(newAlarm);
        
        notifications.unshift({
          id: `NTF-${Math.floor(10 + Math.random() * 100)}`,
          timestamp: new Date().toISOString(),
          type: "Alarm",
          message: `${alarmId} HIGH: Heat spike on ${victim.id}`,
          read: false,
          severity: "High"
        });
      }
    }

    res.write(`data: ${JSON.stringify({ assets, alarms, notifications })}\n\n`);
  }, 3000);

  req.on("close", () => {
    clearInterval(intervalId);
    res.end();
  });
});

// DevOps Simulated Deployment Pipeline logs
app.get("/api/devops/deploy", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const buildLogs = [
    "[INFO] Initializing CI/CD Deployment pipeline workflow...",
    "[INFO] Triggered by: Jiten Moni via Operations Console Console-Deployment-Engine.",
    "[INFO] Fetching main branch head commit hash: e3fb82...",
    "[CI/CD] STEP 1/4: Static Code Linting & Compilation...",
    "Executing: npm run lint",
    "[SUCCESS] TypeScript compiler check completed successfully. 0 errors detected.",
    "Executing: npm run build",
    "vite v6.2.3 building for production...",
    "transforming (42) src/main.tsx...",
    "✓ 212 modules transformed.",
    "dist/index.html                  0.82 kB │ gzip:  0.41 kB",
    "dist/assets/index-D78Bf9.css   120.45 kB │ gzip: 18.22 kB",
    "dist/assets/index-A48Bc5.js    425.10 kB │ gzip: 112.50 kB",
    "[SUCCESS] Frontend statically optimized into dist/ directory.",
    "esbuild bundling server.ts into dist/server.cjs...",
    "[SUCCESS] Node.js server.ts fully bundled to CJS. Single file build completed successfully.",
    "[CI/CD] STEP 2/4: Docker Image Packaging...",
    "Executing: docker build -t ghcr.io/cern-ops/ops-center:latest .",
    "Step 1/11 : FROM node:20-alpine AS builder",
    " ---> e31245ba89c1",
    "Step 2/11 : WORKDIR /app",
    " ---> Using cache",
    "Step 3/11 : COPY package*.json ./",
    " ---> Successfully copied to builder workspace.",
    "Step 4/11 : RUN npm ci",
    " ---> Added 254 production/dev dependencies in 4.12s.",
    "Step 5/11 : COPY . .",
    " ---> Bundling current workspace state.",
    "Step 6/11 : RUN npm run build",
    " ---> Re-using optimized build output.",
    "Step 7/11 : FROM node:20-alpine",
    " ---> e31245ba89c1",
    "Step 8/11 : COPY --from=builder /app/dist ./dist",
    " ---> Loaded production files.",
    "Step 9/11 : RUN npm ci --only=production",
    " ---> Pruned development modules. Final size: 142MB.",
    "Step 10/11 : EXPOSE 3000",
    "Step 11/11 : CMD node dist/server.cjs",
    " ---> Successfully built image hash sha256:d8fb2a45bc12",
    "[CI/CD] STEP 3/4: Push Container Image to Registry...",
    "Pushed: ghcr.io/cern-ops/ops-center:latest (142MB)",
    "Pushed: ghcr.io/cern-ops/ops-center:e3fb82 (142MB)",
    "[SUCCESS] Container image secure in registry.",
    "[CI/CD] STEP 4/4: Kubernetes Desired State Convergence...",
    "Executing: kubectl apply -f kubernetes/deployment.yaml -f kubernetes/service.yaml",
    "deployment.apps/power-converter-ops-center configured",
    "service/power-converter-ops-center-service configured",
    "Rolling update triggered for deployment/power-converter-ops-center (3 replicas)...",
    "[K8s-LOG] Pod 'power-converter-ops-center-7bf5cd986-a1x2' state -> Pending",
    "[K8s-LOG] Pod 'power-converter-ops-center-7bf5cd986-a1x2' state -> ContainerCreating",
    "[K8s-LOG] Pod 'power-converter-ops-center-7bf5cd986-a1x2' state -> Running (Healthcheck OK)",
    "[K8s-LOG] Pod 'power-converter-ops-center-7bf5cd986-b4v5' state -> Pending",
    "[K8s-LOG] Pod 'power-converter-ops-center-7bf5cd986-b4v5' state -> ContainerCreating",
    "[K8s-LOG] Pod 'power-converter-ops-center-7bf5cd986-b4v5' state -> Running (Healthcheck OK)",
    "[K8s-LOG] Terminating obsolete Pod 'power-converter-ops-center-old-64fbca8-x8v2'...",
    "[K8s-LOG] Pod 'power-converter-ops-center-7bf5cd986-c7m8' state -> Pending",
    "[K8s-LOG] Pod 'power-converter-ops-center-7bf5cd986-c7m8' state -> ContainerCreating",
    "[K8s-LOG] Pod 'power-converter-ops-center-7bf5cd986-c7m8' state -> Running (Healthcheck OK)",
    "[K8s-LOG] Terminating obsolete Pod 'power-converter-ops-center-old-64fbca8-z1q3'...",
    "[K8s-LOG] Terminating obsolete Pod 'power-converter-ops-center-old-64fbca8-w3p5'...",
    "[SUCCESS] Rolling update fully converged. All 3 replicas running on latest Docker build e3fb82.",
    "[DEPLOYMENT SUCCESSFUL] All services online at https://power-ops.cern.ch"
  ];

  let logIdx = 0;
  const intervalId = setInterval(() => {
    if (logIdx < buildLogs.length) {
      res.write(`data: ${JSON.stringify({ log: buildLogs[logIdx] })}\n\n`);
      logIdx++;
    } else {
      res.write(`data: ${JSON.stringify({ complete: true })}\n\n`);
      clearInterval(intervalId);
      res.end();
    }
  }, 350);

  req.on("close", () => {
    clearInterval(intervalId);
    res.end();
  });
});

// ==========================================
// VITE DEV SERVER / STATIC SERVING
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Dev environment: mount Vite dev server as middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production environment: serve static built files
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[OK] Server running on http://localhost:${PORT}`);
  });
}

startServer();
