import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import {
  Radio,
  Zap,
  Filter,
  Plus,
  X,
  Send,
  AlertOctagon,
  ShieldAlert,
  Info,
  CheckCircle2,
  FileCode,
} from 'lucide-react';

export const EventBusPage: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  // Filters State
  const [filterSeverity, setFilterSeverity] = useState('');
  const [filterEngine, setFilterEngine] = useState('');

  // Publisher Modal State
  const [showPublisher, setShowPublisher] = useState(false);
  const [pubEventType, setPubEventType] = useState('CriticalIncidentDetected');
  const [pubEngine, setPubEngine] = useState('SERVER');
  const [pubSeverity, setPubSeverity] = useState('CRITICAL');
  const [pubMessage, setPubMessage] = useState('Anomalous privilege escalation attempt detected');

  const loadEvents = async () => {
    try {
      let url = '/events?limit=50';
      if (filterSeverity) url += `&severity=${filterSeverity}`;
      if (filterEngine) url += `&sourceEngine=${filterEngine}`;

      const res: any = await apiClient.get(url);
      if (res.success) setEvents(res.data);
    } catch (err) {
      console.error('Failed to load security event stream', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [filterSeverity, filterEngine]);

  const handlePublishEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res: any = await apiClient.post('/events', {
        eventType: pubEventType,
        sourceEngine: pubEngine,
        severity: pubSeverity,
        payload: { message: pubMessage, publishedAt: new Date().toISOString() },
      });

      if (res.success) {
        setShowPublisher(false);
        setPubMessage('');
        loadEvents();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to publish security event');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
        [SENTINELX EVENT BUS] CONNECTING TO UNIFIED SECURITY EVENT PIPELINE...
      </div>
    );
  }

  const criticalEvents = events.filter((e) => e.severity === 'CRITICAL').length;
  const highEvents = events.filter((e) => e.severity === 'HIGH').length;
  const infoEvents = events.filter((e) => e.severity === 'INFO').length;

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Radio size={28} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Central Security Event Bus</h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            High-Throughput Security Event Pipeline, Priority Queuing & SSE Broadcast Stream
          </p>
        </div>

        <button className="btn-primary" onClick={() => setShowPublisher(true)}>
          <Plus size={16} /> Publish Security Event
        </button>
      </div>

      {/* Metric Cards Tally */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        <div className="glass-panel glass-panel-danger" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-rose)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            CRITICAL EVENTS
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-rose)' }}>
            {criticalEvents}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Immediate response priority
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            HIGH SEVERITY
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
            {highEvents}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            High severity telemetry
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            INFO & MONITORING
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
            {infoEvents}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Informational pipeline logs
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            EVENT STREAM STATUS
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
            LIVE SSE STREAM
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Zero polling latency
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Filter size={16} color="var(--text-muted)" />

        <select
          className="input-field"
          style={{ width: '180px' }}
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value)}
        >
          <option value="">All Severities</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
          <option value="INFO">Info</option>
        </select>

        <select
          className="input-field"
          style={{ width: '180px' }}
          value={filterEngine}
          onChange={(e) => setFilterEngine(e.target.value)}
        >
          <option value="">All Source Engines</option>
          <option value="WEBSITE">Website Security</option>
          <option value="SERVER">Server Security</option>
          <option value="API">API Security</option>
          <option value="CONTAINER">Container Security</option>
          <option value="CLOUD">Cloud Posture</option>
          <option value="VULNERABILITY">Vulnerability Engine</option>
          <option value="MONITORING">Continuous Monitoring</option>
        </select>
      </div>

      {/* Event Stream Table & Drawer */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedEvent ? '1fr 420px' : '1fr', gap: '24px' }}>
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(11, 15, 25, 0.9)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TIMESTAMP</th>
                <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>EVENT TYPE</th>
                <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SOURCE ENGINE</th>
                <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SEVERITY</th>
                <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TARGET ASSET</th>
              </tr>
            </thead>
            <tbody>
              {events.map((evt) => (
                <tr
                  key={evt.id}
                  style={{
                    borderBottom: '1px solid rgba(56, 189, 248, 0.08)',
                    background: selectedEvent?.id === evt.id ? 'rgba(0, 242, 254, 0.06)' : 'transparent',
                    cursor: 'pointer',
                  }}
                  onClick={() => setSelectedEvent(evt)}
                >
                  <td style={{ padding: '16px 24px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {new Date(evt.timestamp).toLocaleTimeString()}
                  </td>
                  <td style={{ padding: '16px 24px', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                    {evt.eventType}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span className="badge badge-purple">{evt.sourceEngine}</span>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span className={evt.severity === 'CRITICAL' ? 'badge badge-rose' : evt.severity === 'HIGH' ? 'badge badge-amber' : 'badge badge-cyan'}>
                      {evt.severity}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '0.85rem' }}>
                    {evt.asset?.name || 'Infrastructure Wide'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Selected Event Payload Drawer */}
        {selectedEvent && (
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Zap size={20} color="var(--accent-cyan)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Event Payload Inspector</h3>
              </div>
              <button onClick={() => setSelectedEvent(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                {selectedEvent.eventType}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Published: {new Date(selectedEvent.timestamp).toLocaleString()}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <span className={selectedEvent.severity === 'CRITICAL' ? 'badge badge-rose' : 'badge badge-amber'}>
                {selectedEvent.severity}
              </span>
              <span className="badge badge-purple">{selectedEvent.sourceEngine}</span>
            </div>

            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '6px' }}>
                EVENT JSON PAYLOAD
              </div>
              <pre style={{ padding: '14px', borderRadius: '8px', background: 'rgba(6, 8, 19, 0.9)', border: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--accent-cyan)', overflowX: 'auto' }}>
                {JSON.stringify(selectedEvent.payload, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Manual Event Publisher Modal */}
      {showPublisher && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(6, 8, 19, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '500px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Send size={20} color="var(--accent-cyan)" /> Publish Security Event
              </h3>
              <button onClick={() => setShowPublisher(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handlePublishEvent} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '6px' }}>EVENT TYPE</label>
                <input
                  type="text"
                  className="input-field"
                  value={pubEventType}
                  onChange={(e) => setPubEventType(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '6px' }}>SOURCE ENGINE</label>
                  <select className="input-field" value={pubEngine} onChange={(e) => setPubEngine(e.target.value)}>
                    <option value="WEBSITE">Website Security</option>
                    <option value="SERVER">Server Security</option>
                    <option value="API">API Security</option>
                    <option value="CONTAINER">Container Security</option>
                    <option value="CLOUD">Cloud Posture</option>
                    <option value="VULNERABILITY">Vulnerability Engine</option>
                    <option value="MONITORING">Continuous Monitoring</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '6px' }}>SEVERITY LEVEL</label>
                  <select className="input-field" value={pubSeverity} onChange={(e) => setPubSeverity(e.target.value)}>
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                    <option value="INFO">Info</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '6px' }}>EVENT MESSAGE / PAYLOAD</label>
                <textarea
                  className="input-field"
                  style={{ height: '80px' }}
                  value={pubMessage}
                  onChange={(e) => setPubMessage(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  Publish Event
                </button>
                <button type="button" className="btn-secondary" onClick={() => setShowPublisher(false)}>
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
