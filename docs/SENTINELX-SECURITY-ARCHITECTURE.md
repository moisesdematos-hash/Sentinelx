# SENTINELX - Security Cloud Architecture (FASE 05 - Arquitetura Definitiva)

## Unified Platform Vision: SENTINELX SECURITY CLOUD
The SENTINELX Security Cloud unifies EPP, EDR, Vulnerability Management, SIEM, XDR, Cloud Security, SOAR, and AI Intelligence into a single cohesive security mesh.

```
                                  SENTINELX SECURITY CLOUD
                                             |
                                     GLOBAL SECURITY EDGE
                                             |
                                        API GATEWAY
                                             |
                                   SECURITY CONTROL PLANE
                                             |
        +------------------------------------+------------------------------------+
        |                                    |                                    |
        v                                    v                                    v
   ENDPOINT SECURITY                VULNERABILITY MANAGEMENT               CLOUD SECURITY
 (EPP / EDR / Telemetry)              (CVEs / Risk Score)               (CSPM / K8s / Containers)
        |                                    |                                    |
        +------------------------------------+------------------------------------+
                                             |
                                    EVENT PIPELINE & BUS
                                             |
                                           SIEM
                                             |
                                            XDR
                                             |
                                     SECURITY GRAPH MESH
                                             |
                                      SENTINEL AI BRAIN
                                             |
                                         SOAR ENGINE
                                             |
                                      RESPONSE ENGINE
                                             |
                 +---------------------------+---------------------------+
                 |                                                       |
                 v                                                       v
        AUTOMATED REMEDIATION                                    ALERTING & INCIDENTS
   (eBPF Hot-Patch / Rollback / AST)                       (Slack / WhatsApp / Executive PDF)
```

---

## Core Operational Domains

### 1. Asset Discovery & Exposure Management
- **Asset Inventory**: Unifies Endpoints, Servers, Websites, APIs, Databases, Containers, and Cloud Resources.
- **Risk Score Engine**: Calculates Risk Score based on Criticality, Exposure, Vulnerability, and Threat Intelligence ($Risk = Crit \times Exp \times Vuln \times Threat$).

### 2. EPP & EDR Telemetry Engine
- **Behavioral Protection**: Process activity, file integrity, network sockets, and authentication events.
- **Kernel Hot-Patching**: Ring 0 eBPF kprobes for zero-day vulnerability protection without system reboots.

### 3. SIEM, XDR & Security Graph
- **Event Pipeline**: Ingests, normalizes, and correlates events across Endpoint, Identity, Cloud, and Container layers.
- **Security Graph Mesh**: Maps relationships ($User \rightarrow Identity \rightarrow Endpoint \rightarrow Process \rightarrow Network \rightarrow Cloud Resource$).

### 4. SOAR & Autonomous Response Engine
- **Playbooks**: Automated containment (isolate container, revoke IAM credentials, block WAF IP).
- **Quantum Rollback**: 18ms cryptographic baseline restoration in ransomware events.
- **Enterprise Kill Switch**: 1-click Air-Gap isolation mode.

### 5. Sentinel AI Security Brain
- **Groq Llama 3.3 70B & DeepSeek R1**: Deep reasoning engine providing Root Cause Analysis, 4-step masterclass guidance, and AST code patch synthesis.
- **Continuous Compliance Passport**: Real-time ISO 27001, SOC 2 Type II, and LGPD compliance auditing.
