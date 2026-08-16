import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import {
  Server,
  Plus,
  Trash2,
  Globe,
  Terminal,
  Cloud,
  Database,
  Lock,
  Search,
  Filter,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  X,
  FileCheck,
} from 'lucide-react';

export const AssetsPage: React.FC = () => {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);

  // Filters State
  const [filterType, setFilterType] = useState('');
  const [filterEnv, setFilterEnv] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    type: 'WEBSITE',
    target: '',
    environment: 'PRODUCTION',
    criticality: 'HIGH',
    owner: '',
  });

  const loadAssets = async () => {
    try {
      let url = `/assets?search=${encodeURIComponent(searchQuery)}`;
      if (filterType) url += `&type=${filterType}`;
      if (filterEnv) url += `&environment=${filterEnv}`;

      const res: any = await apiClient.get(url);
      if (res.success) setAssets(res.data);
    } catch (err) {
      console.error('Failed to load assets', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, [filterType, filterEnv, searchQuery]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res: any = await apiClient.post('/assets', formData);
      if (res.success) {
        setIsModalOpen(false);
        setFormData({ name: '', type: 'WEBSITE', target: '', environment: 'PRODUCTION', criticality: 'HIGH', owner: '' });
        loadAssets();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to create asset');
    }
  };

  const handleLockBaseline = async (id: string) => {
    try {
      const res: any = await apiClient.post(`/assets/${id}/baseline`);
      if (res.success) {
        alert('KNOWN_GOOD_BASELINE snapshot locked successfully!');
        if (selectedAsset?.id === id) {
          const detailRes: any = await apiClient.get(`/assets/${id}`);
          if (detailRes.success) setSelectedAsset(detailRes.data);
        }
        loadAssets();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to lock baseline');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this asset from SENTINELX monitoring?')) return;
    try {
      await apiClient.delete(`/assets/${id}`);
      if (selectedAsset?.id === id) setSelectedAsset(null);
      loadAssets();
    } catch (err: any) {
      alert(err.message || 'Failed to delete asset');
    }
  };

  const inspectAsset = async (id: string) => {
    try {
      const res: any = await apiClient.get(`/assets/${id}`);
      if (res.success) setSelectedAsset(res.data);
    } catch (err) {
      console.error('Failed to load asset details', err);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'WEBSITE': return <Globe size={16} color="var(--accent-cyan)" />;
      case 'API': return <Terminal size={16} color="var(--accent-purple)" />;
      case 'CLOUD': return <Cloud size={16} color="var(--accent-amber)" />;
      default: return <Database size={16} color="var(--accent-blue)" />;
    }
  };

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Asset Surface Surface Inventory</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Continuous Asset Discovery, Known Good Baselines & Threat Exposure Scoping
          </p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> Register New Asset
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '240px' }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            className="input-field"
            placeholder="Search asset name, target, IP or owner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select
            className="input-field"
            style={{ width: '160px' }}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">All Surface Types</option>
            <option value="WEBSITE">Websites</option>
            <option value="API">APIs</option>
            <option value="SERVER">Servers</option>
            <option value="CLOUD">Cloud Accounts</option>
            <option value="CONTAINER">Containers</option>
          </select>

          <select
            className="input-field"
            style={{ width: '160px' }}
            value={filterEnv}
            onChange={(e) => setFilterEnv(e.target.value)}
          >
            <option value="">All Environments</option>
            <option value="PRODUCTION">Production</option>
            <option value="STAGING">Staging</option>
            <option value="DEVELOPMENT">Development</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Asset List + Inspector Drawer */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedAsset ? '1fr 420px' : '1fr', gap: '24px' }}>
        {/* Asset Table */}
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(11, 15, 25, 0.9)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>NAME</th>
                <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TYPE</th>
                <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TARGET / SCOPE</th>
                <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ENVIRONMENT</th>
                <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>CRITICALITY</th>
                <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SCORE</th>
                <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => (
                <tr
                  key={asset.id}
                  style={{
                    borderBottom: '1px solid rgba(56, 189, 248, 0.08)',
                    background: selectedAsset?.id === asset.id ? 'rgba(0, 242, 254, 0.06)' : 'transparent',
                    cursor: 'pointer',
                  }}
                  onClick={() => inspectAsset(asset.id)}
                >
                  <td style={{ padding: '16px 24px', fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {getIcon(asset.type)}
                      <span>{asset.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span className="badge badge-cyan">{asset.type}</span>
                  </td>
                  <td style={{ padding: '16px 24px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {asset.target}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span className="badge badge-purple">{asset.environment}</span>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span className={asset.criticality === 'CRITICAL' ? 'badge badge-rose' : 'badge badge-amber'}>
                      {asset.criticality}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                    {asset.securityScore}/100
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleDelete(asset.id)}
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

        {/* Inspector Panel Drawer */}
        {selectedAsset && (
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={20} color="var(--accent-cyan)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Asset Inspector</h3>
              </div>
              <button onClick={() => setSelectedAsset(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{selectedAsset.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                {selectedAsset.target}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <span className="badge badge-cyan">{selectedAsset.type}</span>
              <span className="badge badge-purple">{selectedAsset.environment}</span>
              <span className="badge badge-emerald">SCORE: {selectedAsset.securityScore}/100</span>
            </div>

            <div style={{ padding: '14px', borderRadius: '8px', background: 'rgba(11, 15, 25, 0.8)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileCheck size={14} /> KNOWN_GOOD_BASELINE Status
              </div>
              {selectedAsset.baselines && selectedAsset.baselines.length > 0 ? (
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                    Active Baseline Version {selectedAsset.baselines[0].version} (LOCKED)
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '4px', wordBreak: 'break-all' }}>
                    SHA256: {selectedAsset.baselines[0].hash}
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No baseline snapshot locked</div>
              )}

              <button
                className="btn-secondary"
                style={{ width: '100%', justifyContent: 'center', marginTop: '6px', fontSize: '0.8rem' }}
                onClick={() => handleLockBaseline(selectedAsset.id)}
              >
                <Lock size={12} /> Lock New Baseline Snapshot
              </button>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
                TECHNICAL METADATA & CONFIGURATION
              </div>
              <pre style={{ padding: '12px', borderRadius: '8px', background: 'rgba(6, 8, 19, 0.9)', border: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--accent-cyan)', overflowX: 'auto' }}>
                {JSON.stringify(selectedAsset.metadata, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="glass-panel" style={{ width: '480px', padding: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px' }}>Register New Asset</h3>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Asset Name</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Production Web Portal"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Asset Type</label>
                <select
                  className="input-field"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="WEBSITE">Website (HTTP/HTTPS)</option>
                  <option value="API">REST / GraphQL API</option>
                  <option value="SERVER">Linux / Windows Server</option>
                  <option value="CLOUD">Cloud Account (AWS/Azure/GCP)</option>
                  <option value="CONTAINER">Container / Kubernetes</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Target Address / Scope</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={formData.target}
                  onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                  placeholder="e.g. https://app.corp.io or 192.168.1.100"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Environment</label>
                  <select
                    className="input-field"
                    value={formData.environment}
                    onChange={(e) => setFormData({ ...formData, environment: e.target.value })}
                  >
                    <option value="PRODUCTION">Production</option>
                    <option value="STAGING">Staging</option>
                    <option value="DEVELOPMENT">Development</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Criticality</label>
                  <select
                    className="input-field"
                    value={formData.criticality}
                    onChange={(e) => setFormData({ ...formData, criticality: e.target.value })}
                  >
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Owner / Team</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.owner}
                  onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                  placeholder="e.g. DevSecOps Engineering Team"
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
