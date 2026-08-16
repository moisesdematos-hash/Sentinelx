# SENTINELX Architecture Overview

## Multi-Tenant Scoping Model

```
PLATFORM
  └── PARTNER (MSP/MSSP)
        └── ORGANIZATION (Tenant)
              └── ENVIRONMENT (Production, Staging, Dev)
                    └── ASSET (Website, API, Server, Cloud, Container)
```

## Security Control Plane Workflow

```
DISCOVER → INVENTORY → BASELINE → MONITOR → DETECT → ANALYZE → CORRELATE → PRIORITIZE → RECOMMEND → REMEDIATE → VERIFY → RECOVER → LEARN → UPDATE
```

## API-First Contracts
- All API routes are prefixed under `/api/v1`
- Authentication via `Authorization: Bearer <jwt_token>`
- Multi-Tenant Scoping via `X-Organization-Id: <org_uuid>`
- Standard Envelope Response:
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2026-08-16T03:38:00.000Z"
  }
}
```
