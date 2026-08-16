import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import {
  Bot,
  Sparkles,
  RotateCw,
  ShieldAlert,
  GitCommit,
  Cpu,
  FileText,
  Activity,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
} from 'lucide-react';

export const AiInvestigationPage: React.FC = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [investigating, setInvestigating] = useState(false);

  const loadData = async () => {
    try {
      const res: any = await apiClient.get('/ai-investigations');
      if (res.success) setReports(res.data);
    } catch (err) {
      console.error('Failed to load AI investigation reports', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRunInvestigation = async () => {
    setInvestigating(true);
    try {
      const res: any = await apiClient.post('/ai-investigations', {
        incidentTitle: 'Suspicious API Key Leak & Unauthorized S3 Bucket Dump',
      });
      if (res.success) loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to trigger multi-agent AI investigation');
    } finally {
      setInvestigating(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
        [SENTINEL MULTI-AGENT AI] ORCHESTRATING LOG ANALYST, IAM AUDITOR & FORENSICS SUBAGENTS...
      </div>
    );
  }

  const activeReport = reports[0];
  const storyboard = JSON.parse(activeReport?.attackStoryboard || '[]');

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bot size={28} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>AI Incident Analyst & Autonomous Root-Cause Investigation</h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Multi-Agent AI Reasoning, Attack Storyboard Timeline Reconstruction & CISO Executive Briefings
          </p>
        </div>

        <button className="btn-primary" disabled={investigating} onClick={handleRunInvestigation}>
          {investigating ? <RotateCw size={16} className="spin" /> : <Sparkles size={16} />}
          Investigate P0 Incident
        </button>
      </div>

      {/* Metric Cards Tally */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            AI REPORTS COMPLETED
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
            {reports.length} REPORTS
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Multi-agent investigations
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-purple)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            STORYBOARD STAGES
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-purple)' }}>
            {storyboard.length} STAGES
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Multi-hop attack timeline
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            AI CONFIDENCE SCORE
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
            {activeReport?.confidenceScore || 98}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Root-cause accuracy rating
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            SUBAGENTS ACTIVE
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
            4 AGENTS
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Log, IAM, Code & Forensics
          </div>
        </div>
      </div>

      {/* CISO Executive Briefing Card */}
      <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid var(--accent-cyan)' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileCheck size={18} /> NATURAL LANGUAGE CISO EXECUTIVE BRIEFING
        </div>
        <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--text-secondary)', background: 'rgba(11, 15, 25, 0.6)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          {activeReport?.cisoBriefing}
        </p>
      </div>

      {/* Attack Storyboard Timeline View */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <GitCommit size={18} color="var(--accent-purple)" /> Reconstructed Multi-Hop Attack Storyboard Timeline
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {storyboard.map((step: any) => (
            <div key={step.step} style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', background: 'rgba(15, 23, 42, 0.6)', padding: '16px 20px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--gradient-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#060813', flexShrink: 0 }}>
                {step.step}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{step.stage}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>{step.agent}</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{step.timestamp}</span>
                  </div>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
