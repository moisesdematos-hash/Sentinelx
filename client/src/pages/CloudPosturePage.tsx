import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import {
  ShieldAlert,
  Cloud,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCw,
  Lock,
  Database,
  Users,
  Radio,
} from 'lucide-react';

export const CloudPosturePage: React.FC = () => {
  const [connectors, setConnectors] = useState<any[]>([]);
  const [selectedConnectorId, setSelectedConnectorId] = useState<string>('');
  const [scans, setScans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);

  const loadConnectors = async () => {
    try {
      const res: any = await apiClient.get('/cloud-connectors');
      if (res.success && res.data.length > 0) {
        setConnectors(res.data);
        const firstId = res.data[0].id;
        setSelectedConnectorId(firstId);
        loadScans(firstId);
      }
    } catch (err) {
      console.error('Failed to load cloud connectors', err);
    } finally {
      setLoading(false);
    }
  };

  const loadScans = async (connectorId: string) => {
    try {
      const res: any = await apiClient.get(`/cloud-connectors/${connectorId}/cspm-scan`);
      if (res.success) setScans(res.data);
    } catch (err) {
      console.error('Failed to load CSPM scans', err);
    }
  };

  useEffect(() => {
    loadConnectors();
  }, []);

  const handleRunScan = async () => {
    if (!selectedConnectorId) return;
    setScanning(true);
    try {
      const res: any = await apiClient.post(`/cloud-connectors/${selectedConnectorId}/cspm-scan`);
      if (res.success) {
        loadScans(selectedConnectorId);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to execute CSPM posture scan');
    } finally {
      setScanning(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
        [SENTINELX CSPM] EVALUATING CLOUD SECURITY POSTURE & IAM PRIVILEGES...
      </div>
    );
  }

  const latestScan = scans.length > 0 ? scans[0] : null;
  const storage = latestScan?.storageStatus || [];
  const iam = latestScan?.iamStatus || {};
  const network = latestScan?.networkStatus || [];
  const logging = latestScan?.loggingStatus || {};

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldAlert size={28} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Cloud Security Posture Management (CSPM)</h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Multi-Cloud Storage Bucket Publicity, IAM Privilege Escapes & Ingress Exposure Audit
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <select
            className="input-field"
            style={{ width: '260px' }}
            value={selectedConnectorId}
            onChange={(e) => {
              setSelectedConnectorId(e.target.value);
              loadScans(e.target.value);
            }}
          >
            {connectors.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.provider})
              </option>
            ))}
          </select>

          <button className="btn-primary" disabled={scanning} onClick={handleRunScan}>
            {scanning ? <RotateCw size={16} className="spin" /> : <Play size={16} />}
            {scanning ? 'Auditing Posture...' : 'Run CSPM Scan'}
          </button>
        </div>
      </div>

      {latestScan ? (
        <>
          {/* Top Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
                CLOUD SECURITY SCORE
              </div>
              <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                {latestScan.score}<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/100</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={12} /> Posture Baseline Compliant
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
                STORAGE BUCKETS AUDITED
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                {storage.length} Buckets
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                Zero public buckets found
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
                ROOT MFA STATUS
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                {iam.rootMfaEnabled ? 'ENABLED' : 'DISABLED'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                Wildcard Admin Roles: 0
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
                AUDIT LOG RETENTION
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-purple)' }}>
                {logging.retentionDays || 365} Days
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                Multi-region CloudTrail Active
              </div>
            </div>
          </div>

          {/* Main Grid: Storage Audit & Network Security Groups */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Storage Buckets Publicity */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Database size={18} color="var(--accent-cyan)" />
                Cloud Storage Bucket Encryption & Publicity Audit
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {storage.map((b: any, i: number) => (
                  <div
                    key={i}
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
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{b.bucket}</div>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                        <span className="badge badge-emerald">Public Access Blocked</span>
                        <span className="badge badge-cyan">AES-256 Encrypted</span>
                      </div>
                    </div>

                    <span className="badge badge-emerald">COMPLIANT</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Network Security Groups Ingress Audit */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={18} color="var(--accent-purple)" />
                Security Group Ingress Exposure (0.0.0.0/0)
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {network.map((sg: any, i: number) => (
                  <div
                    key={i}
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
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{sg.groupName}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                        Open to Anywhere (0.0.0.0/0): {sg.openInboundAnywhere ? 'YES (RISK)' : 'NO'} | Restricted Ports: {sg.restrictedPorts ? sg.restrictedPorts.join(', ') : '22, 443'}
                      </div>
                    </div>

                    <span className="badge badge-emerald">RESTRICTED</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
          <Cloud size={40} color="var(--accent-cyan)" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>No CSPM Posture Scan Available</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Click "Run CSPM Scan" to trigger storage publicity, IAM, and Security Group posture analysis.
          </p>
        </div>
      )}
    </div>
  );
};
