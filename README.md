# SENTINELX - Autonomous Continuous Cyber Defense Platform

> **"Detect. Understand. Remediate. Verify."**

SENTINELX is an enterprise-grade autonomous continuous cyber defense platform built as a multi-tenant Security Control Plane for authorized websites, APIs, servers, cloud infrastructure, containers, and applications.

---

## 🚀 Key Architectural Pillars

1. **Security Control Plane**: Centralized asset discovery, baseline modeling, risk scoring, threat correlation, autonomous autopilot, and safe remediation.
2. **API-First Design**: All features accessible via `/api/v1` REST API, secured by JWT and scoped API keys.
3. **Native Multi-Tenancy & MSP Support**: `Partner (MSP)` -> `Organization` -> `Environment` -> `Asset` hierarchy with strict data isolation.
4. **Autonomous Autopilot**: Safe remediation engine with multi-level policy enforcement, required approvals, backup snapshots, rollbacks, and verification rescans.
5. **Modern Dark UI**: Glassmorphic control plane designed for high-density security operations.

---

## 🛠️ Tech Stack

- **Backend**: Node.js, TypeScript, Express.js, Prisma ORM, SQLite/PostgreSQL, Pino Logger.
- **Frontend**: React 18, Vite, TypeScript, Vanilla CSS Cyber Design System, Lucide Icons.
- **Testing**: Vitest, Supertest.

---

## 🚦 Getting Started

### Prerequisites
- Node.js >= v20
- npm >= 10

### 1. Install Dependencies
```bash
npm install
npm --prefix server install
npm --prefix client install
```

### 2. Prepare Database & Seed Demo Data
```bash
cd server
npm run db:push
npm run db:seed
```

### 3. Run Automated Tests
```bash
cd server
npm test
```

### 4. Start Development Servers
```bash
# From workspace root:
npm run dev
```

- Control Plane Interface: `http://localhost:5173`
- REST API Endpoint: `http://localhost:4000/api/v1/health`

### Demo Credentials
- **Email**: `admin@sentinelx.io`
- **Password**: `Admin@SentinelX2026`
