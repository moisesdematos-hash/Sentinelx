import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import {
  DollarSign,
  TrendingDown,
  Sparkles,
  PieChart,
  CheckCircle2,
  RotateCw,
  Trash2,
  Sliders,
  Server,
  Cloud,
  X,
  FileCode,
} from 'lucide-react';

export const FinOpsOptimizationPage: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const loadData = async () => {
    try {
      const [metRes, recRes]: any = await Promise.all([
        apiClient.get('/finops/metrics'),
        apiClient.get('/finops/recommendations'),
      ]);

      if (metRes.success) setMetrics(metRes.data);
      if (recRes.success) setRecommendations(recRes.data);
    } catch (err) {
      console.error('Failed to load FinOps data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApplyRec = async (id: string) => {
    setApplyingId(id);
    try {
      const res: any = await apiClient.post(`/finops/recommendations/${id}/apply`, {});
      if (res.success) loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to apply cost recommendation');
    } finally {
      setApplyingId(null);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const res: any = await apiClient.post('/finops/analyze', {});
      if (res.success) loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to trigger cloud wastage analysis');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
        [SENTINELX FINOPS ENGINE] CALCULATING CLOUD SECURITY SPEND & WASTAGE METRICS...
      </div>
    );
  }

  const pendingSavings = recommendations
    .filter((r) => r.status === 'PENDING')
    .reduce((acc, r) => acc + r.monthlySavingsEst, 0);

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <DollarSign size={28} color="var(--accent-emerald)" />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Cloud FinOps & Security ROI Optimization Hub</h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Automated Cloud Wastage Discovery, Security ROI Metrics & 1-Click Cost Remediation
          </p>
        </div>

        <button className="btn-primary" disabled={analyzing} onClick={handleAnalyze}>
          {analyzing ? <RotateCw size={16} className="spin" /> : <Sparkles size={16} />}
          Analyze Wastage
        </button>
      </div>

      {/* Metric Cards Tally */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            MONTHLY SECURITY SPEND
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
            ${metrics?.monthlySecuritySpend?.toLocaleString()} / mo
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Multi-cloud infrastructure tooling
          </div>
        </div>

        <div className="glass-panel glass-panel-danger" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-rose)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            ESTIMATED WASTAGE
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-rose)' }}>
            ${metrics?.monthlyWastageEst?.toLocaleString()} / mo
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Idle & unattached resources
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            POTENTIAL ANNUAL SAVINGS
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
            ${metrics?.projectedSavings?.toLocaleString()} / yr
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Actionable cost reduction
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-purple)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            SECURITY ROI RATIO
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-purple)' }}>
            {metrics?.roiPercentage}% ROI
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Risk saved vs dollars spent
          </div>
        </div>
      </div>

      {/* Cost Optimization Recommendations Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingDown size={18} color="var(--accent-emerald)" /> Actionable Cost Optimization Recommendations (${pendingSavings.toLocaleString()}/mo Pending)
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(11, 15, 25, 0.9)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>RECOMMENDATION TITLE</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>PROVIDER</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ACTION TYPE</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>MONTHLY SAVINGS EST.</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>STATUS</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {recommendations.map((rec) => (
              <tr key={rec.id} style={{ borderBottom: '1px solid rgba(56, 189, 248, 0.08)' }}>
                <td style={{ padding: '16px 24px', fontSize: '0.9rem', fontWeight: 700 }}>
                  {rec.title}
                </td>

                <td style={{ padding: '16px 24px' }}>
                  <span className="badge badge-purple">{rec.provider}</span>
                </td>

                <td style={{ padding: '16px 24px', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                  {rec.actionType}
                </td>

                <td style={{ padding: '16px 24px', fontSize: '0.92rem', fontWeight: 800, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
                  +${rec.monthlySavingsEst} / mo
                </td>

                <td style={{ padding: '16px 24px' }}>
                  <span className={rec.status === 'APPLIED' ? 'badge badge-emerald' : 'badge badge-amber'}>
                    {rec.status}
                  </span>
                </td>

                <td style={{ padding: '16px 24px' }}>
                  {rec.status === 'PENDING' && (
                    <button
                      className="btn-primary"
                      style={{ fontSize: '0.75rem', padding: '6px 10px' }}
                      disabled={applyingId === rec.id}
                      onClick={() => handleApplyRec(rec.id)}
                    >
                      {applyingId === rec.id ? <RotateCw size={12} className="spin" /> : <DollarSign size={12} />}
                      Apply Cost Savings
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Multi-Cloud Monthly Spending Telemetry */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PieChart size={18} color="var(--accent-purple)" /> Multi-Cloud Monthly Security Spending Telemetry Breakdown
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(11, 15, 25, 0.9)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>CLOUD CONNECTOR</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>MONTHLY INFRA COST</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SECURITY TOOLING COST</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>WASTAGE ESTIMATE</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>NET ROI METRIC</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid rgba(56, 189, 248, 0.08)' }}>
              <td style={{ padding: '16px 24px', fontSize: '0.88rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                AWS Production Account (us-east-1)
              </td>
              <td style={{ padding: '16px 24px', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>$3,200.00</td>
              <td style={{ padding: '16px 24px', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>$1,450.00</td>
              <td style={{ padding: '16px 24px', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-rose)' }}>$600.00</td>
              <td style={{ padding: '16px 24px' }}><span className="badge badge-emerald">+380% ROI</span></td>
            </tr>
            <tr style={{ borderBottom: '1px solid rgba(56, 189, 248, 0.08)' }}>
              <td style={{ padding: '16px 24px', fontSize: '0.88rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                Azure Enterprise Tenant (East US)
              </td>
              <td style={{ padding: '16px 24px', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>$1,650.00</td>
              <td style={{ padding: '16px 24px', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>$720.00</td>
              <td style={{ padding: '16px 24px', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-rose)' }}>$640.00</td>
              <td style={{ padding: '16px 24px' }}><span className="badge badge-emerald">+290% ROI</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
