import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import {
  Radio,
  ShieldAlert,
  Zap,
  RotateCw,
  Sparkles,
  Server,
  Activity,
  AlertTriangle,
  Lock,
  Cpu,
  Globe,
  X,
  FileCode,
} from 'lucide-react';

export const EdgeSecurityPage: React.FC = () => {
  const [nodes, setNodes] = useState<any[]>([]);
  const [iotScans, setIotScans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [mitigatingId, setMitigatingId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [nodeRes, iotRes]: any = await Promise.all([
        apiClient.get('/edge-security/nodes'),
        apiClient.get('/edge-security/iot-scans'),
      ]);

      if (nodeRes.success) setNodes(nodeRes.data);
      if (iotRes.success) setIotScans(iotRes.data);
    } catch (err) {
      console.error('Failed to load edge security data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleScan = async () => {
    setScanning(true);
    try {
      const res: any = await apiClient.post('/edge-security/scan', {});
      if (res.success) loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to scan edge compute & IoT nodes');
    } finally {
      setScanning(false);
    }
  };

  const handleMitigate = async (nodeId: string) => {
    setMitigatingId(nodeId);
    try {
      const res: any = await apiClient.post(`/edge-security/nodes/${nodeId}/ddos-mitigate`, {});
      if (res.success) loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to trigger DDoS WAF mitigation');
    } finally {
      setMitigatingId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
        [SENTINELX EDGE & IOT ENGINE] ANALYZING EDGE WORKERS, MQTT BROKERS & CDN TELEMETRY...
      </div>
    );
  }

  const attackNodesCount = nodes.filter((n) => n.status === 'DDOS_ATTACK_DETECTED').length;
  const totalRps = nodes.reduce((acc, n) => acc + n.trafficRps, 0);

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Radio size={28} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Edge & IoT Security Engine</h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Cloudflare Workers, CDN Edge Security, IoT Gateway Firmware & MQTT Protocol Auditor
          </p>
        </div>

        <button className="btn-primary" disabled={scanning} onClick={handleScan}>
          {scanning ? <RotateCw size={16} className="spin" /> : <Sparkles size={16} />}
          Audit Edge & IoT Firmware
        </button>
      </div>

      {/* Metric Cards Tally */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            TRACKED EDGE NODES
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
            {nodes.length} NODES
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Cloudflare, CloudFront & Gateways
          </div>
        </div>

        <div className="glass-panel glass-panel-danger" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-rose)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            DDOS ATTACK ANOMALIES
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-rose)' }}>
            {attackNodesCount} ATTACKS
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Edge traffic rate spikes
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-purple)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            TOTAL EDGE TRAFFIC
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-purple)' }}>
            {totalRps.toLocaleString()} RPS
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Requests per second
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            IOT DEVICES AUDITED
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
            {iotScans.length} DEVICES
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            MQTT & CoAP protocol checks
          </div>
        </div>
      </div>

      {/* Registered Edge Compute Nodes Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Globe size={18} color="var(--accent-cyan)" /> Registered Edge Compute & CDN Gateway Nodes
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(11, 15, 25, 0.9)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>NODE NAME</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>NODE TYPE</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>LOCATION / REGION</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TRAFFIC RATE</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>STATUS</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {nodes.map((node) => (
              <tr key={node.id} style={{ borderBottom: '1px solid rgba(56, 189, 248, 0.08)' }}>
                <td style={{ padding: '16px 24px', fontSize: '0.9rem', fontWeight: 700 }}>
                  {node.name}
                </td>

                <td style={{ padding: '16px 24px' }}>
                  <span className="badge badge-purple">{node.nodeType}</span>
                </td>

                <td style={{ padding: '16px 24px', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                  {node.locationRegion}
                </td>

                <td style={{ padding: '16px 24px', fontSize: '0.9rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                  {node.trafficRps.toLocaleString()} RPS
                </td>

                <td style={{ padding: '16px 24px' }}>
                  <span className={node.status === 'DDOS_ATTACK_DETECTED' ? 'badge badge-rose' : node.status === 'MITIGATED' ? 'badge badge-emerald' : 'badge badge-cyan'}>
                    {node.status}
                  </span>
                </td>

                <td style={{ padding: '16px 24px' }}>
                  {node.status === 'DDOS_ATTACK_DETECTED' && (
                    <button
                      className="btn-primary"
                      style={{ fontSize: '0.75rem', padding: '6px 10px' }}
                      disabled={mitigatingId === node.id}
                      onClick={() => handleMitigate(node.id)}
                    >
                      {mitigatingId === node.id ? <RotateCw size={12} className="spin" /> : <Zap size={12} />}
                      Enforce WAF DDoS Rule
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* IoT Devices & MQTT Protocol Audit Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={18} color="var(--accent-purple)" /> IoT Firmware & MQTT / CoAP Protocol Audit Matrix
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(11, 15, 25, 0.9)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>DEVICE NAME</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>PROTOCOL</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>FIRMWARE VERSION</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SECURITY AUDIT SUMMARY</th>
            </tr>
          </thead>
          <tbody>
            {iotScans.map((iot) => (
              <tr key={iot.id} style={{ borderBottom: '1px solid rgba(56, 189, 248, 0.08)' }}>
                <td style={{ padding: '16px 24px', fontSize: '0.88rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  {iot.deviceName}
                </td>

                <td style={{ padding: '16px 24px' }}>
                  <span className="badge badge-purple">{iot.protocol}</span>
                </td>

                <td style={{ padding: '16px 24px', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
                  {iot.firmwareVersion}
                </td>

                <td style={{ padding: '16px 24px', fontSize: '0.8rem', color: iot.hasUnencryptedPort ? 'var(--accent-rose)' : 'var(--text-muted)' }}>
                  {iot.vulnerabilitySummary}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
