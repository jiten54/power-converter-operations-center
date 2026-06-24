import React, { useState, useEffect, useRef } from "react";
import { 
  Terminal, 
  Play, 
  Settings, 
  Database, 
  Layers, 
  Server, 
  FileCode, 
  CheckCircle, 
  RefreshCw,
  Clock,
  Cpu,
  AlertTriangle
} from "lucide-react";

export default function DevOpsView() {
  const [activeConfigTab, setActiveConfigTab] = useState("dockerfile");
  const [isDeploying, setIsDeploying] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [pipelineProgress, setPipelineProgress] = useState(0);
  const [deploymentFinished, setDeploymentFinished] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Simulated config contents
  const configs: Record<string, { title: string; lang: string; code: string }> = {
    dockerfile: {
      title: "Dockerfile (Multi-stage Node.js)",
      lang: "dockerfile",
      code: `FROM node:20-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\nFROM node:20-alpine\nWORKDIR /app\nCOPY --from=builder /app/dist ./dist\nCOPY --from=builder /app/package*.json ./\nRUN npm ci --only=production\nENV NODE_ENV=production\nEXPOSE 3000\nCMD ["node", "dist/server.cjs"]`
    },
    compose: {
      title: "docker-compose.yml",
      lang: "yaml",
      code: `version: '3.8'\nservices:\n  ops-center:\n    build:\n      context: .\n      dockerfile: Dockerfile\n    container_name: power-converter-ops-center\n    ports:\n      - "3000:3000"\n    environment:\n      - NODE_ENV=production\n      - GEMINI_API_KEY=\${GEMINI_API_KEY}\n    depends_on:\n      postgres:\n        condition: service_healthy\n\n  postgres:\n    image: postgres:15-alpine\n    container_name: power-ops-db\n    environment:\n      - POSTGRES_USER=postgres\n      - POSTGRES_PASSWORD=secret\n      - POSTGRES_DB=power_ops\n    healthcheck:\n      test: ["CMD-SHELL", "pg_isready -U postgres -d power_ops"]`
    },
    github: {
      title: ".github/workflows/ci-cd.yml",
      lang: "yaml",
      code: `name: CI/CD Operations Pipeline\non:\n  push:\n    branches: [ main ]\njobs:\n  lint-and-test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3\n      - uses: actions/setup-node@v3\n      - run: npm ci\n      - run: npm run lint\n      - run: npm run build\n  docker-build:\n    needs: lint-and-test\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3\n      - run: docker build -t ghcr.io/cern-ops/ops-center:latest .\n      - run: docker push ghcr.io/cern-ops/ops-center:latest`
    },
    k8s: {
      title: "kubernetes/deployment.yaml",
      lang: "yaml",
      code: `apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: power-converter-ops-center\nspec:\n  replicas: 3\n  strategy:\n    type: RollingUpdate\n  template:\n    spec:\n      containers:\n        - name: ops-center\n          image: ghcr.io/cern-ops/ops-center:latest\n          ports:\n            - containerPort: 3000\n          livenessProbe:\n            httpGet:\n              path: /api/health\n              port: 3000`
    }
  };

  // Auto scroll terminal
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  // Trigger simulated rollout pipeline streaming logs
  const triggerDeploy = () => {
    if (isDeploying) return;
    setIsDeploying(true);
    setDeploymentFinished(false);
    setLogs([]);
    setPipelineProgress(0);

    const eventSource = new EventSource("/api/devops/deploy");

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.log) {
        setLogs((prev) => [...prev, data.log]);
        setPipelineProgress((prev) => Math.min(prev + 2, 100));
      }
      if (data.complete) {
        setLogs((prev) => [...prev, "[SUCCESS] CI/CD Workflow completed. Replicas scaled. Production live."]);
        setPipelineProgress(100);
        setDeploymentFinished(true);
        setIsDeploying(false);
        eventSource.close();
      }
    };

    eventSource.onerror = (err) => {
      setLogs((prev) => [...prev, "[ERROR] Pipeline transport disrupted. Re-trying rollout sync..."]);
      setIsDeploying(false);
      eventSource.close();
    };
  };

  return (
    <div className="space-y-6 text-slate-300 font-sans" id="devops-view">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center">
          <Terminal size={20} className="text-blue-500 mr-2 animate-pulse" />
          DevOps Orchestrator & Rollout Console
        </h1>
        <p className="text-xs text-slate-400 font-sans">
          Trigger production CI/CD builds, inspect orchestration manifests, and monitor rolling updates across 3 Kubernetes replicas.
        </p>
      </div>

      {/* Deployment & Pipeline Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Terminal emulator (spanning 2 cols) */}
        <div className="lg:col-span-2 space-y-3 flex flex-col h-full animate-fade-in">
          <div className="flex justify-between items-center bg-[#161a23] px-4 py-3 border border-slate-800 rounded-t-xl shrink-0">
            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider flex items-center">
              <span className={`h-2 w-2 rounded-full mr-2 ${isDeploying ? "bg-amber-500 animate-ping" : "bg-emerald-500"}`}></span>
              Pipeline Output Console Logs
            </span>
            <button
              onClick={triggerDeploy}
              disabled={isDeploying}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-md font-mono cursor-pointer ${
                isDeploying 
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
                  : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/10"
              }`}
              id="btn-deploy"
            >
              <Play size={11} className={isDeploying ? "animate-spin" : ""} />
              <span>{isDeploying ? "Rolling Out..." : "Deploy to Production"}</span>
            </button>
          </div>

          {/* Terminal Box */}
          <div className="bg-[#0b0e14] border-x border-b border-slate-800 rounded-b-xl flex-1 p-4 font-mono text-[11px] leading-relaxed overflow-y-auto max-h-[300px] min-h-[300px] shadow-inner text-slate-300 space-y-1">
            {logs.length === 0 ? (
              <div className="text-slate-600 text-center py-20">
                Click "Deploy to Production" to execute the CI/CD compilation and Kubernetes rollout pipeline.
              </div>
            ) : (
              logs.map((log, i) => (
                <div 
                  key={i} 
                  className={
                    log.includes("[SUCCESS]") ? "text-emerald-400 font-bold" :
                    log.includes("[ERROR]") ? "text-rose-400 font-bold" :
                    log.includes("[INFO]") ? "text-slate-500" :
                    log.includes("[CI/CD]") ? "text-indigo-400 font-extrabold" :
                    "text-blue-400"
                  }
                >
                  {log}
                </div>
              ))
            )}
            <div ref={terminalEndRef} />
          </div>
        </div>

        {/* Replica Cluster maps & monitoring */}
        <div className="space-y-4 font-mono text-xs animate-fade-in">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center font-sans">
            <Server size={15} className="text-blue-400 mr-2" />
            Active Cluster Topology
          </h2>

          <div className="bg-[#161a23] border border-slate-800 p-5 rounded-xl space-y-4">
            <div className="space-y-2">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Deployment Replicas</span>
              <div className="space-y-2.5">
                {[
                  { pod: "ops-center-7bf5cd-a1x2", status: "Running", cpu: "12m", mem: "148MB" },
                  { pod: "ops-center-7bf5cd-b4v5", status: "Running", cpu: "18m", mem: "152MB" },
                  { pod: "ops-center-7bf5cd-c7m8", status: "Running", cpu: "15m", mem: "144MB" }
                ].map((pod, i) => (
                  <div key={i} className="bg-[#0b0e14] p-3 rounded-lg border border-slate-850 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className={`h-2 w-2 rounded-full bg-emerald-500 ${isDeploying ? "animate-pulse" : ""}`}></span>
                      <div className="flex flex-col">
                        <span className="text-slate-200 text-[10px] font-bold">{pod.pod}</span>
                        <span className="text-[9px] text-emerald-400 uppercase font-extrabold">State: {pod.status}</span>
                      </div>
                    </div>
                    <div className="text-right text-[9px] text-slate-500 flex flex-col">
                      <span>CPU: {pod.cpu}</span>
                      <span>MEM: {pod.mem}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ingress Router status */}
            <div className="bg-[#0b0e14] p-3 rounded-lg border border-slate-850 flex justify-between items-center text-[10px]">
              <div className="flex items-center space-x-2">
                <Database size={11} className="text-blue-400" />
                <span className="text-slate-300 font-bold">PostgreSQL Sync Connection</span>
              </div>
              <span className="text-emerald-400 font-bold uppercase">Online</span>
            </div>

          </div>
        </div>

      </div>

      {/* DevOps Manifest File Viewer */}
      <div className="bg-[#161a23] border border-slate-800 rounded-xl p-5 space-y-4 animate-fade-in">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center font-sans">
          <FileCode size={15} className="text-indigo-400 mr-2" />
          Infrastructure Config Manifests
        </h2>

        <div className="flex flex-wrap border-b border-slate-800">
          {Object.keys(configs).map((key) => (
            <button
              key={key}
              onClick={() => setActiveConfigTab(key)}
              className={`px-4 py-2 text-xs font-mono font-bold transition-all cursor-pointer ${
                activeConfigTab === key 
                  ? "border-b-2 border-blue-500 text-blue-400" 
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {key.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="bg-[#0b0e14] p-4 rounded-xl border border-slate-800/80 font-mono text-[11px] leading-relaxed text-slate-400 overflow-x-auto whitespace-pre">
          {configs[activeConfigTab].code}
        </div>
      </div>

    </div>
  );
}
