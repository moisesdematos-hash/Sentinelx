import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import {
  AlertTriangle,
  Clock,
  UserCheck,
  Plus,
  X,
  MessageSquare,
  CheckCircle2,
  AlertOctagon,
  RotateCw,
  Send,
  Eye,
  Shield,
} from 'lucide-react';

export const IncidentCenterPage: React.FC = () => {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState<any | null>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [newNote, setNewNote] = useState('');

  // Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [severity, setSeverity] = useState('HIGH');
  const [assignee, setAssignee] = useState('SOC Lead Analyst');

  const loadIncidents = async () => {
    try {
      const res: any = await apiClient.get('/incidents');
      if (res.success) setIncidents(res.data);
    } catch (err) {
      console.error('Failed to load incident cases', err);
    } finally {
      setLoading(false);
    }
  };

  const loadTimeline = async (id: string) => {
    try {
      const res: any = await apiClient.get(`/incidents/${id}/timeline`);
      if (res.success) setTimeline(res.data);
    } catch (err) {
      console.error('Failed to load timeline', err);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  const handleCreateIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res: any = await apiClient.post('/incidents', {
        title,
        description: desc,
        severity,
        assignee,
      });

      if (res.success) {
        setShowCreateModal(false);
        setTitle('');
        setDesc('');
        loadIncidents();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to create incident case');
    }
  };

  const handleStatusChange = async (incidentId: string, newStatus: string) => {
    try {
      const res: any = await apiClient.patch(`/incidents/${incidentId}`, { status: newStatus });
      if (res.success) {
        loadIncidents();
        if (selectedIncident?.id === incidentId) {
          loadTimeline(incidentId);
        }
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update incident status');
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIncident || !newNote.trim()) return;

    try {
      const res: any = await apiClient.post(`/incidents/${selectedIncident.id}/timeline`, {
        content: newNote,
        actionType: 'ANALYST_NOTE',
      });

      if (res.success) {
        setNewNote('');
        loadTimeline(selectedIncident.id);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to add timeline note');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
        [SENTINELX INCIDENT CENTER] LOADING INCIDENT CASES & SLA TRACKERS...
      </div>
    );
  }

  const openIncidents = incidents.filter((i) => i.status === 'OPEN').length;
  const inContainment = incidents.filter((i) => i.status === 'IN_CONTAINMENT').length;
  const resolvedCount = incidents.filter((i) => i.status === 'RESOLVED' || i.status === 'CLOSED').length;

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={28} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Incident Center & SLA Response Hub</h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Unified Case Management, Containment Workflows, Analyst Timelines & Response SLA Tracking
          </p>
        </div>

        <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
          <Plus size={16} /> New Incident Case
        </button>
      </div>

      {/* Metric Cards Tally */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        <div className="glass-panel glass-panel-danger" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-rose)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            OPEN INCIDENTS
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-rose)' }}>
            {openIncidents}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Active triage priority
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            IN CONTAINMENT
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
            {inContainment}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Active isolation steps
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            RESOLVED / CLOSED
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
            {resolvedCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Closed security findings
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            RESPONSE SLA TARGET
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
            &lt; 15 MINS (P0)
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            100% SLA compliance rate
          </div>
        </div>
      </div>

      {/* Main Grid: Incident Table & Timeline Drawer */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedIncident ? '1fr 420px' : '1fr', gap: '24px' }}>
        {/* Incidents Table */}
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(11, 15, 25, 0.9)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>CASE TITLE</th>
                <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SEVERITY</th>
                <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>STATUS WORKFLOW</th>
                <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ASSIGNEE</th>
                <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((inc) => (
                <tr
                  key={inc.id}
                  style={{
                    borderBottom: '1px solid rgba(56, 189, 248, 0.08)',
                    background: selectedIncident?.id === inc.id ? 'rgba(0, 242, 254, 0.06)' : 'transparent',
                  }}
                >
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {inc.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Created: {new Date(inc.createdAt).toLocaleString()}
                    </div>
                  </td>

                  <td style={{ padding: '16px 24px' }}>
                    <span className={inc.severity === 'CRITICAL' ? 'badge badge-rose' : 'badge badge-amber'}>
                      {inc.severity}
                    </span>
                  </td>

                  <td style={{ padding: '16px 24px' }}>
                    <select
                      className="input-field"
                      style={{ padding: '4px 8px', fontSize: '0.78rem', width: '150px' }}
                      value={inc.status}
                      onChange={(e) => handleStatusChange(inc.id, e.target.value)}
                    >
                      <option value="OPEN">OPEN</option>
                      <option value="TRIAGED">TRIAGED</option>
                      <option value="IN_CONTAINMENT">IN_CONTAINMENT</option>
                      <option value="RESOLVED">RESOLVED</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
                  </td>

                  <td style={{ padding: '16px 24px', fontSize: '0.85rem' }}>
                    {inc.assignee}
                  </td>

                  <td style={{ padding: '16px 24px' }}>
                    <button
                      className="btn-secondary"
                      style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                      onClick={() => {
                        setSelectedIncident(inc);
                        loadTimeline(inc.id);
                      }}
                    >
                      <Eye size={12} /> Timeline Trail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Selected Incident Timeline Drawer */}
        {selectedIncident && (
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Clock size={20} color="var(--accent-cyan)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Incident Audit Timeline</h3>
              </div>
              <button onClick={() => setSelectedIncident(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{selectedIncident.title}</h4>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <span className="badge badge-rose">{selectedIncident.severity}</span>
                <span className="badge badge-purple">{selectedIncident.status}</span>
              </div>
            </div>

            {/* Timeline Stream */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflowY: 'auto' }}>
              {timeline.map((item) => (
                <div key={item.id} style={{ padding: '12px', borderRadius: '8px', background: 'rgba(11, 15, 25, 0.7)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                    <span>{item.author}</span>
                    <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', marginTop: '6px', color: 'var(--text-primary)' }}>{item.content}</p>
                </div>
              ))}
            </div>

            {/* Add Timeline Note Form */}
            <form onSubmit={handleAddNote} style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <input
                type="text"
                className="input-field"
                placeholder="Add analyst note or containment step..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn-primary" style={{ padding: '8px 14px' }}>
                <Send size={14} />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* New Incident Modal */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(6, 8, 19, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '500px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={20} color="var(--accent-cyan)" /> Create New Incident Case
              </h3>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateIncident} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '6px' }}>CASE TITLE</label>
                <input
                  type="text"
                  className="input-field"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Critical RCE Exploit Flaw Detected"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '6px' }}>DESCRIPTION</label>
                <textarea
                  className="input-field"
                  style={{ height: '60px' }}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Details regarding threat impact and initial telemetry..."
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '6px' }}>SEVERITY</label>
                  <select className="input-field" value={severity} onChange={(e) => setSeverity(e.target.value)}>
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '6px' }}>ASSIGNEE</label>
                  <input
                    type="text"
                    className="input-field"
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  Create Case
                </button>
                <button type="button" className="btn-secondary" onClick={() => setShowCreateModal(false)}>
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
