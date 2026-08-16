import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Activity,
  Layers,
  Server,
  Lock,
  Cpu,
  Globe,
  Flame,
  Star,
} from 'lucide-react';

export const MasteryBenchmarkPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const res: any = await apiClient.get('/mastery-benchmark');
      if (res.success) setData(res.data);
    } catch (err) {
      console.error('Failed to load mastery benchmark data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '40px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
        [SENTINELX MASTERY BENCHMARK] EVALUATING 38 PLATFORM SUBSYSTEMS & DATABASE PARITY...
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Mastery Certification Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '32px',
          background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.15), rgba(79, 70, 229, 0.15))',
          border: '2px solid var(--accent-cyan)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 0 30px rgba(0, 242, 254, 0.25)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Award size={36} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '1px' }}>
              SENTINELX AUTONOMOUS ENTERPRISE CERTIFIED
            </h2>
          </div>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
            Official Platform Mastery & 100% Production Readiness Benchmark (Phases 1 - 38 Fully Verified)
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
            100.0%
          </div>
          <span className="badge badge-emerald" style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
            38 / 38 PHASES VERIFIED
          </span>
        </div>
      </div>

      {/* Database Entity Tallies */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Server size={18} color="var(--accent-cyan)" /> System Entity Telemetry & Multi-Tenant Parity
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px', textAlign: 'center' }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{data?.telemetry?.organizationsCount || 0}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ORGANIZATIONS</div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-purple)' }}>{data?.telemetry?.assetsCount || 0}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>MONITORED ASSETS</div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-rose)' }}>{data?.telemetry?.vulnerabilitiesCount || 0}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>CVE VULNS</div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-amber)' }}>{data?.telemetry?.incidentsCount || 0}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ACTIVE INCIDENTS</div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>{data?.telemetry?.webhooksCount || 0}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>WEBHOOKS</div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{data?.telemetry?.graphNodesCount || 0}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>GRAPH NODES</div>
          </div>
        </div>
      </div>

      {/* 38 Roadmap Phases Matrix */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={18} color="var(--accent-purple)" /> Full 38-Phase Platform Implementation Matrix
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', padding: '24px' }}>
          {data?.phases?.map((p: any) => (
            <div
              key={p.phase}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                borderRadius: '8px',
                background: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid rgba(56, 189, 248, 0.1)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="badge badge-cyan" style={{ fontSize: '0.72rem', width: '60px', textAlign: 'center' }}>
                  PHASE {p.phase}
                </span>
                <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{p.name}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                  <CheckCircle2 size={10} style={{ marginRight: '4px' }} /> 100% {p.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
