import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import {
  Smartphone,
  ShieldCheck,
  Key,
  AlertTriangle,
  Sparkles,
  RotateCw,
  CheckCircle2,
  XCircle,
  Lock,
  Code2,
  FileCode,
} from 'lucide-react';

export const MobileSecurityPage: React.FC = () => {
  const [scans, setScans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);

  const loadData = async () => {
    try {
      const res: any = await apiClient.get('/mobile-security/scans');
      if (res.success) setScans(res.data);
    } catch (err) {
      console.error('Failed to load mobile security data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRunScan = async () => {
    setScanning(true);
    try {
      const res: any = await apiClient.post('/mobile-security/scans', {
        packageName: 'com.sentinelx.mobile.app',
        platform: 'ANDROID_APK',
      });
      if (res.success) loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to trigger mobile security scan');
    } finally {
      setScanning(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
        [SENTINELX MOBILE SECURITY] PERFORMING SAST/DAST BINARY DECOMPILATION & MASVS AUDIT...
      </div>
    );
  }

  const latestScan = scans[0];
  const masvsControls = JSON.parse(latestScan?.masvsStatus || '[]');
  const secrets = JSON.parse(latestScan?.hardcodedSecrets || '[]');
  const permissions = JSON.parse(latestScan?.permissionsAudit || '[]');

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Smartphone size={28} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Mobile Security & Binary App Audit Engine</h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Android APK & iOS IPA Binary SAST/DAST, Hardcoded Secret Extraction & OWASP MASVS Standard
          </p>
        </div>

        <button className="btn-primary" disabled={scanning} onClick={handleRunScan}>
          {scanning ? <RotateCw size={16} className="spin" /> : <Sparkles size={16} />}
          Audit Mobile Binary (.APK)
        </button>
      </div>

      {/* Metric Cards Tally */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            MASVS COMPLIANCE SCORE
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
            {latestScan?.score || 88} / 100
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            OWASP MASVS Verification Grade
          </div>
        </div>

        <div className="glass-panel glass-panel-danger" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-rose)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            EXTRACTED SECRETS
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-rose)' }}>
            {secrets.length} HARDCODED
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Embedded AWS & API keys found
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-purple)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            AUDITED PERMISSIONS
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-purple)' }}>
            {permissions.length} MANIFEST
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Android / iOS privacy keys
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            TARGET PLATFORM
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
            {latestScan?.platform || 'ANDROID_APK'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Package: {latestScan?.packageName}
          </div>
        </div>
      </div>

      {/* OWASP MASVS Controls Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={18} color="var(--accent-cyan)" /> OWASP MASVS Verification Standard Controls Status
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(11, 15, 25, 0.9)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>CONTROL ID</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>REQUIREMENT TITLE</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>AUDIT RESULT</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>FINDINGS / DETAILS</th>
            </tr>
          </thead>
          <tbody>
            {masvsControls.map((m: any, idx: number) => (
              <tr key={idx} style={{ borderBottom: '1px solid rgba(56, 189, 248, 0.08)' }}>
                <td style={{ padding: '16px 24px', fontSize: '0.88rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                  {m.control}
                </td>

                <td style={{ padding: '16px 24px', fontSize: '0.9rem', fontWeight: 700 }}>
                  {m.name}
                </td>

                <td style={{ padding: '16px 24px' }}>
                  <span className={m.status === 'PASS' ? 'badge badge-emerald' : 'badge badge-rose'}>
                    {m.status}
                  </span>
                </td>

                <td style={{ padding: '16px 24px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {m.detail || 'Compliant with OWASP MASVS standard'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Extracted Hardcoded Secrets Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Key size={18} color="var(--accent-rose)" /> Hardcoded API Keys & Credentials Extracted from Decompiled Binary
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(11, 15, 25, 0.9)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SECRET TYPE</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>DISCOVERED VALUE</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>BINARY CODE LOCATION</th>
            </tr>
          </thead>
          <tbody>
            {secrets.map((s: any, idx: number) => (
              <tr key={idx} style={{ borderBottom: '1px solid rgba(56, 189, 248, 0.08)' }}>
                <td style={{ padding: '16px 24px' }}>
                  <span className="badge badge-rose">{s.type}</span>
                </td>

                <td style={{ padding: '16px 24px', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)' }}>
                  {s.value}
                </td>

                <td style={{ padding: '16px 24px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  {s.location}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
