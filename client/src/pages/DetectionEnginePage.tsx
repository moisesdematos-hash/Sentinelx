import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import {
  ShieldAlert,
  Sliders,
  Play,
  Plus,
  X,
  AlertOctagon,
  CheckCircle2,
  Lock,
  Cpu,
  FileCode,
  RotateCw,
  Search,
  Eye,
} from 'lucide-react';

export const DetectionEnginePage: React.FC = () => {
  const [rules, setRules] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<any | null>(null);

  // Modal State
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [ruleName, setRuleName] = useState('');
  const [ruleDesc, setRuleDesc] = useState('');
  const [ruleSeverity, setRuleSeverity] = useState('HIGH');
  const [ruleCategory, setRuleCategory] = useState('EXPLOIT');

  const loadData = async () => {
    try {
      const [rulesRes, alertsRes]: any = await Promise.all([
        apiClient.get('/detection/rules'),
        apiClient.get('/detection/alerts'),
      ]);

      if (rulesRes.success) setRules(rulesRes.data);
      if (alertsRes.success) setAlerts(alertsRes.data);
    } catch (err) {
      console.error('Failed to load detection engine data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEvaluate = async () => {
    setEvaluating(true);
    try {
      const res: any = await apiClient.post('/detection/evaluate', {});
      if (res.success) {
        loadData();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to evaluate detection rules');
    } finally {
      setEvaluating(false);
    }
  };

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res: any = await apiClient.post('/detection/rules', {
        name: ruleName,
        description: ruleDesc,
        severity: ruleSeverity,
        category: ruleCategory,
        ruleCondition: { target: 'custom_rule_expression' },
      });

      if (res.success) {
        setShowRuleModal(false);
        setRuleName('');
        setRuleDesc('');
        loadData();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to create detection rule');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
        [SENTINELX DETECTION ENGINE] LOADING SIGMA/YARA RULES & EVENT CORRELATION MATRIX...
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldAlert size={28} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Multi-Layered Threat Detection Engine</h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Sigma/YARA Detection Rules, Anomaly Telemetry Calculator & Multi-Event Attack Correlation
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-secondary" onClick={() => setShowRuleModal(true)}>
            <Plus size={16} /> New Rule
          </button>
          <button className="btn-primary" disabled={evaluating} onClick={handleEvaluate}>
            {evaluating ? <RotateCw size={16} className="spin" /> : <Play size={16} />}
            {evaluating ? 'Evaluating Engine...' : 'Evaluate Rules & Correlate'}
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            ACTIVE DETECTION RULES
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
            {rules.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={12} /> Sigma & YARA rules active
          </div>
        </div>

        <div className="glass-panel glass-panel-danger" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-rose)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            TRIGGERED ALERTS
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-rose)' }}>
            {alerts.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Open detection findings
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            CORRELATION MATRIX
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-purple)' }}>
            MULTI-WINDOW
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Cross-layer attack tracing
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            ANOMALY DETECTOR
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
            NORMAL
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Baseline variance &lt; 2.1%
          </div>
        </div>
      </div>

      {/* Main Grid: Active Rules & Generated Alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Active Rules Matrix */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={18} color="var(--accent-cyan)" />
            Detection Rules Matrix (Sigma / YARA Engine)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {rules.map((rule) => (
              <div
                key={rule.id}
                style={{
                  padding: '16px',
                  borderRadius: '8px',
                  background: 'rgba(11, 15, 25, 0.7)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {rule.name}
                  </span>
                  <span className={rule.severity === 'CRITICAL' ? 'badge badge-rose' : 'badge badge-amber'}>
                    {rule.severity}
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{rule.description}</p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                  <span className="badge badge-purple" style={{ fontFamily: 'var(--font-mono)' }}>{rule.category}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
                    STATUS: {rule.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Triggered Alerts Feed */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertOctagon size={18} color="var(--accent-rose)" />
            Triggered Threat Alerts & Evidence Findings
          </h3>

          {alerts.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  style={{
                    padding: '16px',
                    borderRadius: '8px',
                    background: 'rgba(244, 63, 94, 0.06)',
                    border: '1px solid rgba(244, 63, 94, 0.3)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    cursor: 'pointer',
                  }}
                  onClick={() => setSelectedAlert(alert)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-rose)' }}>
                      {alert.title}
                    </span>
                    <span className="badge badge-rose">{alert.severity}</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{alert.description}</p>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    Time: {new Date(alert.timestamp).toLocaleString()} | Status: {alert.status}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No threat alerts currently triggered. Click "Evaluate Rules & Correlate" to run threat evaluation.
            </div>
          )}
        </div>
      </div>

      {/* Evidence Modal / Drawer */}
      {selectedAlert && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(6, 8, 19, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '550px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-rose)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Eye size={20} /> Alert Evidence Details
              </h3>
              <button onClick={() => setSelectedAlert(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{selectedAlert.title}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>{selectedAlert.description}</p>
            </div>

            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '6px' }}>
                CORRELATION & EVIDENCE PROOF
              </div>
              <pre style={{ padding: '14px', borderRadius: '8px', background: 'rgba(6, 8, 19, 0.9)', border: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--accent-cyan)', overflowX: 'auto' }}>
                {JSON.stringify(selectedAlert.evidence, null, 2)}
              </pre>
            </div>

            <button className="btn-secondary" onClick={() => setSelectedAlert(null)}>
              Close Evidence View
            </button>
          </div>
        </div>
      )}

      {/* Create Rule Modal */}
      {showRuleModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(6, 8, 19, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '500px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={20} color="var(--accent-cyan)" /> Create Custom Detection Rule
              </h3>
              <button onClick={() => setShowRuleModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateRule} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '6px' }}>RULE NAME</label>
                <input
                  type="text"
                  className="input-field"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  placeholder="e.g. Detect Unauthorized AWS S3 Bucket Creation"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '6px' }}>DESCRIPTION</label>
                <textarea
                  className="input-field"
                  style={{ height: '60px' }}
                  value={ruleDesc}
                  onChange={(e) => setRuleDesc(e.target.value)}
                  placeholder="Explains what attack condition triggers this rule..."
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '6px' }}>SEVERITY</label>
                  <select className="input-field" value={ruleSeverity} onChange={(e) => setRuleSeverity(e.target.value)}>
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '6px' }}>CATEGORY</label>
                  <select className="input-field" value={ruleCategory} onChange={(e) => setRuleCategory(e.target.value)}>
                    <option value="EXPLOIT">Exploit</option>
                    <option value="BRUTE_FORCE">Brute Force</option>
                    <option value="PRIVILEGE_ESCALATION">Privilege Escalation</option>
                    <option value="DATA_LEAK">Data Leak</option>
                    <option value="ANOMALY">Anomaly</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  Save Rule
                </button>
                <button type="button" className="btn-secondary" onClick={() => setShowRuleModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
