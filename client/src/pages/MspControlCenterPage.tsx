import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import {
  Building2,
  ShieldAlert,
  Server,
  TrendingUp,
  Plus,
  ArrowUpRight,
  Sparkles,
  Check,
} from 'lucide-react';

export const MspControlCenterPage: React.FC = () => {
  const [mspData, setMspData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isBrandingModalOpen, setIsBrandingModalOpen] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientDomain, setNewClientDomain] = useState('');
  const [brandingForm, setBrandingForm] = useState({
    brandName: '',
    logoUrl: '',
    primaryColor: '#00f2fe',
    supportEmail: '',
  });

  const loadMspData = async () => {
    try {
      const res: any = await apiClient.get('/msp/summary');
      if (res.success) {
        setMspData(res.data);
        if (res.data.branding) {
          setBrandingForm({
            brandName: res.data.branding.brandName || '',
            logoUrl: res.data.branding.logoUrl || '',
            primaryColor: res.data.branding.primaryColor || '#00f2fe',
            supportEmail: res.data.branding.supportEmail || '',
          });
        }
      }
    } catch (err) {
      console.error('Failed to load MSP data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMspData();
  }, []);

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res: any = await apiClient.post('/msp/clients', {
        name: newClientName,
        domain: newClientDomain,
      });
      if (res.success) {
        setIsClientModalOpen(false);
        setNewClientName('');
        setNewClientDomain('');
        loadMspData();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to onboard client organization');
    }
  };

  const handleSaveBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res: any = await apiClient.post('/msp/branding', brandingForm);
      if (res.success) {
        setIsBrandingModalOpen(false);
        loadMspData();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update white-label branding');
    }
  };

  const switchClientContext = (orgId: string, orgName: string) => {
    localStorage.setItem('sentinelx_org_id', orgId);
    alert(`Switched active context to client: ${orgName}`);
    window.location.reload();
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
        [SENTINELX MSP] AGGREGATING PORTFOLIO SECURITY TELEMETRY...
      </div>
    );
  }

  const metrics = mspData?.portfolioMetrics || {};
  const clients = mspData?.clientRiskRanking || [];

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Building2 size={28} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Partner Control Center</h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            MSSP Portfolio Management, Client Risk Ranking & White-Label Security Operations
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-secondary" onClick={() => setIsBrandingModalOpen(true)}>
            <Sparkles size={16} /> White-Label Settings
          </button>
          <button className="btn-primary" onClick={() => setIsClientModalOpen(true)}>
            <Plus size={16} /> Onboard New Client
          </button>
        </div>
      </div>

      {/* Portfolio Overview Metric Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            MANAGED CLIENTS
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
            {metrics.totalClients || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Active organization accounts
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            PORTFOLIO AVG SCORE
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
            {metrics.averageSecurityScore || 100}
            <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/100</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={12} /> Optimal Defense Posture
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            TOTAL PROTECTED ASSETS
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-purple)' }}>
            {metrics.totalAssets || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Across all client environments
          </div>
        </div>

        <div className="glass-panel glass-panel-danger" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-rose)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            HIGH RISK CLIENTS
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-rose)' }}>
            {metrics.highRiskClientsCount || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Score below 80 threshold
          </div>
        </div>
      </div>

      {/* Client Risk Ranking Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={18} color="var(--accent-cyan)" />
            Client Portfolio Risk Ranking
          </h3>
          <span className="badge badge-cyan">Sorted by Risk Score</span>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(11, 15, 25, 0.9)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>CLIENT ORGANIZATION</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>PRIMARY DOMAIN</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>PROTECTED ASSETS</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>RISK LEVEL</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SECURITY SCORE</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textAlign: 'right' }}>DRILL DOWN</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client: any) => (
              <tr key={client.id} style={{ borderBottom: '1px solid rgba(56, 189, 248, 0.08)' }}>
                <td style={{ padding: '16px 24px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {client.name}
                </td>
                <td style={{ padding: '16px 24px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {client.domain || 'N/A'}
                </td>
                <td style={{ padding: '16px 24px', fontWeight: 600 }}>
                  {client.assetCount} assets
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <span className={client.riskLevel === 'HIGH' ? 'badge badge-rose' : client.riskLevel === 'MEDIUM' ? 'badge badge-amber' : 'badge badge-emerald'}>
                    {client.riskLevel} RISK
                  </span>
                </td>
                <td style={{ padding: '16px 24px', fontWeight: 800, color: client.securityScore >= 90 ? 'var(--accent-emerald)' : client.securityScore >= 75 ? 'var(--accent-amber)' : 'var(--accent-rose)' }}>
                  {client.securityScore}/100
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                  <button
                    className="btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                    onClick={() => switchClientContext(client.id, client.name)}
                  >
                    Switch Context <ArrowUpRight size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Onboard Client Modal */}
      {isClientModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="glass-panel" style={{ width: '460px', padding: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px' }}>Onboard Client Organization</h3>
            <form onSubmit={handleCreateClient} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Organization Name</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="e.g. Acme FinTech Corp"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Primary Domain</label>
                <input
                  type="text"
                  className="input-field"
                  value={newClientDomain}
                  onChange={(e) => setNewClientDomain(e.target.value)}
                  placeholder="e.g. acmefintech.com"
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsClientModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Onboard Organization
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* White-Label Settings Modal */}
      {isBrandingModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="glass-panel" style={{ width: '500px', padding: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px' }}>White-Label Customization</h3>
            <form onSubmit={handleSaveBranding} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Brand Name</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={brandingForm.brandName}
                  onChange={(e) => setBrandingForm({ ...brandingForm, brandName: e.target.value })}
                  placeholder="e.g. CyberDefense SOC Enterprise"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Logo Image URL</label>
                <input
                  type="text"
                  className="input-field"
                  value={brandingForm.logoUrl}
                  onChange={(e) => setBrandingForm({ ...brandingForm, logoUrl: e.target.value })}
                  placeholder="https://cdn.yourdomain.com/logo.png"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Primary Accent Color</label>
                <input
                  type="color"
                  className="input-field"
                  style={{ height: '42px', padding: '4px', cursor: 'pointer' }}
                  value={brandingForm.primaryColor}
                  onChange={(e) => setBrandingForm({ ...brandingForm, primaryColor: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Support Email</label>
                <input
                  type="email"
                  className="input-field"
                  value={brandingForm.supportEmail}
                  onChange={(e) => setBrandingForm({ ...brandingForm, supportEmail: e.target.value })}
                  placeholder="soc-support@yourdomain.com"
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsBrandingModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save White-Label Branding
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
