export type UserRole = 
  | "System Administrator" 
  | "Power Converter Engineer" 
  | "Maintenance Engineer" 
  | "Operator";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: string;
}

export interface Asset {
  id: string;
  name: string;
  type: string;
  location: string;
  status: "Active" | "Warning" | "Offline";
  voltage: number;
  current: number;
  temperature: number;
  efficiency: number;
  healthScore: number;
  assignedEngineer: string;
  installationDate: string;
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
}

export interface Alarm {
  id: string;
  assetId: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  title: string;
  description: string;
  timestamp: string;
  status: "Active" | "Acknowledged" | "Resolved";
  assignedUser?: string;
  escalationLevel: number;
}

export interface MaintenanceRecord {
  id: string;
  assetId: string;
  type: "Preventive" | "Corrective";
  title: string;
  description: string;
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled";
  assignedEngineer: string;
  date: string;
  nextDate: string;
  report?: string;
}

export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  status: "Open" | "Investigating" | "Pending Fix" | "Resolved";
  type: "Bug" | "Incident" | "Feature Request";
  rca?: string;
  resolution?: string;
  date: string;
}

export interface Requirement {
  id: string;
  title: string;
  description: string;
  stakeholder: string;
  businessValue: "High" | "Medium" | "Low";
  priority: "Critical" | "High" | "Medium" | "Low";
  status: "Draft" | "Under Review" | "Approved" | "Rejected" | "Scheduled";
  history: {
    date: string;
    user: string;
    action: string;
  }[];
}

export interface Sprint {
  id: string;
  name: string;
  status: "Planning" | "Active" | "Completed";
  startDate: string;
  endDate: string;
  velocityGoal: number;
  actualVelocity: number;
}

export interface BacklogItem {
  id: string;
  title: string;
  description: string;
  sprintId: string;
  storyPoints: number;
  status: "Backlog" | "To Do" | "In Progress" | "Review" | "Done";
  assignedUser: string;
  priority: "Critical" | "High" | "Medium" | "Low";
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  details: string;
}

export interface SystemNotification {
  id: string;
  timestamp: string;
  type: "Alarm" | "Maintenance" | "System" | "Support";
  message: string;
  read: boolean;
  severity: "Critical" | "High" | "Medium" | "Low";
}
