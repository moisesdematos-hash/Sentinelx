import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import {
  Award,
  RefreshCw,
  CheckCircle2,
  AlertOctagon,
  FileCheck,
  Download,
  ShieldCheck,
  Sliders,
  X,
  FileText,
} from 'lucide-react';

export const ComplianceAuditorPage: React.FC = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [controls, setControls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [auditing, setAuditing] = useState(false);
  const [selectedFramework, setSelectedFramework] = useState<string>('ALL');

  const loadData = async () => {
    try {
      const [repRes, ctrlRes]: any = await Promise.all([
        apiClient.get('/compliance/frameworks'),
        apiClient.get('/compliance/controls'),
      ]);

      if (repRes.success) setReports(repRes.data);
      if (ctrlRes.success) setControls(ctrlRes.data);
    } catch (err) {
      console.error('Failed to load compliance data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRunAudit = async () => {
    setAuditing(true);
    try {
      const res: any = await apiClient.post('/compliance/audit', {});
      if (res.success) loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to run compliance evaluation');
    } finally {
      setAuditing(false);
    }
  };

  const handleExport = async () => {
    try {
      const res: any = await apiClient.get('/compliance/export');
      if (res.success) {
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
          JSON.stringify(res.data, null, 2)
        )}`;
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', jsonString);
        downloadAnchor.setAttribute('download', `sentinelx_compliance_audit_export.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to export compliance evidence');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
        [SENTINELX COMPLIANCE AUDITOR] EVALUATING REGULATORY FRAMEWORKS & MAP CONTROLS...
      </div>
    );
  }

  const filteredControls = controls.filter(
    (c) => selectedFramework === 'ALL' || c.framework === selectedFramework
  );

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Award size={28} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Regulatory Compliance Auditor & Governance Hub</h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            ISO 27001, SOC 2 Type II, PCI DSS v4.0, HIPAA & GDPR Automated Control Evaluation
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-secondary" onClick={handleExport}>
            <Download size={16} /> Export Audit Evidence Pack
          </button>

          <button className="btn-primary" disabled={auditing} onClick={handleRunAudit}>
            <RefreshCw size={16} className={auditing ? 'spin' : ''} />
            {auditing ? 'Auditing Controls...' : 'Run Audit Evaluation'}
          </button>
        </div>
      </div>

      {/* Framework Readiness Score Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
        {['ISO_27001', 'SOC2_TYPE2', 'PCI_DSS_V4', 'HIPAA', 'GDPR'].map((fw) => {
          const report = reports.find((r) => r.framework === fw) || { readinessScore: 100 };
          const formattedName =
            fw === 'ISO_27001'
              ? 'ISO 27001'
              : fw === 'SOC2_TYPE2'
              ? 'SOC 2 Type II'
              : fw === 'PCI_DSS_V4'
              ? 'PCI DSS v4.0'
              : fw;

          return (
            <div key={fw} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {formattedName}
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: report.readinessScore >= 90 ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}>
                {report.readinessScore}%
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Ready for Auditor Review
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls Evaluation Matrix Table */}
      <div className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ padding: '20px 24px 0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileCheck size={18} color="var(--accent-cyan)" /> Regulatory Controls Evaluation & Evidence Mapping
          </div>

          <select
            className="input-field"
            value={selectedFramework}
            onChange={(e) => setSelectedFramework(e.target.value)}
            style={{ width: '180px', fontSize: '0.8rem' }}
          >
            <option value="ALL">All Frameworks</option>
            <option value="ISO_27001">ISO 27001</option>
            <option value="SOC2_TYPE2">SOC 2 Type II</option>
            <option value="PCI_DSS_V4">PCI DSS v4.0</option>
            <option value="HIPAA">HIPAA</option>
            <option value="GDPR">GDPR</option>
          </select>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(11, 15, 25, 0.9)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>CONTROL ID</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>FRAMEWORK</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TITLE & REQUIREMENT</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>STATUS</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>EVIDENCE DATA</th>
            </tr>
          </thead>
          <tbody>
            {filteredControls.map((ctrl) => (
              <tr key={ctrl.id} style={{ borderBottom: '1px solid rgba(56, 189, 248, 0.08)' }}>
                <td style={{ padding: '16px 24px', fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                  {ctrl.controlId}
                </td>

                <td style={{ padding: '16px 24px' }}>
                  <span className="badge badge-purple">{ctrl.framework}</span>
                </td>

                <td style={{ padding: '16px 24px' }}>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {ctrl.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {ctrl.description}
                  </div>
                </td>

                <td style={{ padding: '16px 24px' }}>
                  <span className={ctrl.status === 'PASS' ? 'badge badge-emerald' : 'badge badge-rose'}>
                    {ctrl.status}
                  </span>
                </td>

                <td style={{ padding: '16px 24px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  {ctrl.evidence}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
