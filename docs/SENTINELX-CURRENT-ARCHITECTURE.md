# SENTINELX - Current Architecture (FASE 01 - Auditoria Total)

## Overview & Architecture Blueprint
SENTINELX is an API-first, multi-tenant cybersecurity control plane built on a modular Node.js/TypeScript Express backend and a React/TypeScript Vite frontend.

```
+-------------------------------------------------------------------------+
|                        SENTINELX FRONTEND DASHBOARD                     |
|            (React 18 + TypeScript + Vite + Lucide Icons + Tailwind)     |
+-------------------------------------------------------------------------+
                                    | REST APIs (JSON over HTTP/HTTPS)
                                    v
+-------------------------------------------------------------------------+
|                        EXPRESS V1 API GATEWAY                           |
|       (/api/v1 - Auth Middleware + Tenant Middleware + Rate Limiter)   |
+-------------------------------------------------------------------------+
                                    |
      +-----------------------------+-----------------------------+
      |                             |                             |
      v                             v                             v
+------------------+     +--------------------+     +---------------------+
| CORE & IDENTITY  |     | EPP / EDR / ASSET  |     | SIEM / XDR / GRAPH  |
| (Auth, RBAC, MSP)|     | (Scans, Telemetry) |     | (Events, Detection) |
+------------------+     +--------------------+     +---------------------+
      |                             |                             |
      +-----------------------------+-----------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                         PRISMA ORM & DATA LAYER                         |
|                    (SQLite Dev / PostgreSQL Prod Schema)                |
+-------------------------------------------------------------------------+
```

---

## Technical Stack

| Component | Technology | Version | Purpose |
|---|---|---|---|
| **Frontend Platform** | React + TypeScript + Vite | React 18, Vite 5 | SPA Control Plane & UI Dashboards |
| **Icons & Styling** | Lucide React + GFM Markdown | Lucide 0.454 | Responsive Dark-mode SOC UI |
| **Backend Runtime** | Node.js + Express | Express 4.21 | REST API Gateway & Business Logic |
| **Database ORM** | Prisma ORM | Prisma 5.22 | Type-safe database persistence |
| **Database Engine** | SQLite (Dev) / PostgreSQL (Prod) | SQLite 3 / PG 16 | Relational Multi-Tenant Data Store |
| **Authentication** | JWT + bcryptjs | JWT 9.0, bcrypt 2.4 | Bearer Auth & Password Hashing |
| **Testing Suite** | Vitest + Supertest | Vitest 2.1 | Automated API & Unit Tests |
| **AI Inference** | Groq LPU API / Local Engine | Llama 3.3 70B | Real-time AI Copilot & RCA Engine |

---

## Component Topology & File Structure

```
SENTINELX/
├── client/                      # React Frontend Application
│   ├── src/
│   │   ├── api/                 # Axios-like Fetch Client with JWT injection
│   │   ├── components/layout/   # Sidebar, Header, Mobile Nav, Layout
│   │   ├── pages/               # 40+ Interactive Cybersecurity Dashboards
│   │   └── App.tsx              # Main Navigation & Tab Router
├── server/                      # Express Backend Server
│   ├── prisma/
│   │   └── schema.prisma        # 53 Relational Models (Assets, Incidents, etc.)
│   ├── src/
│   │   ├── controllers/         # 40+ Express Controllers
│   │   ├── middleware/          # Auth, Tenant Scoping, Rate Limiting, Error
│   │   ├── routes/v1/           # API V1 Router Registry
│   │   ├── services/            # Core Cybersecurity Business Logic Services
│   │   └── server.ts            # Entrypoint & HTTP Server Bootstrapper
│   └── tests/                   # Vitest Automated Test Suites
└── docs/                        # Architecture & Operational Documentation
```

---

## Subsystem Functional Classification (FASE 02 - Mapa Funcional)

| Module | Route / Component | Status | Classification |
|---|---|---|---|
| **Authentication & Auth** | `/api/v1/auth` | Live & Verified | `CRÍTICO` / `EXISTENTE` |
| **Multi-Tenancy (MSP/Org)** | `/api/v1/organizations`, `/api/v1/msp` | Live & Verified | `CRÍTICO` / `EXISTENTE` |
| **Asset Discovery & Inventory** | `/api/v1/assets` | Live & Verified | `EXISTENTE` |
| **Vulnerability Management** | `/api/v1/vulnerabilities` | Live & Verified | `EXISTENTE` |
| **EPP & EDR Telemetry** | `/api/v1/monitoring`, `/api/v1/ebpf-hotpatch` | Live & Verified | `EXISTENTE` |
| **Cloud Security (CSPM)** | `/api/v1/cloud-connectors` | Live & Verified | `EXISTENTE` |
| **Threat Detection & Events** | `/api/v1/events`, `/api/v1/detection` | Live & Verified | `EXISTENTE` |
| **Security Graph Engine** | `/api/v1/graph` | Live & Verified | `EXISTENTE` |
| **Risk Scoring Engine** | `/api/v1/risk` | Live & Verified | `EXISTENTE` |
| **SIEM & Log Forwarding** | `/api/v1/siem` | Live & Verified | `EXISTENTE` |
| **XDR & Correlation** | `/api/v1/incidents` | Live & Verified | `EXISTENTE` |
| **SOAR & Playbooks** | `/api/v1/soar`, `/api/v1/autopilot` | Live & Verified | `EXISTENTE` |
| **Deception & Honeytokens** | `/api/v1/honeytokens`, `/api/v1/deception` | Live & Verified | `EXISTENTE` |
| **Sentinel AI Copilot** | `/api/v1/sentinel-ai`, `/api/v1/super-ai-suite` | Live & Verified | `EXISTENTE` |
| **Global Swarm Immunity** | `/api/v1/global-swarm` | Live & Verified | `EXISTENTE` |
| **FinOps Cloud Shield** | `/api/v1/finops-sentinel` | Live & Verified | `EXISTENTE` |
