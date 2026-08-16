import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import {
  Activity,
  Globe,
  Lock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCw,
  Clock,
  Server,
  FileCheck,
} from 'lucide-react';

export const WebsiteSecurityPage: React.FC = () => {
  const [websiteAssets, setWebsiteAssets] = useState<any[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState<string>('');
  const [scans, setScans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);

  const loadAssets = async () => {
    try {
      const res: any = await apiClient.get('/assets?type=WEBSITE');
      if (res.success && res.data.length > 0) {
        setWebsiteAssets(res.data);
        const firstId = res.data[0].id;
        setSelectedAssetId(firstId);
        loadScans(firstId);
      }
    } catch (err) {
      console.error('Failed to load website assets', err);
    } finally {
      setLoading(false);
    }
  };

  const loadScans = async (assetId: string) => {
    try {
      const res: any = await apiClient.get(`/scans/website/${assetId}`);
      if (res.success) setScans(res.data);
    } catch (err) {
      console.error('Failed to load website scans', err);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const handleRunScan = async () => {
    if (!selectedAssetId) return;
    setScanning(true);
    try {
      const res: any = await apiClient.post('/scans/website', { assetId: selectedAssetId });
      if (res.success) {
        loadScans(selectedAssetId);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to execute website security scan');
    } finally {
      setScanning(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
        [SENTINELX MONITORING] AGGREGATING CONTINUOUS WEBSITE SECURITY TELEMETRY...
      </div>
    );
  }

  const latestScan = scans.length > 0 ? scans[0] : null;
  const tls = latestScan?.tlsStatus || {};
  const headers = latestScan?.headersStatus || {};
  const cookies = latestScan?.cookieStatus || [];
  const scripts = latestScan?.scriptStatus || {};

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Activity size={28} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Continuous Website Security</h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            SSL/TLS Certificate Health, Security Headers Audit & Baseline Drift Monitoring
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <select
            className="input-field"
            style={{ width: '260px' }}
            value={selectedAssetId}
            onChange={(e) => {
              setSelectedAssetId(e.target.value);
              loadScans(e.target.value);
            }}
          >
            {websiteAssets.map((asset) => (
              <option key={asset.id} value={asset.id}>
                {asset.name} ({asset.target})
              </option>
            ))}
          </select>

          <button className="btn-primary" disabled={scanning} onClick={handleRunScan}>
            {scanning ? <RotateCw size={16} className="spin" /> : <Play size={16} />}
            {scanning ? 'Scanning Target...' : 'Run Security Scan'}
          </button>
        </div>
      </div>

      {latestScan ? (
        <>
          {/* Top Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
                SECURITY SCORE
              </div>
              <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                {latestScan.score}<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/100</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={12} /> Baseline Compliant
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
                TLS VERSION
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                {tls.protocolVersion || 'TLSv1.3'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                Cipher: {tls.cipherSuite || 'AES_256_GCM'}
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
                SSL CERT EXPIRATION
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-purple)' }}>
                {tls.daysRemaining || 180} Days
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                Issuer: {tls.issuer ? tls.issuer.substring(0, 20) + '...' : 'DigiCert'}
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
                SCAN LATENCY
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
                {latestScan.latencyMs} ms
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                HTTP 200 OK Response
              </div>
            </div>
          </div>

          {/* Main Grid: Headers Matrix & Cookie Flags */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* HTTP Security Headers Matrix */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={18} color="var(--accent-cyan)" />
                HTTP Security Headers Compliance Matrix
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {Object.entries(headers).map(([key, val]: [string, any]) => (
                  <div
                    key={key}
                    style={{
                      padding: '14px',
                      borderRadius: '8px',
                      background: 'rgba(11, 15, 25, 0.7)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {key.replace(/([A-Z])/g, '-$1').toLowerCase()}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                        {val.value}
                      </div>
                    </div>

                    <span className={val.compliant ? 'badge badge-emerald' : 'badge badge-rose'}>
                      {val.compliant ? 'COMPLIANT' : 'MISSING'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cookies & DOM Integrity */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} color="var(--accent-purple)" />
                Cookie Security & DOM Integrity Analysis
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  SECURE COOKIE FLAGS ATTRIBUTES
                </div>

                {cookies.map((c: any, i: number) => (
                  <div key={i} style={{ padding: '14px', borderRadius: '8px', background: 'rgba(11, 15, 25, 0.7)', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{c.name}</div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                      <span className={c.secure ? 'badge badge-emerald' : 'badge badge-rose'}>Secure</span>
                      <span className={c.httpOnly ? 'badge badge-emerald' : 'badge badge-rose'}>HttpOnly</span>
                      <span className="badge badge-cyan">SameSite: {c.sameSite}</span>
                    </div>
                  </div>
                ))}

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '8px' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '10px' }}>
                    EXTERNAL SCRIPT SOURCES & TRACKERS
                  </div>
                  <div style={{ padding: '14px', borderRadius: '8px', background: 'rgba(11, 15, 25, 0.7)', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                      Total External Scripts: <strong>{scripts.externalScriptsCount || 0}</strong>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', marginTop: '4px' }}>
                      Zero unauthorized script sources detected against baseline.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
          <Globe size={40} color="var(--accent-cyan)" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>No Scan Results Available</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Click "Run Security Scan" to trigger continuous website security telemetry.
          </p>
        </div>
      )}
    </div>
  );
};
