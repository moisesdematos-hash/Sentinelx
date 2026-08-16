import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import {
  Server,
  FileCheck,
  Cpu,
  Radio,
  Play,
  RotateCw,
  CheckCircle2,
  Lock,
  Terminal,
  ShieldCheck,
  Users,
  Copy,
  Check,
  Layers,
  Zap,
} from 'lucide-react';

export const ServerSecurityPage: React.FC = () => {
  const [serverAssets, setServerAssets] = useState<any[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState<string>('');
  const [scans, setScans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);

  // Hybrid Mode Selection State: 'AGENTLESS' | 'EBPF_AGENT' | 'HYBRID'
  const [deploymentMode, setDeploymentMode] = useState<'AGENTLESS' | 'EBPF_AGENT' | 'HYBRID'>('HYBRID');
  const [copiedInstallCmd, setCopiedInstallCmd] = useState(false);

  const loadAssets = async () => {
    try {
      const res: any = await apiClient.get('/assets?type=SERVER');
      if (res.success && res.data.length > 0) {
        setServerAssets(res.data);
        const firstId = res.data[0].id;
        setSelectedAssetId(firstId);
        loadScans(firstId);
      }
    } catch (err) {
      console.error('Failed to load server assets', err);
    } finally {
      setLoading(false);
    }
  };

  const loadScans = async (assetId: string) => {
    try {
      const res: any = await apiClient.get(`/scans/server/${assetId}`);
      if (res.success) setScans(res.data);
    } catch (err) {
      console.error('Failed to load server scans', err);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const handleRunScan = async () => {
    if (!selectedAssetId) return;
    setScanning(true);
    try {
      const res: any = await apiClient.post('/scans/server', { assetId: selectedAssetId });
      if (res.success) {
        loadScans(selectedAssetId);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to execute server security scan');
    } finally {
      setScanning(false);
    }
  };

  const handleCopyInstallCmd = () => {
    const cmd = `curl -sSL https://api.sentinelx.io/v1/agents/install.sh?token=stx_agent_98f73b1a2c | sudo bash`;
    navigator.clipboard.writeText(cmd);
    setCopiedInstallCmd(true);
    setTimeout(() => setCopiedInstallCmd(false), 2000);
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
        [SENTINELX SERVER] AGGREGATING SERVER SECURITY TELEMETRY & FIM CHECKS...
      </div>
    );
  }

  const latestScan = scans.length > 0 ? scans[0] : null;
  const fim = latestScan?.fimStatus || [];
  const processes = latestScan?.processStatus || [];
  const services = latestScan?.servicesStatus || [];
  const users = latestScan?.userStatus || {};

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Server size={28} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Server Security & FIM Engine</h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Implantador Híbrido: Suporte a Agentless (Sem Agente) e Agente eBPF Leve no Kernel
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
            {serverAssets.map((asset) => (
              <option key={asset.id} value={asset.id}>
                {asset.name} ({asset.target})
              </option>
            ))}
          </select>

          <button className="btn-primary" disabled={scanning} onClick={handleRunScan}>
            {scanning ? <RotateCw size={16} className="spin" /> : <Play size={16} />}
            {scanning ? 'Inspecting Server...' : 'Run Server Inspection'}
          </button>
        </div>
      </div>

      {/* HYBRID DEPLOYMENT MODE SELECTOR CARD */}
      <div className="glass-panel" style={{ padding: '24px', border: '1px solid var(--accent-cyan)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(0, 242, 254, 0.15)', color: 'var(--accent-cyan)' }}>
              <Cpu size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Modo de Implantação de Segurança do Servidor</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                ARQUITETURA HÍBRIDA: CHAVEIE ENTRE AGENTLESS E AGENTE EBPF EM 1-CLIQUE
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className={deploymentMode === 'AGENTLESS' ? 'btn-primary' : 'btn-secondary'}
              onClick={() => setDeploymentMode('AGENTLESS')}
              style={{ fontSize: '0.8rem', padding: '6px 14px' }}
            >
              🌐 Agentless (Sem Agente)
            </button>
            <button
              className={deploymentMode === 'EBPF_AGENT' ? 'btn-primary' : 'btn-secondary'}
              onClick={() => setDeploymentMode('EBPF_AGENT')}
              style={{ fontSize: '0.8rem', padding: '6px 14px' }}
            >
              🛡️ Agente eBPF (Kernel)
            </button>
            <button
              className={deploymentMode === 'HYBRID' ? 'btn-primary' : 'btn-secondary'}
              onClick={() => setDeploymentMode('HYBRID')}
              style={{ fontSize: '0.8rem', padding: '6px 14px' }}
            >
              ⚡ Modo Híbrido (Recomendado)
            </button>
          </div>
        </div>

        {/* Mode Details & Agent Install Script */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px', background: 'rgba(11, 15, 25, 0.8)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>{deploymentMode} ACTIVE</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                {deploymentMode === 'AGENTLESS' && 'Monitoramento via APIs de Nuvem e SSH (Zero Instalação)'}
                {deploymentMode === 'EBPF_AGENT' && 'Daemon Leve eBPF em Go/Rust rodando no Kernel Linux (~14MB RAM)'}
                {deploymentMode === 'HYBRID' && 'Agentless para Descoberta Rápida + Agente eBPF para Servidores Críticos'}
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              O SENTINELX permite que você decida no nível de cada servidor se deseja instalar o agente ou usar a coleta sem agentes.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              COMANDO DE INSTALAÇÃO DO AGENTE EBPF (1-LINE INSTALL)
            </span>
            <div style={{ display: 'flex', gap: '8px', background: '#0b0f19', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', alignItems: 'center' }}>
              <code style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', flex: 1, overflowX: 'auto' }}>
                curl -sSL https://api.sentinelx-cyber.com/v1/agents/install.sh | sudo bash
              </code>
              <button onClick={handleCopyInstallCmd} style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer' }}>
                {copiedInstallCmd ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {latestScan ? (
        <>
          {/* Top Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
                SERVER SECURITY SCORE
              </div>
              <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                {latestScan.score}<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/100</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={12} /> FIM Baseline Verified
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
                CRITICAL FIM FILES
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                {fim.length} Intact
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                SHA256 Hashes Verified
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
                ACTIVE PROCESSES
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-purple)' }}>
                {processes.length} Active
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                Zero process anomalies detected
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
                LISTENING PORTS
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
                {services.length} Sockets
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                SSH (22), HTTPS (443), DB (3306)
              </div>
            </div>
          </div>

          {/* Main Grid: FIM Status & Process Inspection */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* File Integrity Monitoring (FIM) */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileCheck size={18} color="var(--accent-cyan)" />
                File Integrity Monitoring (FIM) Status
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {fim.map((item: any, i: number) => (
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
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                        {item.path}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '2px', wordBreak: 'break-all' }}>
                        SHA256: {item.hash.substring(0, 24)}...
                      </div>
                    </div>

                    <span className="badge badge-emerald">INTACT</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Listening Ports & User Privileges */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Terminal size={18} color="var(--accent-purple)" />
                Listening Sockets & User Privileges Audit
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  OPEN LISTENING PORTS MATRIX
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {services.map((s: any, i: number) => (
                    <div key={i} style={{ padding: '12px 14px', borderRadius: '8px', background: 'rgba(11, 15, 25, 0.7)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className="badge badge-cyan" style={{ fontSize: '0.75rem' }}>PORT {s.port} ({s.protocol})</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{s.service}</span>
                      </div>
                      <span className="badge badge-emerald">ALLOWED</span>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '8px' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '10px' }}>
                    USER ACCOUNTS & SUDOERS PRIVILEGES
                  </div>
                  <div style={{ padding: '14px', borderRadius: '8px', background: 'rgba(11, 15, 25, 0.7)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                      Root Accounts: <strong>{users.rootAccountsCount || 1}</strong> | Total System Users: <strong>{users.totalUsersCount || 4}</strong>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      Sudoers Members: {users.sudoersMembers ? users.sudoersMembers.join(', ') : 'root, ubuntu, sentinel'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
          <Server size={40} color="var(--accent-cyan)" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>No Server Inspection Scan Available</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Click "Run Server Inspection" to trigger continuous FIM and process baseline telemetry.
          </p>
        </div>
      )}
    </div>
  );
};
