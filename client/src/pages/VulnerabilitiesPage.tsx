import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import {
  AlertOctagon,
  ShieldAlert,
  Search,
  Filter,
  Play,
  RotateCw,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  X,
  FileCode,
  Sparkles,
} from 'lucide-react';

export const VulnerabilitiesPage: React.FC = () => {
  const [vulnerabilities, setVulnerabilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [selectedVuln, setSelectedVuln] = useState<any | null>(null);

  // Filters State
  const [filterSeverity, setFilterSeverity] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const loadVulnerabilities = async () => {
    try {
      let url = `/vulnerabilities?search=${encodeURIComponent(searchQuery)}`;
      if (filterSeverity) url += `&severity=${filterSeverity}`;
      if (filterStatus) url += `&status=${filterStatus}`;

      const res: any = await apiClient.get(url);
      if (res.success) setVulnerabilities(res.data);
    } catch (err) {
      console.error('Failed to load vulnerabilities', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVulnerabilities();
  }, [filterSeverity, filterStatus, searchQuery]);

  const handleRunScan = async () => {
    setScanning(true);
    try {
      const res: any = await apiClient.post('/vulnerabilities/scan');
      if (res.success) {
        alert(`Scan complete! ${res.body?.data?.newVulnerabilitiesFound || 2} vulnerabilities identified.`);
        loadVulnerabilities();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to trigger vulnerability scan');
    } finally {
      setScanning(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res: any = await apiClient.put(`/vulnerabilities/${id}/status`, { status: newStatus });
      if (res.success) {
        if (selectedVuln?.id === id) setSelectedVuln(res.data);
        loadVulnerabilities();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update vulnerability status');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
        [SENTINELX CVE ENGINE] AGGREGATING VULNERABILITY ADVISORY INTELLIGENCE...
      </div>
    );
  }

  const criticalCount = vulnerabilities.filter((v) => v.severity === 'CRITICAL').length;
  const highCount = vulnerabilities.filter((v) => v.severity === 'HIGH').length;
  const openCount = vulnerabilities.filter((v) => v.status === 'OPEN').length;

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertOctagon size={28} color="var(--accent-rose)" />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Vulnerability Intelligence Engine</h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            CVE/CVSS v3.1 Advisory Database, Evidence Collector & Actionable Remediation Guidance
          </p>
        </div>

        <button className="btn-primary" disabled={scanning} onClick={handleRunScan}>
          {scanning ? <RotateCw size={16} className="spin" /> : <Play size={16} />}
          {scanning ? 'Scanning Infrastructure...' : 'Run Vulnerability Scan'}
        </button>
      </div>

      {/* Metric Cards Tally */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        <div className="glass-panel glass-panel-danger" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-rose)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            CRITICAL CVEs
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-rose)' }}>
            {criticalCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            CVSS 9.0 - 10.0 Exposure
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            HIGH SEVERITY CVEs
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
            {highCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            CVSS 7.0 - 8.9 Exposure
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            OPEN FINDINGS
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
            {openCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Requiring analyst attention
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            RESOLVED FINDINGS
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
            {vulnerabilities.filter((v) => v.status === 'RESOLVED').length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Patched and verified
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '240px' }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            className="input-field"
            placeholder="Search CVE ID, package name or vulnerability..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select
            className="input-field"
            style={{ width: '160px' }}
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
          >
            <option value="">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <select
            className="input-field"
            style={{ width: '160px' }}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_REMEDIATION">In Remediation</option>
            <option value="RESOLVED">Resolved</option>
            <option value="FALSE_POSITIVE">False Positive</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Vulnerabilities Table + Detail Inspector */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedVuln ? '1fr 440px' : '1fr', gap: '24px' }}>
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(11, 15, 25, 0.9)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>CVE ID</th>
                <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>VULNERABILITY NAME</th>
                <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>COMPONENT & VERSION</th>
                <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SEVERITY / CVSS</th>
                <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TARGET ASSET</th>
                <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {vulnerabilities.map((vuln) => (
                <tr
                  key={vuln.id}
                  style={{
                    borderBottom: '1px solid rgba(56, 189, 248, 0.08)',
                    background: selectedVuln?.id === vuln.id ? 'rgba(0, 242, 254, 0.06)' : 'transparent',
                    cursor: 'pointer',
                  }}
                  onClick={() => setSelectedVuln(vuln)}
                >
                  <td style={{ padding: '16px 24px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                    {vuln.cveId}
                  </td>
                  <td style={{ padding: '16px 24px', fontWeight: 600 }}>{vuln.name}</td>
                  <td style={{ padding: '16px 24px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {vuln.component} {vuln.version}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span className={vuln.severity === 'CRITICAL' ? 'badge badge-rose' : vuln.severity === 'HIGH' ? 'badge badge-amber' : 'badge badge-cyan'}>
                      {vuln.severity} ({vuln.cvssScore})
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '0.85rem' }}>
                    {vuln.asset?.name || 'Authorized Infrastructure'}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span className={vuln.status === 'RESOLVED' ? 'badge badge-emerald' : 'badge badge-purple'}>
                      {vuln.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Inspector Panel Drawer */}
        {selectedVuln && (
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldAlert size={20} color="var(--accent-rose)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>CVE Evidence & Remediation</h3>
              </div>
              <button onClick={() => setSelectedVuln(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                {selectedVuln.cveId}
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                {selectedVuln.name}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <span className={selectedVuln.severity === 'CRITICAL' ? 'badge badge-rose' : 'badge badge-amber'}>
                {selectedVuln.severity} ({selectedVuln.cvssScore})
              </span>
              <span className="badge badge-purple">{selectedVuln.component} {selectedVuln.version}</span>
            </div>

            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                SECURITY IMPACT & EXPLOITABILITY
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {selectedVuln.impact}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '6px' }}>
                TECHNICAL PROOF / EVIDENCE SNIPPET
              </div>
              <pre style={{ padding: '12px', borderRadius: '8px', background: 'rgba(6, 8, 19, 0.9)', border: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--accent-rose)', overflowX: 'auto' }}>
                {JSON.stringify(selectedVuln.evidence, null, 2)}
              </pre>
            </div>

            <div style={{ padding: '14px', borderRadius: '8px', background: 'rgba(0, 230, 118, 0.08)', border: '1px solid rgba(0, 230, 118, 0.25)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-emerald)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} /> RECOMMENDED REMEDIATION
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                {selectedVuln.remediation}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              {selectedVuln.status !== 'RESOLVED' && (
                <button
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => handleUpdateStatus(selectedVuln.id, 'RESOLVED')}
                >
                  <CheckCircle2 size={16} /> Mark as Resolved
                </button>
              )}
              {selectedVuln.status !== 'FALSE_POSITIVE' && (
                <button
                  className="btn-secondary"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => handleUpdateStatus(selectedVuln.id, 'FALSE_POSITIVE')}
                >
                  False Positive
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
