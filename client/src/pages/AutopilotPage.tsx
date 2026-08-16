import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import {
  ShieldAlert,
  Zap,
  Sliders,
  AlertTriangle,
  RotateCw,
  Power,
  CheckCircle2,
  Lock,
  Radio,
  FileText,
} from 'lucide-react';

export const AutopilotPage: React.FC = () => {
  const [policies, setPolicies] = useState<any[]>([]);
  const [actions, setActions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [killSwitchEngaged, setKillSwitchEngaged] = useState(false);

  const loadData = async () => {
    try {
      const [policiesRes, actionsRes]: any = await Promise.all([
        apiClient.get('/autopilot/policies'),
        apiClient.get('/autopilot/actions'),
      ]);

      if (policiesRes.success) setPolicies(policiesRes.data);
      if (actionsRes.success) setActions(actionsRes.data);
    } catch (err) {
      console.error('Failed to load autopilot data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleExecuteSelfDefense = async () => {
    setExecuting(true);
    try {
      const res: any = await apiClient.post('/autopilot/execute', {});
      if (res.success) {
        loadData();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to trigger self-defense cycle');
    } finally {
      setExecuting(false);
    }
  };

  const handleKillSwitch = async () => {
    if (!confirm('CAUTION: Are you sure you want to trigger the EMERGENCY KILL SWITCH? This will immediately pause all autonomous self-defense policies!')) return;

    try {
      const res: any = await apiClient.post('/autopilot/kill-switch', {});
      if (res.success) {
        setKillSwitchEngaged(true);
        loadData();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to trigger emergency kill switch');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
        [SENTINELX AUTOPILOT] INITIALIZING AUTONOMOUS SELF-DEFENSE CONTROLS & RATE LIMIT GUARDRAILS...
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Zap size={28} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Autopilot Engine & Autonomous Defense</h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Self-Executing Policy Evaluator, Safety Rate-Limit Guardrails & Instant Emergency Kill Switch
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-primary" disabled={executing} onClick={handleExecuteSelfDefense}>
            {executing ? <RotateCw size={16} className="spin" /> : <Radio size={16} />}
            {executing ? 'Executing Self-Defense...' : 'Trigger Self-Defense Cycle'}
          </button>

          <button
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              border: 'none',
              background: 'var(--gradient-rose)',
              color: '#fff',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onClick={handleKillSwitch}
          >
            <Power size={16} /> EMERGENCY KILL SWITCH
          </button>
        </div>
      </div>

      {/* Kill Switch Status Banner if Engaged */}
      {killSwitchEngaged && (
        <div style={{ padding: '16px 24px', borderRadius: '8px', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid var(--accent-rose)', color: 'var(--accent-rose)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <AlertTriangle size={20} />
          EMERGENCY KILL SWITCH ENGAGED: All autonomous defense policies have been PAUSED and set to DISABLED.
        </div>
      )}

      {/* Metric Cards Tally */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            ACTIVE POLICIES
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
            {policies.filter((p) => p.status === 'ENABLED').length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Enforced policy rules
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            FULL AUTO ACTIONS
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
            {actions.filter((a) => a.executionMode === 'FULL_AUTO' && a.status === 'EXECUTED').length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Autonomous mitigations
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            SEMI AUTO PENDING
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
            {actions.filter((a) => a.status === 'PENDING_APPROVAL').length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Awaiting 1-click approval
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-rose)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            GUARDRAIL RATE LIMIT
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-rose)' }}>
            MAX 5 / HR
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Safety threshold active
          </div>
        </div>
      </div>

      {/* Policies Grid */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sliders size={18} color="var(--accent-cyan)" /> Autonomous Self-Defense Policies
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {policies.map((pol) => (
            <div
              key={pol.id}
              style={{
                padding: '20px',
                borderRadius: '8px',
                background: 'rgba(11, 15, 25, 0.7)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={pol.executionMode === 'FULL_AUTO' ? 'badge badge-emerald' : 'badge badge-amber'}>
                  {pol.executionMode}
                </span>
                <span className={pol.status === 'ENABLED' ? 'badge badge-cyan' : 'badge badge-rose'}>
                  {pol.status}
                </span>
              </div>

              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {pol.name}
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                Trigger: {pol.triggerCondition} | Action: {pol.actionType}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Execution Stream Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', fontSize: '1.1rem', fontWeight: 700 }}>
          Autonomous Action Execution Log
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(11, 15, 25, 0.9)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TIMESTAMP</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ACTION TYPE</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TARGET RESOURCE</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>EXECUTION MODE</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {actions.map((act) => (
              <tr key={act.id} style={{ borderBottom: '1px solid rgba(56, 189, 248, 0.08)' }}>
                <td style={{ padding: '16px 24px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                  {new Date(act.executedAt).toLocaleString()}
                </td>
                <td style={{ padding: '16px 24px', fontSize: '0.88rem', fontWeight: 700 }}>
                  {act.actionType}
                </td>
                <td style={{ padding: '16px 24px', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                  {act.targetResource}
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <span className="badge badge-purple">{act.executionMode}</span>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <span className={act.status === 'EXECUTED' ? 'badge badge-emerald' : act.status === 'BLOCKED_BY_GUARDRAIL' ? 'badge badge-rose' : 'badge badge-amber'}>
                    {act.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
