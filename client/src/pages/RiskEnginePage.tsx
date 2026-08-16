import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import {
  TrendingUp,
  AlertTriangle,
  Zap,
  RotateCw,
  CheckCircle2,
  Sliders,
  Shield,
  Layers,
  FileText,
  Info,
} from 'lucide-react';

export const RiskEnginePage: React.FC = () => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);
  const [activeTab, setActiveTab] = useState<'P0' | 'P1' | 'P2' | 'P3'>('P0');
  const [selectedProfile, setSelectedProfile] = useState<any | null>(null);

  const loadMatrix = async () => {
    try {
      const res: any = await apiClient.get('/risk/matrix');
      if (res.success) setData(res.data);
    } catch (err) {
      console.error('Failed to load risk priority matrix', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatrix();
  }, []);

  const handleRecalculate = async () => {
    setRecalculating(true);
    try {
      const res: any = await apiClient.post('/risk/calculate', {});
      if (res.success) {
        loadMatrix();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to recalculate risk');
    } finally {
      setRecalculating(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
        [SENTINELX RISK ENGINE] CALCULATING CONTEXTUAL RISK FORMULAS & ACTION PRIORITY TIERS...
      </div>
    );
  }

  const matrix = data?.matrix || { p0Immediate: [], p1High: [], p2Moderate: [], p3Low: [] };
  const currentList =
    activeTab === 'P0'
      ? matrix.p0Immediate
      : activeTab === 'P1'
      ? matrix.p1High
      : activeTab === 'P2'
      ? matrix.p2Moderate
      : matrix.p3Low;

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <TrendingUp size={28} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Risk & Action Priority Matrix Engine</h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Contextual Risk Model Weighting Asset Criticality, CVSS Scores, Threat Telemetry & Blast Radius
          </p>
        </div>

        <button className="btn-primary" disabled={recalculating} onClick={handleRecalculate}>
          {recalculating ? <RotateCw size={16} className="spin" /> : <Zap size={16} />}
          {recalculating ? 'Recalculating Risk...' : 'Recalculate Contextual Risk'}
        </button>
      </div>

      {/* Metric Cards Tally */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        <div className="glass-panel glass-panel-danger" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-rose)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            P0 IMMEDIATE ACTION
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-rose)' }}>
            {matrix.p0Immediate.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Immediate remediation required
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            P1 HIGH PRIORITY
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
            {matrix.p1High.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Elevated risk profiles
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            P2 MODERATE
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
            {matrix.p2Moderate.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Standard maintenance window
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            P3 LOW PRIORITY
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
            {matrix.p3Low.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Normal operational baseline
          </div>
        </div>
      </div>

      {/* Priority Matrix Tabs */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
          <button
            className={activeTab === 'P0' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setActiveTab('P0')}
          >
            🔥 P0 Immediate ({matrix.p0Immediate.length})
          </button>
          <button
            className={activeTab === 'P1' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setActiveTab('P1')}
          >
            ⚠️ P1 High ({matrix.p1High.length})
          </button>
          <button
            className={activeTab === 'P2' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setActiveTab('P2')}
          >
            ⚡ P2 Moderate ({matrix.p2Moderate.length})
          </button>
          <button
            className={activeTab === 'P3' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setActiveTab('P3')}
          >
            🛡️ P3 Low ({matrix.p3Low.length})
          </button>
        </div>

        {/* Priority Tier Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {currentList.map((item: any) => (
            <div
              key={item.id}
              style={{
                padding: '18px',
                borderRadius: '8px',
                background: 'rgba(11, 15, 25, 0.7)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className={item.overallRiskScore >= 80 ? 'badge badge-rose' : item.overallRiskScore >= 60 ? 'badge badge-amber' : 'badge badge-cyan'}>
                    Risk Score: {item.overallRiskScore}/100
                  </span>
                  <span style={{ fontSize: '1rem', fontWeight: 700 }}>
                    {item.asset?.name || 'Global Organization Risk'}
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '6px' }}>
                  Target: {item.asset?.target || 'All Endpoints'} | Formula: {item.factorsBreakdown.formula}
                </div>
              </div>

              <button className="btn-secondary" style={{ fontSize: '0.78rem' }} onClick={() => setSelectedProfile(item)}>
                View Risk Factors
              </button>
            </div>
          ))}

          {currentList.length === 0 && (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No findings in the {activeTab} Priority Tier.
            </div>
          )}
        </div>
      </div>

      {/* Risk Factors Drawer */}
      {selectedProfile && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(6, 8, 19, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '550px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                RISK FORMULA BREAKDOWN
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '4px' }}>
                {selectedProfile.asset?.name || 'Asset Risk Factors'}
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '14px', borderRadius: '8px', background: 'rgba(11, 15, 25, 0.7)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Asset Criticality ({selectedProfile.factorsBreakdown.assetCriticality})</span>
                <strong>+{selectedProfile.factorsBreakdown.criticalityWeight} pts</strong>
              </div>

              <div style={{ padding: '14px', borderRadius: '8px', background: 'rgba(11, 15, 25, 0.7)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Vulnerabilities CVSS Weight ({selectedProfile.factorsBreakdown.openVulnerabilitiesCount} Open)</span>
                <strong>+{selectedProfile.factorsBreakdown.cvssWeight} pts</strong>
              </div>

              <div style={{ padding: '14px', borderRadius: '8px', background: 'rgba(11, 15, 25, 0.7)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Threat Alerts Weight ({selectedProfile.factorsBreakdown.activeAlertsCount} Active)</span>
                <strong>+{selectedProfile.factorsBreakdown.alertWeight} pts</strong>
              </div>
            </div>

            <button className="btn-secondary" onClick={() => setSelectedProfile(null)}>
              Close Breakdown
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
