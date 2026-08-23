# SENTINELX - MSP/MSSP Multi-Tenant Partner Architecture (FASE 48)

## Partner Multi-Tenancy Hierarchy

```
+------------------------------------------------------------------+
|                    MSP / MSSP PARTNER PORTAL                      |
|                (Centralized Multi-Tenant Dashboard)              |
+------------------------------------------------------------------+
          |
          +-------------------+-------------------+
          |                   |                   |
          v                   v                   v
+-------------------+ +-------------------+ +-------------------+
|  TENANT A (Bank)  | | TENANT B (Health) | | TENANT C (Retail) |
|  - 140 Assets     | |  - 85 Assets      | |  - 220 Assets     |
|  - ISO 27001      | |  - HIPAA          | |  - PCI-DSS v4     |
+-------------------+ +-------------------+ +-------------------+
```

---

## Delegated Administration & Scoping
- **Partner Admin Role**: Manages tenant provisioning, subscription tiers, and global security policies across all client organizations.
- **Tenant Isolation Safeguard**: Every Prisma query enforces `where: { organizationId }` to eliminate cross-tenant data leaks.
- **Custom Branding (White-Label)**: Custom logo URLs, brand colors, custom domain DNS routing, and white-label executive PDF reports for MSP clients.
