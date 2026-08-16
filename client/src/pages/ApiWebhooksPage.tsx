import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import {
  Key,
  Webhook as WebhookIcon,
  Plus,
  Trash2,
  Send,
  Copy,
  Check,
  ShieldCheck,
  Lock,
  Code2,
} from 'lucide-react';

export const ApiWebhooksPage: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'apikeys' | 'webhooks'>('apikeys');
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [keyForm, setKeyForm] = useState({ name: '', permissions: 'read,write' });
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);

  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);
  const [webhookForm, setWebhookForm] = useState({
    name: '',
    url: '',
    events: ['VulnerabilityDetected', 'CriticalIncidentDetected'],
  });

  const [copied, setCopied] = useState(false);

  const loadData = async () => {
    try {
      const [keysRes, webhooksRes]: [any, any] = await Promise.all([
        apiClient.get('/api-keys'),
        apiClient.get('/webhooks'),
      ]);
      if (keysRes.success) setApiKeys(keysRes.data);
      if (webhooksRes.success) setWebhooks(webhooksRes.data);
    } catch (err) {
      console.error('Failed to load API & Webhook data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res: any = await apiClient.post('/api-keys', keyForm);
      if (res.success) {
        setGeneratedKey(res.data.rawKey);
        setKeyForm({ name: '', permissions: 'read,write' });
        loadData();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to create API key');
    }
  };

  const handleRevokeKey = async (id: string) => {
    if (!confirm('Are you sure you want to revoke this API key? Applications using it will lose access immediately.')) return;
    try {
      await apiClient.delete(`/api-keys/${id}`);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to revoke API key');
    }
  };

  const handleCreateWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res: any = await apiClient.post('/webhooks', webhookForm);
      if (res.success) {
        setIsWebhookModalOpen(false);
        setWebhookForm({ name: '', url: '', events: ['VulnerabilityDetected', 'CriticalIncidentDetected'] });
        loadData();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to register webhook');
    }
  };

  const handleTestDispatch = async (id: string) => {
    try {
      const res: any = await apiClient.post(`/webhooks/${id}/test`);
      if (res.success) {
        alert('Test webhook payload dispatched! HMAC SHA-256 signature generated.');
        loadData();
      }
    } catch (err: any) {
      alert(err.message || 'Test dispatch failed');
    }
  };

  const handleDeleteWebhook = async (id: string) => {
    if (!confirm('Are you sure you want to remove this webhook subscription?')) return;
    try {
      await apiClient.delete(`/webhooks/${id}`);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete webhook');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
        [SENTINELX API] LOADING INTEGRATIONS CONTROL TELEMETRY...
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Code2 size={28} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>API & Webhooks Control Center</h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Manage programmatic API credentials, permissions, and HMAC SHA-256 webhook dispatch subscriptions.
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.8)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <button
            className={`btn-secondary ${activeSubTab === 'apikeys' ? 'btn-primary' : ''}`}
            onClick={() => setActiveSubTab('apikeys')}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <Key size={14} /> API Keys ({apiKeys.length})
          </button>
          <button
            className={`btn-secondary ${activeSubTab === 'webhooks' ? 'btn-primary' : ''}`}
            onClick={() => setActiveSubTab('webhooks')}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <WebhookIcon size={14} /> Webhooks ({webhooks.length})
          </button>
        </div>
      </div>

      {/* Content Area */}
      {activeSubTab === 'apikeys' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Active API Credentials</h3>
            <button className="btn-primary" onClick={() => { setGeneratedKey(null); setIsKeyModalOpen(true); }}>
              <Plus size={16} /> Generate New API Key
            </button>
          </div>

          <div className="glass-panel" style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(11, 15, 25, 0.9)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>NAME</th>
                  <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>KEY PREFIX</th>
                  <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SCOPED PERMISSIONS</th>
                  <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>LAST USED</th>
                  <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {apiKeys.map((key) => (
                  <tr key={key.id} style={{ borderBottom: '1px solid rgba(56, 189, 248, 0.08)' }}>
                    <td style={{ padding: '16px 24px', fontWeight: 600 }}>{key.name}</td>
                    <td style={{ padding: '16px 24px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--accent-cyan)' }}>
                      {key.prefix}
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span className="badge badge-purple">{key.permissions}</span>
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleString() : 'Never'}
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleRevokeKey(key.id)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Webhook Subscriptions</h3>
            <button className="btn-primary" onClick={() => setIsWebhookModalOpen(true)}>
              <Plus size={16} /> Add Webhook Endpoint
            </button>
          </div>

          <div className="glass-panel" style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(11, 15, 25, 0.9)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>NAME</th>
                  <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TARGET ENDPOINT URL</th>
                  <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SUBSCRIBED EVENTS</th>
                  <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>STATUS</th>
                  <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {webhooks.map((wh) => (
                  <tr key={wh.id} style={{ borderBottom: '1px solid rgba(56, 189, 248, 0.08)' }}>
                    <td style={{ padding: '16px 24px', fontWeight: 600 }}>{wh.name}</td>
                    <td style={{ padding: '16px 24px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {wh.url}
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {wh.events.map((ev: string) => (
                          <span key={ev} className="badge badge-cyan" style={{ fontSize: '0.68rem' }}>{ev}</span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span className="badge badge-emerald">{wh.status}</span>
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button
                        className="btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                        onClick={() => handleTestDispatch(wh.id)}
                      >
                        <Send size={12} /> Test Ping
                      </button>
                      <button
                        onClick={() => handleDeleteWebhook(wh.id)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer', padding: '6px' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Generate API Key Modal */}
      {isKeyModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="glass-panel" style={{ width: '480px', padding: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px' }}>Generate API Key</h3>

            {generatedKey ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ padding: '14px', borderRadius: '8px', background: 'rgba(0, 230, 118, 0.1)', border: '1px solid rgba(0, 230, 118, 0.3)', color: 'var(--accent-emerald)', fontSize: '0.85rem' }}>
                  <ShieldCheck size={16} style={{ display: 'inline', marginRight: '6px' }} />
                  API Key created! Save this key immediately. It will not be shown again.
                </div>

                <div style={{ position: 'relative' }}>
                  <input type="text" readOnly className="input-field" value={generatedKey} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--accent-cyan)' }} />
                  <button
                    onClick={() => copyToClipboard(generatedKey)}
                    style={{ position: 'absolute', right: '8px', top: '8px', background: 'var(--accent-cyan)', border: 'none', borderRadius: '6px', padding: '6px', cursor: 'pointer', color: '#040814' }}
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>

                <button className="btn-primary" onClick={() => setIsKeyModalOpen(false)} style={{ justifyContent: 'center' }}>
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateKey} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Key Name / Description</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={keyForm.name}
                    onChange={(e) => setKeyForm({ ...keyForm, name: e.target.value })}
                    placeholder="e.g. GitHub Actions CI/CD Secret"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Permission Scopes</label>
                  <select
                    className="input-field"
                    value={keyForm.permissions}
                    onChange={(e) => setKeyForm({ ...keyForm, permissions: e.target.value })}
                  >
                    <option value="read,write">Read & Write (Full Access)</option>
                    <option value="read">Read Only</option>
                    <option value="read,scans">Read & Trigger Scans</option>
                    <option value="remediation">Remediation Approval Only</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                  <button type="button" className="btn-secondary" onClick={() => setIsKeyModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Generate Secret Key
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Create Webhook Modal */}
      {isWebhookModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="glass-panel" style={{ width: '500px', padding: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px' }}>Register Webhook Endpoint</h3>
            <form onSubmit={handleCreateWebhook} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Webhook Name</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={webhookForm.name}
                  onChange={(e) => setWebhookForm({ ...webhookForm, name: e.target.value })}
                  placeholder="e.g. PagerDuty Incident Dispatch"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Target HTTP/HTTPS URL</label>
                <input
                  type="url"
                  required
                  className="input-field"
                  value={webhookForm.url}
                  onChange={(e) => setWebhookForm({ ...webhookForm, url: e.target.value })}
                  placeholder="https://your-server.com/api/sentinelx-webhook"
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsWebhookModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Register Webhook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
