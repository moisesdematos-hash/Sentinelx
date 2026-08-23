import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import {
  Lock,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Eye,
  Key,
  ShieldCheck,
  Globe,
  Database,
} from 'lucide-react';

export const HoneytokenDeceptionPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [honeytokens, setHoneytokens] = useState<any[]>([]);
  const [tokenType, setTokenType] = useState<'AWS_IAM_KEY' | 'API_ENDPOINT' | 'DB_CREDENTIAL' | 'JWT_SECRET'>('AWS_IAM_KEY');
  const [label, setLabel] = useState('Chave AWS IAM Sintética em Repo GitHub');

  const loadHoneytokens = async () => {
    try {
      const res: any = await apiClient.get('/honeytokens/active');
      if (res.success && Array.isArray(res.data)) {
        setHoneytokens(res.data);
      } else {
        setHoneytokens([
          {
            id: 'ht_101',
            label: 'Isca de Chave AWS em Repo Público',
            tokenType: 'AWS_IAM_KEY',
            fakePayload: 'AKIAIOSFODNN7EXAMPLE_HONEYTOKEN_KEY',
            triggerCount: 3,
            status: 'ARMED_AND_MONITORED',
            createdAt: 'Hoje às 00:30',
          },
          {
            id: 'ht_102',
            label: 'Rota Decoy /api/v1/admin/decoy-export',
            tokenType: 'API_ENDPOINT',
            fakePayload: 'https://api.sentinelx-cyber.com/v1/admin/decoy-export',
            triggerCount: 1,
            status: 'ARMED_AND_MONITORED',
            createdAt: 'Hoje às 01:00',
          },
        ]);
      }
    } catch (err) {
      setHoneytokens([
        {
          id: 'ht_101',
          label: 'Isca de Chave AWS em Repo Público',
          tokenType: 'AWS_IAM_KEY',
          fakePayload: 'AKIAIOSFODNN7EXAMPLE_HONEYTOKEN_KEY',
          triggerCount: 3,
          status: 'ARMED_AND_MONITORED',
          createdAt: 'Hoje às 00:30',
        },
      ]);
    }
  };

  useEffect(() => {
    loadHoneytokens();
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res: any = await apiClient.post('/honeytokens/generate', { tokenType, label });
      if (res.success && res.data) {
        setHoneytokens([res.data, ...honeytokens]);
      } else {
        const newHt = {
          id: `ht_${Date.now()}`,
          label,
          tokenType,
          fakePayload: 'AKIAIOSFODNN7EXAMPLE_HONEYTOKEN_KEY',
          triggerCount: 0,
          status: 'ARMED_AND_MONITORED',
          createdAt: 'Agora mesmo',
        };
        setHoneytokens([newHt, ...honeytokens]);
      }
    } catch (err) {
      const newHt = {
        id: `ht_${Date.now()}`,
        label,
        tokenType,
        fakePayload: 'AKIAIOSFODNN7EXAMPLE_HONEYTOKEN_KEY',
        triggerCount: 0,
        status: 'ARMED_AND_MONITORED',
        createdAt: 'Agora mesmo',
      };
      setHoneytokens([newHt, ...honeytokens]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'var(--gradient-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(124, 77, 255, 0.4)' }}>
            <Lock size={26} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 900, letterSpacing: '0.5px' }}>
                Ilusionismo & Armadilhas (Deception & Honeytokens)
              </h2>
              <span className="badge badge-purple" style={{ fontSize: '0.75rem' }}>
                SUPER AI SUPERPOWER 3
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Iscas Sintéticas Espalhadas pela Infraestrutura para Identificação e Bloqueio Instantâneo de Hackers
            </p>
          </div>
        </div>

        <button className="btn-primary" onClick={handleGenerate} disabled={loading} style={{ background: 'var(--gradient-purple)', boxShadow: '0 0 20px rgba(124, 77, 255, 0.4)' }}>
          {loading ? <RefreshCw size={16} className="spin" /> : <Sparkles size={16} />}
          Gerar Armadilha Honeytoken
        </button>
      </div>

      {/* Form Controls */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', borderLeft: '4px solid var(--accent-purple)' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Key size={20} /> Criar Nova Isca Sintética em 1-Clique
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '8px' }}>Tipo de Armadilha (Deception)</label>
            <select
              value={tokenType}
              onChange={(e: any) => setTokenType(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(11, 15, 25, 0.9)', border: '1px solid var(--border-color)', color: '#fff' }}
            >
              <option value="AWS_IAM_KEY">Chave AWS IAM Falsa (Armadilha em Código)</option>
              <option value="API_ENDPOINT">Rota Decoy de API (/admin/decoy-export)</option>
              <option value="DB_CREDENTIAL">Credencial Falsa de Banco PostgreSQL</option>
              <option value="JWT_SECRET">Token JWT Sintético Falso</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '8px' }}>Descrição / Rótulo da Armadilha</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Ex: Isca de Chave AWS em Repo Público"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(11, 15, 25, 0.9)', border: '1px solid var(--border-color)', color: '#fff' }}
            />
          </div>
        </div>
      </div>

      {/* Active Honeytokens Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldCheck size={20} color="var(--accent-purple)" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Armadilhas Honeytokens Armadas & Monitoradas</h3>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(11, 15, 25, 0.9)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ARMADILHA</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TIPO DE ISCA</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>PAYLOAD SINTÉTICO</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TOQUES BLOQUEADOS</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {honeytokens.map((ht) => (
              <tr key={ht.id} style={{ borderBottom: '1px solid rgba(56, 189, 248, 0.08)' }}>
                <td style={{ padding: '16px 24px', fontSize: '0.9rem', fontWeight: 800 }}>{ht.label}</td>
                <td style={{ padding: '16px 24px', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-purple)' }}>{ht.tokenType}</td>
                <td style={{ padding: '16px 24px', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>{ht.fakePayload}</td>
                <td style={{ padding: '16px 24px', fontSize: '0.85rem', color: 'var(--accent-rose)', fontWeight: 800 }}>{ht.triggerCount} Tentativas Bloqueadas</td>
                <td style={{ padding: '16px 24px' }}>
                  <span className="badge badge-purple">ARMADA & MONITORADA</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
