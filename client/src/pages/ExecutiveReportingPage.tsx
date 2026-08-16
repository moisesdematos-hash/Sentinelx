import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import {
  FileText,
  Award,
  TrendingUp,
  DollarSign,
  Sparkles,
  RotateCw,
  Download,
  Eye,
  CheckCircle2,
  Calendar,
  Shield,
  X,
} from 'lucide-react';

export const ExecutiveReportingPage: React.FC = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [compiling, setCompiling] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const res: any = await apiClient.get('/executive-reports');
      if (res.success) setReports(res.data);
    } catch (err) {
      console.error('Failed to load executive reports', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCompile = async () => {
    setCompiling(true);
    try {
      const res: any = await apiClient.post('/executive-reports/generate', { period: 'Q4 2026' });
      if (res.success) loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to compile executive report');
    } finally {
      setCompiling(false);
    }
  };

  const handlePreview = async (reportId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/v1/executive-reports/${reportId}/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const html = await response.text();
      setPreviewHtml(html);
    } catch (err) {
      alert('Failed to load PDF preview');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
        [SENTINELX EXECUTIVE REPORTING] SYNTHESIZING C-SUITE RESILIENCE & BOARD METRICS...
      </div>
    );
  }

  const latest = reports[0];

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={28} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Executive Board Reporting & PDF Export Engine</h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            C-Suite Cyber Resilience Synthesis, Board Presentation Briefings & Automated PDF Reports
          </p>
        </div>

        <button className="btn-primary" disabled={compiling} onClick={handleCompile}>
          {compiling ? <RotateCw size={16} className="spin" /> : <Sparkles size={16} />}
          Compile Board Briefing
        </button>
      </div>

      {/* Metric Cards Tally */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            POSTURE SCORE
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
            {latest?.securityScore || 98} / 100
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Composite organizational resilience
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            AVG INCIDENT MTTR
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
            {latest?.mttrHours || 0.4} HRS
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Mean-Time-To-Remediate
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-purple)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            FINANCIAL RISK MITIGATED
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-purple)' }}>
            ${latest?.riskMitigatedDollars?.toLocaleString() || '145,000'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Prevented breach loss
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            COMPLIANCE GRADE
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
            {latest?.complianceGrade || 'A+'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Audit readiness rating
          </div>
        </div>
      </div>

      {/* Generated Board Reports Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={18} color="var(--accent-cyan)" /> Compiled Board Briefings & Executive Reports History
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(11, 15, 25, 0.9)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>REPORT TITLE</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>REPORT PERIOD</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>POSTURE SCORE</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>MTTR</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>GRADE</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((rep) => (
              <tr key={rep.id} style={{ borderBottom: '1px solid rgba(56, 189, 248, 0.08)' }}>
                <td style={{ padding: '16px 24px', fontSize: '0.9rem', fontWeight: 700 }}>
                  {rep.title}
                </td>

                <td style={{ padding: '16px 24px' }}>
                  <span className="badge badge-purple">{rep.period}</span>
                </td>

                <td style={{ padding: '16px 24px', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                  {rep.securityScore} / 100
                </td>

                <td style={{ padding: '16px 24px', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
                  {rep.mttrHours} Hours
                </td>

                <td style={{ padding: '16px 24px' }}>
                  <span className="badge badge-emerald">{rep.complianceGrade}</span>
                </td>

                <td style={{ padding: '16px 24px' }}>
                  <button
                    className="btn-primary"
                    style={{ fontSize: '0.75rem', padding: '6px 10px' }}
                    onClick={() => handlePreview(rep.id)}
                  >
                    <Eye size={12} /> Preview Board Report
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* HTML Report Preview Modal */}
      {previewHtml && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '40px',
          }}
        >
          <div
            className="glass-panel"
            style={{
              width: '900px',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>EXECUTIVE REPORT PREVIEW</div>
              <button
                onClick={() => setPreviewHtml(null)}
                style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <iframe
              srcDoc={previewHtml}
              style={{ flex: 1, width: '100%', height: '600px', border: 'none' }}
              title="Executive Report Preview"
            />
          </div>
        </div>
      )}
    </div>
  );
};
