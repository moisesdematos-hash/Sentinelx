import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import {
  Globe2,
  ShieldAlert,
  AlertOctagon,
  Sparkles,
  RotateCw,
  Send,
  Eye,
  CheckCircle2,
  Lock,
  Globe,
  Radio,
  X,
  FileCode,
} from 'lucide-react';

export const BrandProtectionPage: React.FC = () => {
  const [domains, setDomains] = useState<any[]>([]);
  const [leaks, setLeaks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [takedownId, setTakedownId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [domRes, leakRes]: any = await Promise.all([
        apiClient.get('/brand-protection/domains'),
        apiClient.get('/brand-protection/leaks'),
      ]);

      if (domRes.success) setDomains(domRes.data);
      if (leakRes.success) setLeaks(leakRes.data);
    } catch (err) {
      console.error('Failed to load brand protection data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleScan = async () => {
    setScanning(true);
    try {
      const res: any = await apiClient.post('/brand-protection/scan', { targetDomain: 'sentinelx.io' });
      if (res.success) loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to scan domain impersonation');
    } finally {
      setScanning(false);
    }
  };

  const handleTakedown = async (domainId: string) => {
    setTakedownId(domainId);
    try {
      const res: any = await apiClient.post(`/brand-protection/domains/${domainId}/takedown`, {});
      if (res.success) loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to submit registrar takedown request');
    } finally {
      setTakedownId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
        [SENTINELX BRAND PROTECTION] SCANNING REGISTRARS & DARK WEB FORUM LEAKS...
      </div>
    );
  }

  const activePhishingCount = domains.filter((d) => d.phishingDetected).length;

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Globe2 size={28} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>External Brand Protection & Domain Impersonation Hub</h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Typosquatting & Homograph Domain Discovery, Dark Web Credential Monitoring & Automated Registrar Abuse Takedowns
          </p>
        </div>

        <button className="btn-primary" disabled={scanning} onClick={handleScan}>
          {scanning ? <RotateCw size={16} className="spin" /> : <Sparkles size={16} />}
          Scan Impersonation Domains
        </button>
      </div>

      {/* Metric Cards Tally */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            DISCOVERED IMPERSONATIONS
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
            {domains.length} DOMAINS
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Lookalike & typosquatting domains
          </div>
        </div>

        <div className="glass-panel glass-panel-danger" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-rose)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            ACTIVE PHISHING CLONES
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-rose)' }}>
            {activePhishingCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Live credential harvest pages
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-purple)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            DARK WEB LEAKED CREDS
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-purple)' }}>
            {leaks.length} LEAKS
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Stealer logs & forum dumps
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            REGISTRAR TAKEDOWN SLA
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
            4 HOURS SLA
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Automated abuse dispatch
          </div>
        </div>
      </div>

      {/* Impersonation Domains Matrix Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Globe size={18} color="var(--accent-cyan)" /> Discovered Typosquatting & Lookalike Impersonation Domains
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(11, 15, 25, 0.9)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>DOMIN NAME</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SIMILARITY</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>RESOLVED IP</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>MX / PHISHING</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>STATUS</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {domains.map((dom) => (
              <tr key={dom.id} style={{ borderBottom: '1px solid rgba(56, 189, 248, 0.08)' }}>
                <td style={{ padding: '16px 24px', fontSize: '0.9rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                  {dom.domainName}
                </td>

                <td style={{ padding: '16px 24px' }}>
                  <span className="badge badge-purple">{dom.similarityScore}% MATCH</span>
                </td>

                <td style={{ padding: '16px 24px', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-rose)' }}>
                  {dom.dnsResolvedIp || 'Unresolved'}
                </td>

                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {dom.hasMxRecord && <span className="badge badge-amber">MX ACTIVE</span>}
                    {dom.phishingDetected && <span className="badge badge-rose">PHISHING LIVE</span>}
                  </div>
                </td>

                <td style={{ padding: '16px 24px' }}>
                  <span className={dom.status === 'TAKEDOWN_SUBMITTED' ? 'badge badge-amber' : 'badge badge-emerald'}>
                    {dom.status}
                  </span>
                </td>

                <td style={{ padding: '16px 24px' }}>
                  {dom.status === 'MONITORED' && (
                    <button
                      className="btn-primary"
                      style={{ fontSize: '0.75rem', padding: '6px 10px' }}
                      disabled={takedownId === dom.id}
                      onClick={() => handleTakedown(dom.id)}
                    >
                      {takedownId === dom.id ? <RotateCw size={12} className="spin" /> : <Send size={12} />}
                      Submit Abuse Takedown
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dark Web Leaked Credentials Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldAlert size={18} color="var(--accent-rose)" /> Dark Web Forum & Stealer Log Leaked Credentials Feed
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(11, 15, 25, 0.9)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>DISCOVERED TIMESTAMP</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>LEAKED EMAIL / USER</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>LEAK SOURCE</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SEVERITY</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {leaks.map((l) => (
              <tr key={l.id} style={{ borderBottom: '1px solid rgba(56, 189, 248, 0.08)' }}>
                <td style={{ padding: '16px 24px', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>
                  {new Date(l.timestamp).toLocaleString()}
                </td>

                <td style={{ padding: '16px 24px', fontSize: '0.88rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-rose)' }}>
                  {l.email}
                </td>

                <td style={{ padding: '16px 24px' }}>
                  <span className="badge badge-purple">{l.leakSource}</span>
                </td>

                <td style={{ padding: '16px 24px' }}>
                  <span className="badge badge-rose">{l.severity}</span>
                </td>

                <td style={{ padding: '16px 24px' }}>
                  <span className="badge badge-amber">{l.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
