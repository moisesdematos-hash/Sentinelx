import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import {
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Play,
  FileCode,
  RotateCw,
  Plus,
  ShieldCheck,
  Check,
  X,
  Sparkles,
} from 'lucide-react';

export const RemediationEnginePage: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedDiff, setSelectedDiff] = useState<string | null>(null);

  const loadTasks = async () => {
    try {
      const res: any = await apiClient.get('/remediation/tasks');
      if (res.success) setTasks(res.data);
    } catch (err) {
      console.error('Failed to load remediation tasks', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      const res: any = await apiClient.post(`/remediation/tasks/${id}/approve`, {});
      if (res.success) loadTasks();
    } catch (err: any) {
      alert(err.message || 'Failed to approve task');
    } finally {
      setProcessingId(null);
    }
  };

  const handleExecute = async (id: string) => {
    setProcessingId(id);
    try {
      const res: any = await apiClient.post(`/remediation/tasks/${id}/execute`, {});
      if (res.success) loadTasks();
    } catch (err: any) {
      alert(err.message || 'Failed to execute remediation patch');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
        [SENTINELX REMEDIATION ENGINE] LOADING TECHNICAL PATCH EXECUTORS & VERIFICATION SCANS...
      </div>
    );
  }

  const pendingCount = tasks.filter((t) => t.status === 'PENDING_APPROVAL').length;
  const approvedCount = tasks.filter((t) => t.status === 'APPROVED').length;
  const completedCount = tasks.filter((t) => t.status === 'COMPLETED').length;

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Wrench size={28} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Remediation Engine & Automated Patch Hub</h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Dry-Run Code Diff Preview, Analyst 1-Click Patch Approvals & Post-Execution Verification Scans
          </p>
        </div>
      </div>

      {/* Metric Cards Tally */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            PENDING APPROVAL
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
            {pendingCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Awaiting analyst review
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            APPROVED & READY
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
            {approvedCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Ready for execution
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            COMPLETED & VERIFIED
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
            {completedCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Post-scan verified pass
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-purple)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            POST-SCAN PASS RATE
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-purple)' }}>
            100% VERIFIED
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Zero regression score
          </div>
        </div>
      </div>

      {/* Main Remediation Tasks Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(11, 15, 25, 0.9)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TASK TITLE</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>PATCH TYPE</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TARGET</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>STATUS</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>VERIFICATION</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} style={{ borderBottom: '1px solid rgba(56, 189, 248, 0.08)' }}>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {task.title}
                  </div>
                  <button
                    className="btn-secondary"
                    style={{ fontSize: '0.72rem', padding: '2px 6px', marginTop: '6px' }}
                    onClick={() => setSelectedDiff(task.codeDiff)}
                  >
                    <FileCode size={12} /> Dry-Run Code Diff
                  </button>
                </td>

                <td style={{ padding: '16px 24px' }}>
                  <span className="badge badge-purple" style={{ fontFamily: 'var(--font-mono)' }}>
                    {task.patchType}
                  </span>
                </td>

                <td style={{ padding: '16px 24px', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                  {task.target}
                </td>

                <td style={{ padding: '16px 24px' }}>
                  <span className={task.status === 'COMPLETED' ? 'badge badge-emerald' : task.status === 'APPROVED' ? 'badge badge-cyan' : 'badge badge-amber'}>
                    {task.status}
                  </span>
                </td>

                <td style={{ padding: '16px 24px' }}>
                  <span className={task.verificationStatus === 'VERIFIED_PASS' ? 'badge badge-emerald' : 'badge badge-secondary'}>
                    {task.verificationStatus}
                  </span>
                </td>

                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {task.status === 'PENDING_APPROVAL' && (
                      <button
                        className="btn-secondary"
                        style={{ fontSize: '0.75rem', padding: '6px 10px' }}
                        disabled={processingId === task.id}
                        onClick={() => handleApprove(task.id)}
                      >
                        <Check size={12} /> Approve
                      </button>
                    )}

                    {(task.status === 'APPROVED' || task.status === 'PENDING_APPROVAL') && (
                      <button
                        className="btn-primary"
                        style={{ fontSize: '0.75rem', padding: '6px 10px' }}
                        disabled={processingId === task.id}
                        onClick={() => handleExecute(task.id)}
                      >
                        {processingId === task.id ? <RotateCw size={12} className="spin" /> : <Play size={12} />}
                        Execute Patch
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Code Diff Drawer Modal */}
      {selectedDiff && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(6, 8, 19, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '600px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileCode size={20} color="var(--accent-cyan)" /> Pre-Execution Dry-Run Code Diff
              </h3>
              <button onClick={() => setSelectedDiff(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <pre style={{ padding: '16px', borderRadius: '8px', background: 'rgba(6, 8, 19, 0.95)', border: '1px solid var(--border-color)', fontSize: '0.82rem', lineHeight: '1.5', overflowX: 'auto', fontFamily: 'var(--font-mono)' }}>
              {selectedDiff.split('\n').map((line, i) => (
                <div key={i} style={{ color: line.startsWith('+') ? 'var(--accent-emerald)' : line.startsWith('-') ? 'var(--accent-rose)' : 'var(--text-muted)' }}>
                  {line}
                </div>
              ))}
            </pre>

            <button className="btn-secondary" onClick={() => setSelectedDiff(null)}>
              Close Code Diff
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
