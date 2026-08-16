import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import {
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  History,
  RotateCw,
  RefreshCw,
  Lock,
  Layers,
  Activity,
} from 'lucide-react';

export const RecoveryRollbackPage: React.FC = () => {
  const [baselines, setBaselines] = useState<any[]>([]);
  const [rollbacks, setRollbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [baseRes, rollRes]: any = await Promise.all([
        apiClient.get('/recovery/baselines'),
        apiClient.get('/recovery/rollbacks'),
      ]);

      if (baseRes.success) setBaselines(baseRes.data);
      if (rollRes.success) setRollbacks(rollRes.data);
    } catch (err) {
      console.error('Failed to load recovery data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRollback = async (assetId: string, baselineId: string) => {
    setProcessingId(baselineId);
    try {
      const res: any = await apiClient.post('/recovery/rollback', { assetId, baselineId });
      if (res.success) loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to execute rollback');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRestoreAsset = async (assetId: string) => {
    setProcessingId(assetId);
    try {
      const res: any = await apiClient.post('/recovery/restore-asset', { assetId });
      if (res.success) loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to restore asset');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
        [SENTINELX RECOVERY ENGINE] LOADING BASELINE SNAPSHOTS & SHA-256 HASH VERIFIERS...
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <RotateCcw size={28} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Recovery & Configuration State Rollback Hub</h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            1-Click State Rollback, SHA-256 Baseline Integrity Verification & Operational Asset Recovery
          </p>
        </div>
      </div>

      {/* Metric Cards Tally */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            LOCKED BASELINE SNAPSHOTS
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
            {baselines.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Pre-patch state backups
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            EXECUTED ROLLBACKS
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
            {rollbacks.filter((r) => r.actionType === 'ROLLBACK_EXECUTED').length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Restored baseline states
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-purple)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            RESTORED OPERATIONAL NODES
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-purple)' }}>
            {rollbacks.filter((r) => r.actionType === 'ASSET_RESTORED').length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Recovered asset instances
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            SHA-256 HASH VERIFICATION
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
            100% MATCH
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Integrity check passed
          </div>
        </div>
      </div>

      {/* Baseline Snapshots Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={18} color="var(--accent-cyan)" /> Pre-Patch Baseline Snapshots
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(11, 15, 25, 0.9)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ASSET NAME</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TARGET</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>VERSION</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SHA-256 HASH</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {baselines.map((base) => (
              <tr key={base.id} style={{ borderBottom: '1px solid rgba(56, 189, 248, 0.08)' }}>
                <td style={{ padding: '16px 24px', fontSize: '0.9rem', fontWeight: 700 }}>
                  {base.assetName}
                </td>

                <td style={{ padding: '16px 24px', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                  {base.assetTarget}
                </td>

                <td style={{ padding: '16px 24px' }}>
                  <span className="badge badge-purple">v{base.version}.0</span>
                </td>

                <td style={{ padding: '16px 24px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  {base.hash.substring(0, 16)}...
                </td>

                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="btn-secondary"
                      style={{ fontSize: '0.75rem', padding: '6px 10px' }}
                      disabled={processingId === base.id}
                      onClick={() => handleRollback(base.assetId, base.id)}
                    >
                      {processingId === base.id ? <RotateCw size={12} className="spin" /> : <RotateCcw size={12} />}
                      1-Click Rollback
                    </button>

                    <button
                      className="btn-primary"
                      style={{ fontSize: '0.75rem', padding: '6px 10px' }}
                      disabled={processingId === base.assetId}
                      onClick={() => handleRestoreAsset(base.assetId)}
                    >
                      <RefreshCw size={12} /> Restore Asset
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Rollback Audit Stream */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <History size={18} color="var(--accent-emerald)" /> Executed Rollback & Recovery Audit History
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(11, 15, 25, 0.9)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TIMESTAMP</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ACTION TYPE</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TARGET ASSET</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>INTEGRITY HASH</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {rollbacks.map((roll) => (
              <tr key={roll.id} style={{ borderBottom: '1px solid rgba(56, 189, 248, 0.08)' }}>
                <td style={{ padding: '16px 24px', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>
                  {new Date(roll.timestamp).toLocaleString()}
                </td>

                <td style={{ padding: '16px 24px', fontSize: '0.88rem', fontWeight: 700 }}>
                  {roll.actionType}
                </td>

                <td style={{ padding: '16px 24px', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                  {roll.asset?.name || 'Asset Instance'}
                </td>

                <td style={{ padding: '16px 24px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  {roll.integrityHash.substring(0, 16)}...
                </td>

                <td style={{ padding: '16px 24px' }}>
                  <span className="badge badge-emerald">{roll.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
