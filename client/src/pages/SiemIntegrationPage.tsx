import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import {
  Server,
  Plus,
  Play,
  CheckCircle2,
  Activity,
  Terminal,
  Layers,
  RotateCw,
  X,
  Radio,
  FileCode,
} from 'lucide-react';

export const SiemIntegrationPage: React.FC = () => {
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    provider: 'SPLUNK',
    endpointUrl: '',
    apiKey: '',
    logFormat: 'CEF',
  });

  const loadData = async () => {
    try {
      const [intRes, logRes]: any = await Promise.all([
        apiClient.get('/siem/integrations'),
        apiClient.get('/siem/logs'),
      ]);

      if (intRes.success) setIntegrations(intRes.data);
      if (logRes.success) setLogs(logRes.data);
    } catch (err) {
      console.error('Failed to load SIEM integration data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTestDispatch = async (id: string) => {
    setTestingId(id);
    try {
      const res: any = await apiClient.post(`/siem/integrations/${id}/test`, {});
      if (res.success) loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to dispatch SIEM test stream');
    } finally {
      setTestingId(null);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res: any = await apiClient.post('/siem/integrations', formData);
      if (res.success) {
        setShowAddModal(false);
        setFormData({ name: '', provider: 'SPLUNK', endpointUrl: '', apiKey: '', logFormat: 'CEF' });
        loadData();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to create SIEM integration');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
        [SENTINELX SIEM STREAMER] CONNECTING TO ENTERPRISE LOG SINK ENGINE...
      </div>
    );
  }

  const totalEventsForwarded = integrations.reduce((acc, i) => acc + i.eventsForwarded, 0);

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Server size={28} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Enterprise SIEM Integration Engine</h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Real-Time Security Event & Telemetry Forwarding via Splunk HEC, Datadog Logs API, Elasticsearch & Syslog (CEF / LEEF / JSON)
          </p>
        </div>

        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={16} /> Add SIEM Integration Sink
        </button>
      </div>

      {/* Metric Cards Tally */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            ACTIVE SIEM SINKS
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
            {integrations.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Connected log collectors
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            EVENTS FORWARDED
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
            {totalEventsForwarded.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Total streamed logs
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-purple)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            FORWARDING LATENCY
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-purple)' }}>
            15 ms
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Ultra-low streaming delay
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            FORMAT SUPPORT
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
            CEF / LEEF / JSON
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Standard SIEM specifications
          </div>
        </div>
      </div>

      {/* Configured SIEM Sinks Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Server size={18} color="var(--accent-cyan)" /> Configured SIEM Log Collectors & Export Sinks
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(11, 15, 25, 0.9)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>NAME</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>PROVIDER</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ENDPOINT URL</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>LOG FORMAT</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>EVENTS FORWARDED</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {integrations.map((siem) => (
              <tr key={siem.id} style={{ borderBottom: '1px solid rgba(56, 189, 248, 0.08)' }}>
                <td style={{ padding: '16px 24px', fontSize: '0.9rem', fontWeight: 700 }}>
                  {siem.name}
                </td>

                <td style={{ padding: '16px 24px' }}>
                  <span className="badge badge-purple">{siem.provider}</span>
                </td>

                <td style={{ padding: '16px 24px', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                  {siem.endpointUrl}
                </td>

                <td style={{ padding: '16px 24px' }}>
                  <span className="badge badge-cyan">{siem.logFormat}</span>
                </td>

                <td style={{ padding: '16px 24px', fontSize: '0.88rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  {siem.eventsForwarded.toLocaleString()}
                </td>

                <td style={{ padding: '16px 24px' }}>
                  <button
                    className="btn-primary"
                    style={{ fontSize: '0.75rem', padding: '6px 10px' }}
                    disabled={testingId === siem.id}
                    onClick={() => handleTestDispatch(siem.id)}
                  >
                    {testingId === siem.id ? <RotateCw size={12} className="spin" /> : <Play size={12} />}
                    Send Test Stream
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Live Log Forwarding Stream Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Terminal size={18} color="var(--accent-emerald)" /> Live Real-Time Log Forwarding Stream Logs
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(11, 15, 25, 0.9)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TIMESTAMP</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SIEM TARGET</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>EVENT</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>FORMATTED LOG PAYLOAD</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} style={{ borderBottom: '1px solid rgba(56, 189, 248, 0.08)' }}>
                <td style={{ padding: '16px 24px', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>
                  {new Date(log.timestamp).toLocaleString()}
                </td>

                <td style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 600 }}>
                  {log.siem?.name || 'Splunk HEC'}
                </td>

                <td style={{ padding: '16px 24px', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-purple)' }}>
                  {log.event}
                </td>

                <td style={{ padding: '16px 24px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  {log.payload}
                </td>

                <td style={{ padding: '16px 24px' }}>
                  <span className="badge badge-emerald">{log.status} ({log.executionMs}ms)</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add SIEM Integration Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(6, 8, 19, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '500px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Configure New SIEM Integration</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>SIEM Name</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="e.g. Datadog Production Sink"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>SIEM Provider</label>
                <select
                  className="input-field"
                  value={formData.provider}
                  onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                >
                  <option value="SPLUNK">Splunk HTTP Event Collector (HEC)</option>
                  <option value="DATADOG">Datadog Logs API</option>
                  <option value="ELASTIC">Elasticsearch / Logstash</option>
                  <option value="SENTINEL">Microsoft Sentinel</option>
                  <option value="SYSLOG">Generic Syslog (TLS)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Endpoint URL</label>
                <input
                  type="url"
                  required
                  className="input-field"
                  placeholder="https://siem-collector.corp.internal:8088/services/collector"
                  value={formData.endpointUrl}
                  onChange={(e) => setFormData({ ...formData, endpointUrl: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>API / Secret Key (Optional)</label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="HEC Token / API Key"
                  value={formData.apiKey}
                  onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Log Format Specification</label>
                <select
                  className="input-field"
                  value={formData.logFormat}
                  onChange={(e) => setFormData({ ...formData, logFormat: e.target.value })}
                >
                  <option value="CEF">Common Event Format (CEF)</option>
                  <option value="LEEF">Log Event Extended Format (LEEF)</option>
                  <option value="JSON">Standard JSON Payload</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  Create SIEM Sink
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
