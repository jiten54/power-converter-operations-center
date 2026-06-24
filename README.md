# Power Converter Operations Center

A full-stack operational platform for monitoring, managing, and maintaining industrial power converter systems.

The application provides real-time telemetry visualization, asset lifecycle management, alarm handling, maintenance workflows, stakeholder collaboration, support operations, and engineering analytics through a unified web interface.

Built using modern web technologies and cloud-native deployment practices, the platform demonstrates the architecture commonly found in industrial control, operations management, and engineering support systems.


---

## Features

### Operations Dashboard

* System health overview
* Active asset monitoring
* Alarm summaries
* Maintenance status tracking
* Operational KPIs

### Asset Management

* Asset registration and tracking
* Equipment lifecycle management
* Search and filtering
* Asset ownership and assignment

### Real-Time Monitoring

* Live telemetry streaming
* Voltage monitoring
* Current monitoring
* Temperature tracking
* Performance visualization

### Alarm Management

* Severity-based alarm classification
* Alarm acknowledgment
* Escalation workflows
* Resolution tracking
* Historical event records

### Maintenance Operations

* Preventive maintenance scheduling
* Corrective maintenance workflows
* Work order management
* Maintenance reporting

### Support Operations

* Incident management
* Ticket tracking
* Root cause analysis
* Knowledge base

### Requirements & Planning

* Requirement collection
* Change request workflows
* Stakeholder collaboration
* Product backlog management

### Scrum Workspace

* Sprint planning
* Kanban boards
* Story point tracking
* Burndown analytics

---

## Architecture

```text
Frontend (Vue 3)
        │
        ▼
REST API (FastAPI)
        │
        ▼
PostgreSQL
        │
        ▼
Telemetry & Operational Data
```

### Components

* Frontend Client
* Authentication Service
* Asset Service
* Monitoring Service
* Alarm Service
* Maintenance Service
* Support Service
* Requirements Service
* Analytics Service

---

## Technology Stack

### Frontend

* Vue 3
* TypeScript
* Pinia
* Vite
* Tailwind CSS
* Chart.js

### Backend

* FastAPI
* SQLAlchemy
* Pydantic
* AsyncIO

### Database

* PostgreSQL

### Infrastructure

* Docker
* Docker Compose
* GitHub Actions
* Kubernetes Manifests

---

## Getting Started

### Clone Repository

```bash
git clone https://github.com/jiten54/power-converter-operations-center.git
cd power-converter-operations-center
```

### Frontend

```bash
npm install
npm run dev
```

### Backend

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Environment Variables

```env
DATABASE_URL=
JWT_SECRET=
API_URL=
```

---

## Deployment

| Service  | Platform        |
| -------- | --------------- |
| Frontend | Vercel          |
| Backend  | Render          |
| Database | Neon PostgreSQL |

---

## Roadmap

* Oracle database support
* Redis caching
* Prometheus metrics
* Grafana dashboards
* Predictive maintenance
* Digital twin simulation
* Multi-facility support

---

## License

MIT License
