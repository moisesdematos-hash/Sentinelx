import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import {
  ShieldCheck,
  Plus,
  Lock,
  Radio,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  GitMerge,
  ListFilter,
  X,
  Layers,
  Activity,
  FileCode,
} from 'lucide-react';

export const MicrosegmentationPage: React.FC = () => {
  const [segments, setSegments] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [enforcingId, setEnforcingId] = useState<string | null>(null);
  const [selectedRules, setSelectedRules] = useState<any[] | null>(null);

  const loadData = async () => {
    try {
      const [segRes, logRes]: any = await Promise.all([
        apiClient.get('/microsegmentation/segments'),
        apiClient.get('/microsegmentation/logs'),
      ]);

      if (segRes.success) setSegments(segRes.data);
      if (logRes.success) setLogs(logRes.data);
    } catch (err) {
      console.error('Failed to load microsegmentation data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEnforce = async (id: string) => {
    setEnforcingId(id);
    try {
      const res: any = await apiClient.post(`/microsegmentation/segments/${id}/enforce`, {});
      if (res.success) loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to enforce zero trust segment');
    } finally {
      setEnforcingId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
        [SENTINELX MICROSEGMENTATION] CONNECTING TO SOFTWARE-DEFINED PERIMETER ENFORCER...
      </div>
    );
  }

  const totalBlocked = segments.reduce((acc, s) => acc + s.blockedFlowsCount, 0);

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <GitMerge size={28} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Microsegmentation & Zero Trust Network Isolation</h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Software-Defined Perimeter (SDP), Granular East-West Traffic Control & Attack Blast Radius Suppression
          </p>
        </div>
      </div>

      {/* Metric Cards Tally */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            ACTIVE SEGMENTS
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
            {segments.length} SEGMENTS
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Isolated security zones
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-rose)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            BLOCKED EAST-WEST FLOWS
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-rose)' }}>
            {totalBlocked.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Prevented lateral moves
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            ZERO TRUST ENFORCEMENT
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
            STRICT ZERO TRUST
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Default deny all
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-purple)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            LATERAL SUPPRESSION
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-purple)' }}>
            100% BLOCKED
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Zero unverified hops
          </div>
        </div>
      </div>

      {/* Network Segment Topology Grid Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <GitMerge size={18} color="var(--accent-cyan)" /> Configured Microsegmentation Security Zones
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(11, 15, 25, 0.9)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SEGMENT NAME</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ENVIRONMENT</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ISOLATION LEVEL</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ACTIVE RULES</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>STATUS</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {segments.map((seg) => (
              <tr key={seg.id} style={{ borderBottom: '1px solid rgba(56, 189, 248, 0.08)' }}>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {seg.name}
                  </div>
                  <button
                    className="btn-secondary"
                    style={{ fontSize: '0.72rem', padding: '2px 6px', marginTop: '6px' }}
                    onClick={() => setSelectedRules(seg.policyRules || [])}
                  >
                    <ListFilter size={12} /> View {seg.policyRules?.length || 0} Flow Rules
                  </button>
                </td>

                <td style={{ padding: '16px 24px' }}>
                  <span className="badge badge-purple">{seg.environment}</span>
                </td>

                <td style={{ padding: '16px 24px' }}>
                  <span className="badge badge-cyan">{seg.isolationLevel}</span>
                </td>

                <td style={{ padding: '16px 24px', fontSize: '0.88rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  {seg.activeRulesCount} RULES
                </td>

                <td style={{ padding: '16px 24px' }}>
                  <span className="badge badge-emerald">{seg.status}</span>
                </td>

                <td style={{ padding: '16px 24px' }}>
                  <button
                    className="btn-primary"
                    style={{ fontSize: '0.75rem', padding: '6px 10px' }}
                    disabled={enforcingId === seg.id}
                    onClick={() => handleEnforce(seg.id)}
                  >
                    {enforcingId === seg.id ? <RotateCw size={12} className="spin" /> : <Lock size={12} />}
                    Enforce Zero Trust
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Blocked Traffic Flow Inspector */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={18} color="var(--accent-rose)" /> Blocked East-West Traffic Flow Inspector
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(11, 15, 25, 0.9)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TIMESTAMP</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SOURCE NODE</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TARGET NODE</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>PORT / PROTOCOL</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ACTION</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>POLICY REASON</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} style={{ borderBottom: '1px solid rgba(56, 189, 248, 0.08)' }}>
                <td style={{ padding: '16px 24px', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>
                  {new Date(log.timestamp).toLocaleTimeString()}
                </td>

                <td style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--accent-rose)' }}>
                  {log.sourceIp}
                </td>

                <td style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                  {log.targetIp}
                </td>

                <td style={{ padding: '16px 24px', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
                  {log.protocol}:{log.port}
                </td>

                <td style={{ padding: '16px 24px' }}>
                  <span className={log.action === 'DENIED' ? 'badge badge-rose' : 'badge badge-emerald'}>
                    {log.action}
                  </span>
                </td>

                <td style={{ padding: '16px 24px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {log.reason}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Rules Modal */}
      {selectedRules && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(6, 8, 19, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '600px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ListFilter size={20} color="var(--accent-cyan)" /> Microsegmentation Policy Flow Rules
              </h3>
              <button onClick={() => setSelectedRules(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {selectedRules.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No rules added yet.</div>
              ) : (
                selectedRules.map((rule, idx) => (
                  <div key={idx} style={{ padding: '14px 16px', borderRadius: '8px', background: 'rgba(11, 15, 25, 0.8)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                        <span style={{ color: 'var(--accent-rose)' }}>{rule.sourceTag}</span> → <span style={{ color: 'var(--accent-cyan)' }}>{rule.targetTag}</span> ({rule.protocol}:{rule.portRange})
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {rule.description}
                      </div>
                    </div>

                    <span className={rule.action === 'DENY' ? 'badge badge-rose' : 'badge badge-emerald'}>
                      {rule.action}
                    </span>
                  </div>
                ))
              )}
            </div>

            <button className="btn-secondary" onClick={() => setSelectedRules(null)}>
              Close Rule Matrix
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
