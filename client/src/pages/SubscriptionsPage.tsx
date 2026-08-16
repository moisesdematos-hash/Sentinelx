import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import {
  CreditCard,
  Zap,
  CheckCircle2,
  RotateCw,
  Award,
  Layers,
  ArrowUpRight,
  Shield,
  Cloud,
  X,
} from 'lucide-react';

export const SubscriptionsPage: React.FC = () => {
  const [sub, setSub] = useState<any>(null);
  const [entitlements, setEntitlements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [upgradingTier, setUpgradingTier] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [subRes, entRes]: any = await Promise.all([
        apiClient.get('/subscriptions'),
        apiClient.get('/subscriptions/entitlements'),
      ]);

      if (subRes.success) setSub(subRes.data);
      if (entRes.success) setEntitlements(entRes.data);
    } catch (err) {
      console.error('Failed to load subscription data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpgrade = async (planTier: string) => {
    setUpgradingTier(planTier);
    try {
      const res: any = await apiClient.post('/subscriptions/upgrade', { planTier });
      if (res.success) loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to upgrade subscription tier');
    } finally {
      setUpgradingTier(null);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
        [SENTINELX BILLING ENGINE] CONNECTING TO MARKETPLACE METERING & SUBSCRIPTION TIER WORKER...
      </div>
    );
  }

  const plans = [
    {
      tier: 'COMMUNITY',
      name: 'Community Plan',
      price: '$0 / mo',
      assets: 10,
      scans: '100 / mo',
      features: ['Basic Vulnerability Scans', 'Single Domain Monitoring', 'Community Discord Support'],
    },
    {
      tier: 'PROFESSIONAL',
      name: 'Professional Plan',
      price: '$499 / mo',
      assets: 100,
      scans: '2,500 / mo',
      features: ['Continuous Asset Monitoring', 'SOAR Automated Playbooks', 'SIEM Streaming (CEF/JSON)', 'Email & Slack Alerts'],
    },
    {
      tier: 'ENTERPRISE',
      name: 'Enterprise Plan',
      price: '$1,999 / mo',
      assets: 500,
      scans: '10,000 / mo',
      features: ['Sentinel AI Autonomous Agent', 'Zero Trust SDP Microsegmentation', 'Deception Honeypot Engine', 'Dark Web & Brand Protection', 'Dedicated CISO Support'],
    },
    {
      tier: 'MSSP_PARTNER',
      name: 'MSSP Partner Plan',
      price: '$4,999 / mo',
      assets: 5000,
      scans: '100,000 / mo',
      features: ['Multi-Tenant Partner Control Center', 'Custom White-Label Branding', 'Unlimited MSP Sub-Orgs', '24/7 Managed SOC Escalation'],
    },
  ];

  const assetPct = Math.min(100, Math.round(((sub?.currentAssetsCount || 0) / (sub?.maxAssets || 1)) * 100));
  const scanPct = Math.min(100, Math.round(((sub?.currentScansCount || 0) / (sub?.maxScansPerMonth || 1)) * 100));

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CreditCard size={28} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>SaaS Marketplace Billing & Multi-Tier Subscriptions Engine</h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Commercial Tier Governance, Usage Metering Quotas & AWS / Azure / GCP Cloud Marketplace Entitlements
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="badge badge-emerald" style={{ fontSize: '0.85rem', padding: '6px 12px' }}>
            ACTIVE PLAN: {sub?.planTier} (${sub?.monthlyPrice}/mo)
          </span>
        </div>
      </div>

      {/* Usage Quotas Progress Panel */}
      <div className="glass-panel" style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700 }}>
            <span>MONITORED ASSET CAPACITY</span>
            <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
              {sub?.currentAssetsCount} / {sub?.maxAssets} ASSETS ({assetPct}%)
            </span>
          </div>
          <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.06)', borderRadius: '5px', overflow: 'hidden' }}>
            <div style={{ width: `${assetPct}%`, height: '100%', background: 'var(--gradient-cyan)', transition: 'width 0.3s ease' }} />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700 }}>
            <span>MONTHLY SCAN BANDWIDTH QUOTA</span>
            <span style={{ color: 'var(--accent-purple)', fontFamily: 'var(--font-mono)' }}>
              {sub?.currentScansCount} / {sub?.maxScansPerMonth} SCANS ({scanPct}%)
            </span>
          </div>
          <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.06)', borderRadius: '5px', overflow: 'hidden' }}>
            <div style={{ width: `${scanPct}%`, height: '100%', background: 'var(--accent-purple)', transition: 'width 0.3s ease' }} />
          </div>
        </div>
      </div>

      {/* Multi-Tier Plan Selector Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {plans.map((plan) => {
          const isCurrent = sub?.planTier === plan.tier;
          return (
            <div
              key={plan.tier}
              className={isCurrent ? 'glass-panel' : 'glass-panel'}
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: isCurrent ? '2px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                position: 'relative',
              }}
            >
              {isCurrent && (
                <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                  <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>CURRENT PLAN</span>
                </div>
              )}

              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{plan.name}</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-cyan)', margin: '12px 0' }}>
                  {plan.price}
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '16px', fontFamily: 'var(--font-mono)' }}>
                  Up to {plan.assets} Assets | {plan.scans}
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {plan.features.map((feat, idx) => (
                    <li key={idx} style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={12} color="var(--accent-emerald)" /> {feat}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ marginTop: '24px' }}>
                <button
                  className={isCurrent ? 'btn-secondary' : 'btn-primary'}
                  style={{ width: '100%', fontSize: '0.8rem', padding: '10px' }}
                  disabled={isCurrent || upgradingTier === plan.tier}
                  onClick={() => handleUpgrade(plan.tier)}
                >
                  {upgradingTier === plan.tier ? <RotateCw size={14} className="spin" /> : isCurrent ? 'Active Plan' : `Upgrade to ${plan.tier}`}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cloud Marketplace Metering Entitlements Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cloud size={18} color="var(--accent-purple)" /> Cloud Marketplace Entitlement Metering Sync (AWS / Azure / GCP)
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(11, 15, 25, 0.9)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>MARKETPLACE</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>CUSTOMER IDENTIFIER</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>PRODUCT CODE</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>METER DIMENSION</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>QUANTITY UNITS</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SYNC STATUS</th>
            </tr>
          </thead>
          <tbody>
            {entitlements.map((ent) => (
              <tr key={ent.id} style={{ borderBottom: '1px solid rgba(56, 189, 248, 0.08)' }}>
                <td style={{ padding: '16px 24px', fontSize: '0.88rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  {ent.marketplace}
                </td>

                <td style={{ padding: '16px 24px', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                  {ent.customerIdentifier}
                </td>

                <td style={{ padding: '16px 24px', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
                  {ent.productCode}
                </td>

                <td style={{ padding: '16px 24px', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
                  {ent.dimension}
                </td>

                <td style={{ padding: '16px 24px', fontSize: '0.9rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-emerald)' }}>
                  {ent.quantity} Units
                </td>

                <td style={{ padding: '16px 24px' }}>
                  <span className="badge badge-emerald">{ent.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
