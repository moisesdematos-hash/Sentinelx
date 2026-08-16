import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import {
  Activity,
  Radio,
  Play,
  RotateCw,
  Server,
  Zap,
  ShieldAlert,
  Lock,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const ContinuousMonitoringPage: React.FC = () => {
  const [telemetry, setTelemetry] = useState<any[]>([]);
  const [engineStatus, setEngineStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [runningCycle, setRunningCycle] = useState(false);

  const loadData = async () => {
    try {
      const [telemetryRes, statusRes]: [any, any] = await Promise.all([
        apiClient.get('/monitoring/telemetry?limit=50'),
        apiClient.get('/monitoring/status'),
      ]);
      if (telemetryRes.success) setTelemetry(telemetryRes.data);
      if (statusRes.success) setEngineStatus(statusRes.data);
    } catch (err) {
      console.error('Failed to load continuous monitoring telemetry', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTriggerCycle = async () => {
    setRunningCycle(true);
    try {
      const res: any = await apiClient.post('/monitoring/trigger');
      if (res.success) {
        alert(`Monitoring cycle complete! ${res.data.telemetryPointsRecorded} telemetry data points recorded across ${res.data.monitoredAssetsCount} assets.`);
        loadData();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to trigger monitoring cycle');
    } finally {
      setRunningCycle(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
        [SENTINELX MONITORING] CONNECTING TO REAL-TIME TELEMETRY STREAM...
      </div>
    );
  }

  const normalPoints = telemetry.filter((t) => t.status === 'NORMAL').length;
  const warningPoints = telemetry.filter((t) => t.status === 'WARNING').length;

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Radio size={28} color="var(--accent-emerald)" />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Continuous Monitoring Engine</h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Real-Time Asset Reachability, Latency Telemetry, Certificate Watcher & Baseline Drift Detector
          </p>
        </div>

        <button className="btn-primary" disabled={runningCycle} onClick={handleTriggerCycle}>
          {runningCycle ? <RotateCw size={16} className="spin" /> : <Play size={16} />}
          {runningCycle ? 'Executing Cycle...' : 'Trigger Monitoring Cycle'}
        </button>
      </div>

      {/* Metric Cards Tally */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            ENGINE STATUS
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
            {engineStatus?.status || 'ONLINE'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Mode: {engineStatus?.mode || 'CONTINUOUS_DEFENSE'}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            TELEMETRY RECORDED
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
            {telemetry.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Recent telemetry metrics
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            HEALTHY CHECKS
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
            {normalPoints}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Optimal operational status
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            WARNING / DRIFT ALERTS
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
            {warningPoints}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Drift or high latency alerts
          </div>
        </div>
      </div>

      {/* Real-Time Telemetry Feed Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={18} color="var(--accent-cyan)" />
            Real-Time Monitoring Telemetry Stream
          </h3>
          <span className="badge badge-emerald">Live Telemetry Feed</span>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(11, 15, 25, 0.9)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TIMESTAMP</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TARGET ASSET</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>METRIC TYPE</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>VALUE / METRIC</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TELEMETRY STATUS</th>
            </tr>
          </thead>
          <tbody>
            {telemetry.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid rgba(56, 189, 248, 0.08)' }}>
                <td style={{ padding: '16px 24px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {new Date(item.timestamp).toLocaleTimeString()}
                </td>
                <td style={{ padding: '16px 24px', fontWeight: 600 }}>
                  {item.asset?.name || 'Asset Surface'}
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <span className="badge badge-purple">{item.metricType}</span>
                </td>
                <td style={{ padding: '16px 24px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                  {item.metricType === 'LATENCY' ? `${item.value} ms` : item.metricType === 'CERT_EXPIRATION' ? `${item.value} Days` : item.value === 0 ? 'No Drift' : 'Drift Detected'}
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <span className={item.status === 'NORMAL' ? 'badge badge-emerald' : 'badge badge-amber'}>
                    {item.status}
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
