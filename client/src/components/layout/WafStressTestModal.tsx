import React, { useState, useEffect } from 'react';
import {
  Zap,
  ShieldCheck,
  ShieldAlert,
  Flame,
  Activity,
  X,
  Play,
  Square,
  CheckCircle2,
  AlertTriangle,
  Server,
  Cpu,
  BarChart3,
  Globe,
  RefreshCw,
  Download,
  Lock
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface WafStressTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AttackType = 'HTTP_FLOOD' | 'SLOWLORIS' | 'OWASP_INJECTION' | 'BOTNET_SCRAPE' | 'EBPF_SYN_FLOOD';

interface AttackResult {
  totalRequests: number;
  blockedByEbpf: number;
  blockedByWafRateLimit: number;
  allowedRequests: number;
  avgLatencyMs: number;
  peakRps: number;
  mitigatedIpSubnets: string[];
  resilienceScore: number;
}

export const WafStressTestModal: React.FC<WafStressTestModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const isPt = language === 'pt';

  const [targetEndpoint, setTargetEndpoint] = useState('/api/v1/auth/login');
  const [attackType, setAttackType] = useState<AttackType>('HTTP_FLOOD');
  const [botCount, setBotCount] = useState<number>(5000);
  const [targetRps, setTargetRps] = useState<number>(25000);
  
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentRps, setCurrentRps] = useState(0);
  const [liveLogs, setLiveLogs] = useState<string[]>([]);
  const [result, setResult] = useState<AttackResult | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsRunning(false);
            finishSimulation();
            return 100;
          }
          const next = prev + 5;
          const simulatedRps = Math.round(targetRps * (0.8 + Math.random() * 0.4));
          setCurrentRps(simulatedRps);

          // Add simulated logs
          const logMessages = [
            `[eBPF Kernel] Filtered ${Math.round(simulatedRps * 0.72)} packets via XDP program in 0.04ms`,
            `[WAF Engine] Rate-limit triggered for IP subnet 185.220.101.0/24 (429 Too Many Requests)`,
            `[Botnet Shield] Challenge-JS issued to suspect user-agents (100% dropped)`,
            `[Sentinel AI] Auto-deploying eBPF hotpatch for payload inspection on ${targetEndpoint}`,
            `[Health Check] Target server latency maintained at 3.2ms, CPU load stable at 14%`
          ];
          const randomLog = logMessages[Math.floor(Math.random() * logMessages.length)];
          setLiveLogs((l) => [randomLog, ...l.slice(0, 15)]);

          return next;
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isRunning, targetRps, targetEndpoint]);

  const startSimulation = () => {
    setIsRunning(true);
    setProgress(0);
    setLiveLogs([`[RED TEAM] Initiating simulated ${attackType} vector with ${botCount} virtual bots...`]);
    setResult(null);
  };

  const stopSimulation = () => {
    setIsRunning(false);
    finishSimulation();
  };

  const finishSimulation = () => {
    const total = Math.round(targetRps * 15 * (botCount / 2000));
    const ebpfBlocked = Math.round(total * 0.78);
    const wafBlocked = Math.round(total * 0.215);
    const allowed = total - ebpfBlocked - wafBlocked;
    
    setResult({
      totalRequests: total,
      blockedByEbpf: ebpfBlocked,
      blockedByWafRateLimit: wafBlocked,
      allowedRequests: allowed,
      avgLatencyMs: 3.4,
      peakRps: Math.round(targetRps * 1.15),
      mitigatedIpSubnets: ['185.220.101.0/24', '45.142.120.0/22', '194.26.29.0/24', '91.240.118.0/24'],
      resilienceScore: 99.8
    });
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(5, 7, 15, 0.85)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '900px',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: '16px',
          border: '1px solid rgba(255, 8, 68, 0.3)',
          boxShadow: '0 0 40px rgba(255, 8, 68, 0.25)',
          background: 'linear-gradient(145deg, rgba(13, 16, 28, 0.95), rgba(8, 10, 18, 0.98))',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255, 8, 68, 0.08)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #ff0844 0%, #ff4e50 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 15px rgba(255, 8, 68, 0.5)'
              }}
            >
              <Flame size={24} color="#fff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0, letterSpacing: '0.5px' }}>
                  {isPt ? 'Simulador de Stress WAF & Rate Limit (Red Team)' : 'WAF & Rate Limiting Load Simulator (Red Team)'}
                </h3>
                <span className="badge badge-rose" style={{ fontSize: '0.7rem' }}>
                  eBPF KERNEL ACTIVE
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                {isPt
                  ? 'Teste a capacidade de contenção a ataques DDoS Layer 7, Starvation e Exploits OWASP em tempo real.'
                  : 'Test real-time resilience against Layer 7 DDoS, connection starvation, and OWASP exploits.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Controls Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '18px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            {/* Target Endpoint */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                {isPt ? 'Endpoint Alvo Protegido' : 'Protected Target Endpoint'}
              </label>
              <select
                value={targetEndpoint}
                onChange={(e) => setTargetEndpoint(e.target.value)}
                disabled={isRunning}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#fff',
                  fontSize: '0.85rem'
                }}
              >
                <option value="/api/v1/auth/login">/api/v1/auth/login (Autenticação Crítica)</option>
                <option value="/api/v1/payments/checkout">/api/v1/payments/checkout (Checkout & Cartão)</option>
                <option value="/api/v1/search/query">/api/v1/search/query (Consulta Pesada)</option>
                <option value="/api/v1/users/export">/api/v1/users/export (Download de Dados)</option>
              </select>
            </div>

            {/* Attack Type */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                {isPt ? 'Vetor de Ataque' : 'Attack Vector'}
              </label>
              <select
                value={attackType}
                onChange={(e) => setAttackType(e.target.value as AttackType)}
                disabled={isRunning}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#fff',
                  fontSize: '0.85rem'
                }}
              >
                <option value="HTTP_FLOOD">HTTP Flood (Layer 7 Burst)</option>
                <option value="SLOWLORIS">Slowloris (Starvation de Conexões)</option>
                <option value="OWASP_INJECTION">OWASP Injection Blast (SQLi/XSS/RCE)</option>
                <option value="BOTNET_SCRAPE">Botnet Scraping Distribuída</option>
                <option value="EBPF_SYN_FLOOD">SYN Flood eBPF Kernel Direct</option>
              </select>
            </div>

            {/* Target RPS */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                {isPt ? `Carga Desejada: ${targetRps.toLocaleString()} RPS` : `Target Load: ${targetRps.toLocaleString()} RPS`}
              </label>
              <input
                type="range"
                min={1000}
                max={100000}
                step={5000}
                value={targetRps}
                onChange={(e) => setTargetRps(Number(e.target.value))}
                disabled={isRunning}
                style={{ width: '100%', accentColor: 'var(--accent-rose)' }}
              />
            </div>

            {/* Botnet Count */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                {isPt ? `Bots Simulados: ${botCount.toLocaleString()} IP's` : `Simulated Bots: ${botCount.toLocaleString()} IPs`}
              </label>
              <input
                type="range"
                min={500}
                max={50000}
                step={2500}
                value={botCount}
                onChange={(e) => setBotCount(Number(e.target.value))}
                disabled={isRunning}
                style={{ width: '100%', accentColor: 'var(--accent-rose)' }}
              />
            </div>
          </div>

          {/* Execution & Live Monitor */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={isRunning ? stopSimulation : startSimulation}
                className="btn-primary"
                style={{
                  background: isRunning ? 'var(--accent-rose)' : 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
                  padding: '12px 24px',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {isRunning ? <Square size={18} /> : <Play size={18} />}
                {isRunning
                  ? (isPt ? 'Interromper Simulação' : 'Stop Stress Test')
                  : (isPt ? 'Iniciar Teste de Carga WAF' : 'Start WAF Stress Test')}
              </button>

              {isRunning && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                    RPS Atual: {currentRps.toLocaleString()} req/s
                  </div>
                  <div style={{ width: '150px', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${progress}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-rose))',
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Live Console Output */}
            <div
              style={{
                background: '#090b14',
                borderRadius: '10px',
                padding: '14px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontFamily: 'monospace',
                fontSize: '0.78rem',
                minHeight: '130px',
                maxHeight: '160px',
                overflowY: 'auto',
                color: '#a0aec0'
              }}
            >
              {liveLogs.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  {isPt
                    ? 'Aguardando início do teste. Clique em "Iniciar Teste de Carga WAF" para simular o ataque.'
                    : 'Ready. Click "Start WAF Stress Test" to launch simulated attack.'}
                </div>
              ) : (
                liveLogs.map((log, idx) => (
                  <div key={idx} style={{ marginBottom: '4px', color: log.includes('eBPF') ? '#00f2fe' : log.includes('WAF') ? '#ff4e50' : '#48bb78' }}>
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Results Summary Box */}
          {result && (
            <div
              style={{
                background: 'rgba(0, 242, 254, 0.05)',
                border: '1px solid rgba(0, 242, 254, 0.3)',
                borderRadius: '14px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ShieldCheck size={26} color="#00f2fe" />
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>
                      {isPt ? 'Resultado da Contenção e BPF Kernel' : 'WAF & eBPF Containment Result'}
                    </h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {isPt ? 'Servidor mantido 100% online sem degradação' : 'Target server retained 100% uptime with zero latency drift'}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    background: 'rgba(0, 242, 254, 0.15)',
                    border: '1px solid #00f2fe',
                    color: '#00f2fe',
                    fontWeight: 900,
                    fontSize: '1.1rem'
                  }}
                >
                  Score: {result.resilienceScore}%
                </div>
              </div>

              {/* Stats Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
                <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{isPt ? 'Requisições Totais' : 'Total Requests'}</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{result.totalRequests.toLocaleString()}</div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(0,242,254,0.2)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#00f2fe' }}>{isPt ? 'Bloqueado por eBPF (0.01ms)' : 'eBPF Kernel Drop'}</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#00f2fe' }}>{result.blockedByEbpf.toLocaleString()}</div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,8,68,0.2)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#ff4e50' }}>{isPt ? 'WAF Rate Limit (429)' : 'WAF Rate Limit (429)'}</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ff4e50' }}>{result.blockedByWafRateLimit.toLocaleString()}</div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(72,187,120,0.2)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#48bb78' }}>{isPt ? 'Tráfego Legítimo (200 OK)' : 'Passed (200 OK)'}</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#48bb78' }}>{result.allowedRequests.toLocaleString()}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
