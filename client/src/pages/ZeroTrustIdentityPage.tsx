import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import {
  UserCheck,
  Lock,
  Clock,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  RotateCw,
  Key,
  User,
  Cpu,
  Plus,
  X,
  FileCode,
} from 'lucide-react';

export const ZeroTrustIdentityPage: React.FC = () => {
  const [risks, setRisks] = useState<any[]>([]);
  const [jitRequests, setJitRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lockingId, setLockingId] = useState<string | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [riskRes, jitRes]: any = await Promise.all([
        apiClient.get('/identity/risks'),
        apiClient.get('/identity/jit-requests'),
      ]);

      if (riskRes.success) setRisks(riskRes.data);
      if (jitRes.success) setJitRequests(jitRes.data);
    } catch (err) {
      console.error('Failed to load identity data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApproveJit = async (requestId: string, approved: boolean) => {
    setApprovingId(requestId);
    try {
      const res: any = await apiClient.post(`/identity/jit-requests/${requestId}/approve`, { approved });
      if (res.success) loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to update JIT request');
    } finally {
      setApprovingId(null);
    }
  };

  const handleLockout = async (riskId: string) => {
    setLockingId(riskId);
    try {
      const res: any = await apiClient.post(`/identity/risks/${riskId}/lockout`, {});
      if (res.success) loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to execute account lockout');
    } finally {
      setLockingId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
        [SENTINELX ZERO TRUST IDENTITY] CONNECTING TO IDENTITY GOVERNANCE & JIT ELEVATION WORKER...
      </div>
    );
  }

  const suspiciousCount = risks.filter((r) => r.status === 'SUSPICIOUS' || r.riskScore > 70).length;

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <UserCheck size={28} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Zero Trust Identity & Access Governance Engine</h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Just-In-Time (JIT) Privileged Access, User & Machine Identity Risk Scoring, ITDR Anomaly Guardrails
          </p>
        </div>
      </div>

      {/* Metric Cards Tally */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            TRACKED IDENTITIES
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
            {risks.length} IDENTITIES
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Human, Roles & Service Accounts
          </div>
        </div>

        <div className="glass-panel glass-panel-danger" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-rose)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            HIGH-RISK IDENTITIES
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-rose)' }}>
            {suspiciousCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            ITDR threat anomalies flagged
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-purple)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            JIT PRIVILEGE ELEVATIONS
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-purple)' }}>
            {jitRequests.length} REQUESTS
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Temporary 1-hr access passes
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            PERMANENT ADMIN ROLES
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
            0 PERMANENT
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Strict Zero Trust JIT enforce
          </div>
        </div>
      </div>

      {/* JIT Elevation Requests Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={18} color="var(--accent-cyan)" /> Active & Pending Just-In-Time (JIT) Privilege Elevation Passes
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(11, 15, 25, 0.9)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>REQUESTER</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>REQUESTED ROLE</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TARGET RESOURCE</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>DURATION</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>STATUS</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {jitRequests.map((req) => (
              <tr key={req.id} style={{ borderBottom: '1px solid rgba(56, 189, 248, 0.08)' }}>
                <td style={{ padding: '16px 24px', fontSize: '0.88rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  {req.requesterEmail}
                </td>

                <td style={{ padding: '16px 24px' }}>
                  <span className="badge badge-purple">{req.requestedRole}</span>
                </td>

                <td style={{ padding: '16px 24px', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                  {req.targetResource}
                </td>

                <td style={{ padding: '16px 24px', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
                  {req.durationHours} Hour
                </td>

                <td style={{ padding: '16px 24px' }}>
                  <span className={req.status === 'APPROVED' ? 'badge badge-emerald' : req.status === 'REVOKED' ? 'badge badge-rose' : 'badge badge-amber'}>
                    {req.status}
                  </span>
                </td>

                <td style={{ padding: '16px 24px' }}>
                  {req.status === 'PENDING' && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="btn-primary"
                        style={{ fontSize: '0.72rem', padding: '4px 8px' }}
                        disabled={approvingId === req.id}
                        onClick={() => handleApproveJit(req.id, true)}
                      >
                        {approvingId === req.id ? <RotateCw size={12} className="spin" /> : <CheckCircle2 size={12} />}
                        Approve JIT
                      </button>

                      <button
                        className="btn-secondary"
                        style={{ fontSize: '0.72rem', padding: '4px 8px' }}
                        disabled={approvingId === req.id}
                        onClick={() => handleApproveJit(req.id, false)}
                      >
                        <XCircle size={12} /> Deny
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User & Machine Identity Risk Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldAlert size={18} color="var(--accent-rose)" /> Tracked Human & Machine Identity Risk Matrix
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(11, 15, 25, 0.9)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>IDENTITY NAME</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TYPE</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>RISK SCORE</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ITDR ANOMALIES & FACTORS</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>STATUS</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {risks.map((risk) => {
              const factors = JSON.parse(risk.riskFactors || '[]');
              return (
                <tr key={risk.id} style={{ borderBottom: '1px solid rgba(56, 189, 248, 0.08)' }}>
                  <td style={{ padding: '16px 24px', fontSize: '0.88rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                    {risk.identityName}
                  </td>

                  <td style={{ padding: '16px 24px' }}>
                    <span className="badge badge-purple">{risk.identityType}</span>
                  </td>

                  <td style={{ padding: '16px 24px' }}>
                    <span className={risk.riskScore > 70 ? 'badge badge-rose' : risk.riskScore > 30 ? 'badge badge-amber' : 'badge badge-emerald'}>
                      RISK {risk.riskScore} / 100
                    </span>
                  </td>

                  <td style={{ padding: '16px 24px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {factors.join(', ')}
                  </td>

                  <td style={{ padding: '16px 24px' }}>
                    <span className={risk.status === 'LOCKED_OUT' ? 'badge badge-rose' : 'badge badge-emerald'}>
                      {risk.status}
                    </span>
                  </td>

                  <td style={{ padding: '16px 24px' }}>
                    {risk.status !== 'LOCKED_OUT' && (
                      <button
                        className="btn-primary"
                        style={{ fontSize: '0.75rem', padding: '6px 10px' }}
                        disabled={lockingId === risk.id}
                        onClick={() => handleLockout(risk.id)}
                      >
                        {lockingId === risk.id ? <RotateCw size={12} className="spin" /> : <Lock size={12} />}
                        Emergency Lockout
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
