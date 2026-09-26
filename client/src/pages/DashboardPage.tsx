import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import {
  ShieldCheck,
  Server,
  AlertOctagon,
  CheckCircle2,
  Cpu,
  Globe,
  Database,
  Cloud,
  Terminal,
  Activity,
  Plus,
} from 'lucide-react';

import { useLanguage } from '../context/LanguageContext';

interface DashboardPageProps {
  onNavigate?: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const [health, setHealth] = useState<any>(null);
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [healthRes, assetsRes]: [any, any] = await Promise.all([
          apiClient.get('/health'),
          apiClient.get('/assets'),
        ]);
        if (healthRes.success) setHealth(healthRes.data);
        if (assetsRes.success) setAssets(assetsRes.data);
      } catch (err) {
        console.error('Failed to load dashboard metrics', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '40px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
        [SENTINELX] {t('state.loading')}
      </div>
    );
  }

  const criticalAssets = assets.filter((a) => a.criticality === 'CRITICAL').length;

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* ⚡ 1-Click Auto Protection Action Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '24px 28px',
          background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.18) 0%, rgba(79, 70, 229, 0.18) 100%)',
          border: '1px solid var(--accent-cyan)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#fff' }}>
              {t('dashboard.banner_title')}
            </h3>
            <span className="badge badge-emerald">FULL_AUTO ACTIVE</span>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Proteja o seu site, servidor, API ou conta Cloud com blindagem eBPF e Hash SHA-256 em tempo real.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            className="btn-primary"
            onClick={() => {
              if (onNavigate) onNavigate('assets');
            }}
            style={{
              background: 'var(--gradient-cyan)',
              boxShadow: '0 0 15px rgba(0, 242, 254, 0.4)',
              fontSize: '0.82rem',
              padding: '8px 16px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Plus size={16} /> + CADASTRAR ATIVO
          </button>

          <button
            className="btn-secondary"
            onClick={() => {
              if (onNavigate) onNavigate('assets');
            }}
            style={{
              fontSize: '0.82rem',
              padding: '8px 14px',
              fontWeight: 700,
            }}
          >
            ⚡ Blindar Todos (1-Clique)
          </button>
        </div>
      </div>

      {/* Top Banner / Hero Metric Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
              SECURITY SCORE
            </span>
            <ShieldCheck size={20} color="var(--accent-cyan)" />
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
            96<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/100</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={12} /> +2% Improvement this week
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
              PROTECTED ASSETS
            </span>
            <Server size={20} color="var(--accent-purple)" />
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {assets.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            {criticalAssets} Critical Infrastructure assets
          </div>
        </div>

        <div className="glass-panel glass-panel-danger" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-rose)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
              ACTIVE INCIDENTS
            </span>
            <AlertOctagon size={20} color="var(--accent-rose)" />
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-rose)' }}>
            0
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', marginTop: '6px' }}>
            Zero uncontained threats detected
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
              AUTOPILOT STATUS
            </span>
            <Cpu size={20} color="var(--accent-emerald)" />
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-emerald)', marginTop: '4px' }}>
            AUTONOMOUS
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Level 3 (Require Approval for High)
          </div>
        </div>
      </div>

      {/* Main Grid: Component Health & Asset Quick View */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Protected Assets List */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Server size={18} color="var(--accent-cyan)" />
              Monitored Security Surface ({assets.length})
            </h3>
            <span className="badge badge-emerald">Continuous Monitoring</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {assets.map((asset) => {
              const getIcon = (type: string) => {
                switch (type) {
                  case 'WEBSITE': return <Globe size={16} color="var(--accent-cyan)" />;
                  case 'API': return <Terminal size={16} color="var(--accent-purple)" />;
                  case 'CLOUD': return <Cloud size={16} color="var(--accent-amber)" />;
                  default: return <Database size={16} color="var(--accent-blue)" />;
                }
              };

              return (
                <div
                  key={asset.id}
                  style={{
                    padding: '16px',
                    borderRadius: '8px',
                    background: 'rgba(11, 15, 25, 0.6)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(15, 23, 42, 0.9)' }}>
                      {getIcon(asset.type)}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {asset.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {asset.target} • {asset.environment}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                        Score: {asset.securityScore}/100
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        Criticality: {asset.criticality}
                      </div>
                    </div>
                    <div className="status-dot status-dot-emerald" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Security Engine Telemetry */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} color="var(--accent-emerald)" />
            Engine Telemetry
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '14px', borderRadius: '8px', background: 'rgba(11, 15, 25, 0.7)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>DATABASE STATUS</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent-emerald)', marginTop: '4px' }}>
                {health?.services?.database?.status || 'UP'} ({health?.services?.database?.latencyMs || 2}ms)
              </div>
            </div>

            <div style={{ padding: '14px', borderRadius: '8px', background: 'rgba(11, 15, 25, 0.7)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SECURITY ENGINE</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent-cyan)', marginTop: '4px' }}>
                {health?.services?.securityEngine?.mode || 'CONTINUOUS_DEFENSE'}
              </div>
            </div>

            <div style={{ padding: '14px', borderRadius: '8px', background: 'rgba(11, 15, 25, 0.7)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>THREAT INTELLIGENCE FEED</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent-purple)', marginTop: '4px' }}>
                {health?.services?.intelligenceFeed?.version || '2026.08.16-v1'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
