import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import {
  Zap,
  Play,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  GitBranch,
  History,
  Shield,
  Layers,
  X,
  FileCode,
} from 'lucide-react';

export const SoarEnginePage: React.FC = () => {
  const [playbooks, setPlaybooks] = useState<any[]>([]);
  const [executions, setExecutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [executingId, setExecutingId] = useState<string | null>(null);
  const [selectedSteps, setSelectedSteps] = useState<any[] | null>(null);

  const loadData = async () => {
    try {
      const [playRes, execRes]: any = await Promise.all([
        apiClient.get('/soar/playbooks'),
        apiClient.get('/soar/executions'),
      ]);

      if (playRes.success) setPlaybooks(playRes.data);
      if (execRes.success) setExecutions(execRes.data);
    } catch (err) {
      console.error('Failed to load SOAR data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTriggerPlaybook = async (id: string) => {
    setExecutingId(id);
    try {
      const res: any = await apiClient.post(`/soar/playbooks/${id}/trigger`, {
        targetResource: 'prod-cluster-k8s-pod-auth-api',
      });
      if (res.success) loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to trigger SOAR playbook execution');
    } finally {
      setExecutingId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
        [SENTINELX SOAR ENGINE] INITIALIZING MULTI-STEP RESPONSE DAG EXECUTION WORKERS...
      </div>
    );
  }

  const totalExecutions = playbooks.reduce((acc, p) => acc + p.executionsCount, 0);

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Zap size={28} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>SOAR Automated Response & Orchestration Hub</h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Security Orchestration, Automation & Response Multi-Step DAG Playbook Execution & Incident Countermeasures
          </p>
        </div>
      </div>

      {/* Metric Cards Tally */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            ACTIVE PLAYBOOKS
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
            {playbooks.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Multi-step response workflows
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            PLAYBOOK EXECUTIONS
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
            {totalExecutions}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Automated countermeasures
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-purple)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            AVG RESPONSE TIME
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-purple)' }}>
            42 ms
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Automated DAG execution
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            EXECUTION SUCCESS RATE
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
            100% SUCCESS
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Zero failed steps
          </div>
        </div>
      </div>

      {/* Playbook Templates Grid */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <GitBranch size={18} color="var(--accent-cyan)" /> Configured Response Playbooks & Workflow Templates
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(11, 15, 25, 0.9)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>PLAYBOOK NAME</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TRIGGER CONDITION</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>MODE</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TOTAL RUNS</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {playbooks.map((p) => {
              const steps = JSON.parse(p.actionSteps || '[]');
              return (
                <tr key={p.id} style={{ borderBottom: '1px solid rgba(56, 189, 248, 0.08)' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {p.name}
                    </div>
                    <button
                      className="btn-secondary"
                      style={{ fontSize: '0.72rem', padding: '2px 6px', marginTop: '6px' }}
                      onClick={() => setSelectedSteps(steps)}
                    >
                      <Layers size={12} /> View {steps.length} Workflow Steps
                    </button>
                  </td>

                  <td style={{ padding: '16px 24px' }}>
                    <span className="badge badge-rose" style={{ fontFamily: 'var(--font-mono)' }}>
                      {p.triggerCondition}
                    </span>
                  </td>

                  <td style={{ padding: '16px 24px' }}>
                    <span className={p.executionMode === 'AUTOMATIC' ? 'badge badge-emerald' : 'badge badge-amber'}>
                      {p.executionMode}
                    </span>
                  </td>

                  <td style={{ padding: '16px 24px', fontSize: '0.88rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                    {p.executionsCount}
                  </td>

                  <td style={{ padding: '16px 24px' }}>
                    <button
                      className="btn-primary"
                      style={{ fontSize: '0.75rem', padding: '6px 10px' }}
                      disabled={executingId === p.id}
                      onClick={() => handleTriggerPlaybook(p.id)}
                    >
                      {executingId === p.id ? <RotateCw size={12} className="spin" /> : <Play size={12} />}
                      Trigger Playbook
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Live Execution Timeline Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <History size={18} color="var(--accent-emerald)" /> Executed Playbook Log & Countermeasure History
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(11, 15, 25, 0.9)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TIMESTAMP</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>PLAYBOOK</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TARGET RESOURCE</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>LATENCY</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {executions.map((exec) => (
              <tr key={exec.id} style={{ borderBottom: '1px solid rgba(56, 189, 248, 0.08)' }}>
                <td style={{ padding: '16px 24px', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>
                  {new Date(exec.timestamp).toLocaleString()}
                </td>

                <td style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 600 }}>
                  {exec.playbook?.name || 'Response Playbook'}
                </td>

                <td style={{ padding: '16px 24px', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                  {exec.targetResource}
                </td>

                <td style={{ padding: '16px 24px', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
                  {exec.executionTimeMs} ms
                </td>

                <td style={{ padding: '16px 24px' }}>
                  <span className="badge badge-emerald">{exec.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Steps Drawer Modal */}
      {selectedSteps && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(6, 8, 19, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '550px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <GitBranch size={20} color="var(--accent-cyan)" /> Playbook Multi-Step Execution Plan
              </h3>
              <button onClick={() => setSelectedSteps(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {selectedSteps.map((step, idx) => (
                <div key={idx} style={{ padding: '12px 16px', borderRadius: '8px', background: 'rgba(11, 15, 25, 0.8)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent-cyan)', color: '#060813', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
                    {step.stepOrder}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                      {step.action}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {step.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="btn-secondary" onClick={() => setSelectedSteps(null)}>
              Close Step Viewer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
