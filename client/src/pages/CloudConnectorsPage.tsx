import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import {
  Cloud,
  Layers,
  Plus,
  RefreshCw,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Shield,
  X,
  Server,
  Zap,
} from 'lucide-react';

export const CloudConnectorsPage: React.FC = () => {
  const [connectors, setConnectors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [formName, setFormName] = useState('');
  const [formProvider, setFormProvider] = useState<'AWS' | 'AZURE' | 'GCP'>('AWS');
  const [formRegion, setFormRegion] = useState('us-east-1');
  const [formRoleArn, setFormRoleArn] = useState('');

  const loadConnectors = async () => {
    try {
      const res: any = await apiClient.get('/cloud-connectors');
      if (res.success) setConnectors(res.data);
    } catch (err) {
      console.error('Failed to load cloud connectors', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConnectors();
  }, []);

  const handleCreateConnector = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res: any = await apiClient.post('/cloud-connectors', {
        name: formName,
        provider: formProvider,
        credentials: { roleArn: formRoleArn || 'arn:aws:iam::123456789012:role/SentinelXSecurityAuditor' },
        region: formRegion,
      });

      if (res.success) {
        setShowModal(false);
        setFormName('');
        setFormRoleArn('');
        loadConnectors();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to register cloud connector');
    }
  };

  const handleSyncConnector = async (id: string) => {
    setSyncingId(id);
    try {
      const res: any = await apiClient.post(`/cloud-connectors/${id}/sync`);
      if (res.success) {
        alert(`Cloud asset discovery complete! ${res.data.discoveredAssets.length} cloud resources synced into inventory.`);
        loadConnectors();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to sync cloud connector');
    } finally {
      setSyncingId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
        [SENTINELX CLOUD] QUERYING MULTI-CLOUD CONNECTORS (AWS / AZURE / GCP)...
      </div>
    );
  }

  const activeConnectors = connectors.filter((c) => c.status === 'ACTIVE').length;
  const totalDiscovered = connectors.reduce((acc, c) => acc + (c.discoveredAssetsCount || 0), 0);

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Cloud size={28} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Multi-Cloud Infrastructure Connectors</h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            AWS, Azure & GCP Automated Asset Discovery, IAM Policy Auditing & Surface Synchronization
          </p>
        </div>

        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Add Cloud Connector
        </button>
      </div>

      {/* Metric Cards Tally */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            CONNECTED PROVIDERS
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
            {connectors.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={12} /> AWS, Azure & GCP Active
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            ACTIVE CONNECTORS
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
            {activeConnectors}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Continuous discovery active
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-purple)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            DISCOVERED CLOUD ASSETS
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-purple)' }}>
            {totalDiscovered}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Synced to Asset Surface
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            AUTOMATED DISCOVERY
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            REAL-TIME
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', marginTop: '6px' }}>
            Scheduled every 60s
          </div>
        </div>
      </div>

      {/* Cloud Connectors Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={18} color="var(--accent-cyan)" />
            Registered Cloud Connectors Vault
          </h3>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(11, 15, 25, 0.9)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>PROVIDER</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>CONNECTOR NAME</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>REGION</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>DISCOVERED ASSETS</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>LAST SYNC</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>STATUS</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {connectors.map((c) => (
              <tr key={c.id} style={{ borderBottom: '1px solid rgba(56, 189, 248, 0.08)' }}>
                <td style={{ padding: '16px 24px' }}>
                  <span className={c.provider === 'AWS' ? 'badge badge-amber' : c.provider === 'AZURE' ? 'badge badge-cyan' : 'badge badge-purple'}>
                    {c.provider}
                  </span>
                </td>
                <td style={{ padding: '16px 24px', fontWeight: 600 }}>{c.name}</td>
                <td style={{ padding: '16px 24px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>{c.region}</td>
                <td style={{ padding: '16px 24px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                  {c.discoveredAssetsCount} Resources
                </td>
                <td style={{ padding: '16px 24px', fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {c.lastSyncAt ? new Date(c.lastSyncAt).toLocaleTimeString() : 'Pending Initial Sync'}
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <span className={c.status === 'ACTIVE' ? 'badge badge-emerald' : 'badge badge-rose'}>
                    {c.status}
                  </span>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <button
                    className="btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                    disabled={syncingId === c.id}
                    onClick={() => handleSyncConnector(c.id)}
                  >
                    {syncingId === c.id ? <RotateCw size={14} className="spin" /> : <RefreshCw size={14} />}
                    {syncingId === c.id ? 'Syncing...' : 'Discovery Sync'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Connector Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(6, 8, 19, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '520px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cloud size={20} color="var(--accent-cyan)" /> Register Cloud Connector
              </h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateConnector} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '6px' }}>CONNECTOR NAME</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. AWS Production Account"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '6px' }}>CLOUD PROVIDER</label>
                  <select className="input-field" value={formProvider} onChange={(e: any) => setFormProvider(e.target.value)}>
                    <option value="AWS">Amazon Web Services (AWS)</option>
                    <option value="AZURE">Microsoft Azure</option>
                    <option value="GCP">Google Cloud Platform (GCP)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '6px' }}>TARGET REGION</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="us-east-1"
                    value={formRegion}
                    onChange={(e) => setFormRegion(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '6px' }}>IAM ROLE ARN / SERVICE PRINCIPAL</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="arn:aws:iam::123456789012:role/SentinelXSecurityAuditor"
                  value={formRoleArn}
                  onChange={(e) => setFormRoleArn(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  Register Connector
                </button>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
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
