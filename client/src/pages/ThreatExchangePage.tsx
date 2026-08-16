import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import {
  Share2,
  Globe2,
  ShieldCheck,
  Zap,
  RotateCw,
  Sparkles,
  Lock,
  Activity,
  AlertTriangle,
  Radio,
  CheckCircle2,
} from 'lucide-react';

export const ThreatExchangePage: React.FC = () => {
  const [indicators, setIndicators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const loadData = async () => {
    try {
      const res: any = await apiClient.get('/threat-exchange/indicators');
      if (res.success) setIndicators(res.data);
    } catch (err) {
      console.error('Failed to load global threat exchange data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleShareThreat = async () => {
    setSharing(true);
    try {
      const res: any = await apiClient.post('/threat-exchange/share', {
        indicatorType: 'IP',
        indicatorValue: '193.142.146.210',
        threatCategory: 'BOTNET',
      });
      if (res.success) loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to share threat indicator');
    } finally {
      setSharing(false);
    }
  };

  const handleSyncBlocklist = async () => {
    setSyncing(true);
    try {
      const res: any = await apiClient.post('/threat-exchange/sync-blocklist', {});
      if (res.success) loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to sync collective blocklist');
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
        [SENTINELX GLOBAL EXCHANGE] CONNECTING TO FEDERATED COLLECTIVE DEFENSE NETWORK...
      </div>
    );
  }

  const broadcastedCount = indicators.filter((i) => i.status === 'BROADCASTED').length;
  const syncedCount = indicators.filter((i) => i.status === 'SYNCED').length;

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Share2 size={28} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Global Threat Intelligence Exchange & Collective Defense</h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Federated Anonymized Threat Sharing, Differential Privacy Sanitization & Collective Blocklist Sync
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-secondary" disabled={syncing} onClick={handleSyncBlocklist}>
            {syncing ? <RotateCw size={16} className="spin" /> : <Zap size={16} />}
            Sync Collective Blocklist to WAF
          </button>
          <button className="btn-primary" disabled={sharing} onClick={handleShareThreat}>
            {sharing ? <RotateCw size={16} className="spin" /> : <Sparkles size={16} />}
            Share Anonymized Indicator
          </button>
        </div>
      </div>

      {/* Metric Cards Tally */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            GLOBAL INDICATORS
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
            {indicators.length} IOCs
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Shared across 1,420 tenant nodes
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-purple)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            LIVE BROADCASTS
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-purple)' }}>
            {broadcastedCount} BROADCASTED
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Real-time collective telemetry
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            WAF ENFORCED
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
            {syncedCount} SYNCED
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Enforced across customer WAFs
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            NETWORK CONFIDENCE
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
            97.8% SCORE
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Differential privacy verified
          </div>
        </div>
      </div>

      {/* Global Threat Exchange Indicators Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Globe2 size={18} color="var(--accent-cyan)" /> Anonymized Global Threat Indicators Feed (SHA-256 Node Hashes)
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(11, 15, 25, 0.9)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ANONYMOUS NODE HASH</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>INDICATOR TYPE</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>INDICATOR VALUE</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>THREAT CATEGORY</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>CONFIDENCE</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {indicators.map((ind) => (
              <tr key={ind.id} style={{ borderBottom: '1px solid rgba(56, 189, 248, 0.08)' }}>
                <td style={{ padding: '16px 24px', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                  {ind.anonymousNodeHash}
                </td>

                <td style={{ padding: '16px 24px' }}>
                  <span className="badge badge-purple">{ind.indicatorType}</span>
                </td>

                <td style={{ padding: '16px 24px', fontSize: '0.88rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-rose)' }}>
                  {ind.indicatorValue}
                </td>

                <td style={{ padding: '16px 24px', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
                  {ind.threatCategory}
                </td>

                <td style={{ padding: '16px 24px', fontSize: '0.88rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                  {ind.confidenceScore}%
                </td>

                <td style={{ padding: '16px 24px' }}>
                  <span className={ind.status === 'SYNCED' ? 'badge badge-emerald' : 'badge badge-cyan'}>
                    {ind.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
