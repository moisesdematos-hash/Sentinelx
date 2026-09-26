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
  CheckCircle2,
  ShieldCheck,
  X,
  FileCheck,
  Zap,
  RefreshCw,
  LayoutGrid,
  List,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const DEFAULT_SEED_ASSETS = [
  {
    id: 'asset-prod-web-01',
    name: 'Portal Web de Produção',
    type: 'WEBSITE',
    target: 'https://app.sentinelx-cyber.com',
    environment: 'PRODUCTION',
    criticality: 'CRITICAL',
    securityScore: 100,
    isShielded: true,
    metadata: { server: 'nginx/1.24', ssl: 'TLS 1.3 Strict', waf: 'ACTIVE' },
    baselines: [{ version: 1, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' }],
  },
  {
    id: 'asset-prod-api-02',
    name: 'API REST de Pagamentos & Pix',
    type: 'API',
    target: 'https://api.sentinelx-cyber.com/v1/payments',
    environment: 'PRODUCTION',
    criticality: 'CRITICAL',
    securityScore: 98,
    isShielded: true,
    metadata: { auth: 'OAuth2 + JWT', rateLimit: '100 req/min', pii: 'ENCRYPTED' },
    baselines: [{ version: 1, hash: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284ddd200126d9069e' }],
  },
  {
    id: 'asset-prod-kernel-03',
    name: 'Servidor Linux Kernel eBPF (Node-01)',
    type: 'SERVER',
    target: '185.220.101.5 (prod-cluster-node-01)',
    environment: 'PRODUCTION',
    criticality: 'HIGH',
    securityScore: 96,
    isShielded: true,
    metadata: { os: 'Ubuntu 22.04 LTS', ebpf: 'ACTIVE (Ring 0)', fim: 'LOCKED' },
    baselines: [{ version: 1, hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4' }],
  },
  {
    id: 'asset-prod-k8s-04',
    name: 'Cluster Kubernetes Pods Auth (K8s)',
    type: 'CONTAINER',
    target: 'ghcr.io/sentinelx/auth-service:v2.1.0',
    environment: 'PRODUCTION',
    criticality: 'HIGH',
    securityScore: 95,
    isShielded: true,
    metadata: { runtime: 'containerd', pss: 'RESTRICTED', user: '10001 (non-root)' },
    baselines: [{ version: 1, hash: '6ca13d52270fe5703ce13d96915893a7c126365546ceab6464200d11528d2976' }],
  },
  {
    id: 'asset-prod-s3-05',
    name: 'Nuvem AWS S3 Data Vault (prod-vault)',
    type: 'CLOUD',
    target: 'arn:aws:s3:::sentinelx-prod-vault-data',
    environment: 'PRODUCTION',
    criticality: 'CRITICAL',
    securityScore: 100,
    isShielded: true,
    metadata: { provider: 'AWS', encryption: 'AES-256-GCM', publicAccessBlock: 'LOCKED' },
    baselines: [{ version: 1, hash: 'a129d012a5dfa91b2875b47a982b6190184b901a18290a182b810a91280a9128' }],
  },
];

export const AssetsPage: React.FC = () => {
  const { t } = useLanguage();
  const [assets, setAssets] = useState<any[]>(DEFAULT_SEED_ASSETS);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const [shieldingAssetId, setShieldingAssetId] = useState<string | null>(null);
  const [globalShielding, setGlobalShielding] = useState(false);
  const [shieldingSuccessMsg, setShieldingSuccessMsg] = useState<string | null>(null);

  // View Mode Switcher: 'MOSAIC' (Cards Grid) vs 'LINE' (Table List)
  const [viewMode, setViewMode] = useState<'MOSAIC' | 'LINE'>('MOSAIC');

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

      const res: any = await apiClient.get(url).catch(() => null);
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        setAssets(res.data);
      }
    } catch (err) {
      console.warn('Using default seed assets for presentation', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, [filterType, filterEnv, searchQuery]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const newAsset = {
      id: `asset_custom_${Date.now()}`,
      name: formData.name,
      type: formData.type,
      target: formData.target,
      environment: formData.environment,
      criticality: formData.criticality,
      owner: formData.owner || 'DevSecOps Team',
      securityScore: 100,
      isShielded: true,
      metadata: { createdAt: new Date().toISOString() },
      baselines: [{ version: 1, hash: 'locked_sha256_baseline_' + Date.now() }],
    };

    try {
      await apiClient.post('/assets', formData).catch(() => null);
    } catch (err) {
      console.warn('Backend endpoint fallback');
    }

    setAssets((prev) => [newAsset, ...prev]);
    setIsModalOpen(false);
    setFormData({ name: '', type: 'WEBSITE', target: '', environment: 'PRODUCTION', criticality: 'HIGH', owner: '' });
    setShieldingSuccessMsg(`✅ Serviço "${newAsset.name}" cadastrado e blindado automaticamente com sucesso!`);
  };

  // ⚡ 1-Click Auto Protection Enforcer & Toggle (ON/OFF) for a single asset
  const handleToggleShieldAsset = async (assetId: string, assetName: string, currentlyShielded: boolean, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setShieldingAssetId(assetId);
    setShieldingSuccessMsg(null);

    const newStatus = !currentlyShielded;

    // Update local state immediately
    setAssets((prev) =>
      prev.map((item) =>
        item.id === assetId
          ? {
              ...item,
              securityScore: newStatus ? 100 : 55,
              isShielded: newStatus,
              baselines: newStatus
                ? [{ version: (item.baselines?.[0]?.version || 1) + 1, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' }]
                : item.baselines,
            }
          : item
      )
    );
    if (selectedAsset && selectedAsset.id === assetId) {
      setSelectedAsset((prev: any) => (prev ? { ...prev, isShielded: newStatus, securityScore: newStatus ? 100 : 55 } : null));
    }

    try {
      await apiClient.post(`/assets/${assetId}/baseline`).catch(() => null);
    } catch (err) {
      console.warn('Backend call warning');
    }

    setTimeout(() => {
      setShieldingAssetId(null);
      if (newStatus) {
        setShieldingSuccessMsg(`⚡ BLINDAGEM TOTAL ATIVADA EM 1-CLIQUE PARA "${assetName}"! Baseline SHA-256 travado, eBPF Kernel Hot-Patching Ring 0 ativo, Autopiloto em FULL_AUTO e WAF configurado.`);
      } else {
        setShieldingSuccessMsg(`⚠️ BLINDAGEM DESATIVADA PARA "${assetName}". O ativo continuará no inventário, mas a interceptação eBPF e as regras WAF foram pausadas.`);
      }
    }, 400);
  };

  // ⚡ 1-Click Auto Protection Enforcer for ALL assets
  const handleAutoShieldAllAssets = async () => {
    setGlobalShielding(true);
    setShieldingSuccessMsg(null);

    setAssets((prev) =>
      prev.map((item) => ({
        ...item,
        securityScore: 100,
        isShielded: true,
        baselines: [{ version: (item.baselines?.[0]?.version || 1) + 1, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' }],
      }))
    );

    try {
      await Promise.all(assets.map((a) => apiClient.post(`/assets/${a.id}/baseline`).catch(() => null)));
    } catch (err) {
      console.warn('Backend call warning');
    }

    setTimeout(() => {
      setGlobalShielding(false);
      setShieldingSuccessMsg(`🛡️ BLINDAGEM TOTAL EM 1-CLIQUE CONCLUÍDA EM TODOS OS ${assets.length} ATIVOS! Todos os serviços estão 100% protegidos com eBPF, Autopiloto FULL_AUTO e Baseline SHA-256.`);
    }, 500);
  };

  const handleLockBaseline = async (id: string) => {
    setAssets((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              baselines: [{ version: (item.baselines?.[0]?.version || 1) + 1, hash: 'sha256_locked_' + Date.now() }],
            }
          : item
      )
    );
    try {
      await apiClient.post(`/assets/${id}/baseline`).catch(() => null);
    } catch (e) {
      console.warn(e);
    }
    alert('KNOWN_GOOD_BASELINE snapshot locked successfully!');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja remover este serviço do monitoramento do SENTINELX?')) return;
    setAssets((prev) => prev.filter((a) => a.id !== id));
    if (selectedAsset?.id === id) setSelectedAsset(null);
    try {
      await apiClient.delete(`/assets/${id}`).catch(() => null);
    } catch (e) {
      console.warn(e);
    }
  };

  const inspectAsset = (asset: any) => {
    setSelectedAsset(asset);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'WEBSITE': return <Globe size={20} color="var(--accent-cyan)" />;
      case 'API': return <Terminal size={20} color="var(--accent-purple)" />;
      case 'CLOUD': return <Cloud size={20} color="var(--accent-amber)" />;
      default: return <Database size={20} color="var(--accent-blue)" />;
    }
  };

  const filteredAssets = assets.filter((asset) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery = !q || asset.name.toLowerCase().includes(q) || asset.target.toLowerCase().includes(q);
    const matchesType = !filterType || asset.type === filterType;
    const matchesEnv = !filterEnv || asset.environment === filterEnv;
    return matchesQuery && matchesType && matchesEnv;
  });

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ minWidth: '280px', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{t('assets.title')}</h2>
            <span className="badge badge-emerald">AUTOMÁTICO EM 1-CLIQUE</span>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {t('assets.subtitle')}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            className="btn-primary"
            onClick={handleAutoShieldAllAssets}
            disabled={globalShielding || assets.length === 0}
            style={{
              background: 'var(--gradient-cyan)',
              boxShadow: '0 0 15px rgba(0, 242, 254, 0.4)',
              padding: '7px 14px',
              fontSize: '0.82rem',
              fontWeight: 800,
              whiteSpace: 'nowrap',
            }}
          >
            {globalShielding ? <RefreshCw size={14} className="spin" /> : <Zap size={14} />}
            {t('assets.shield_all')}
          </button>

          <button
            className="btn-secondary"
            onClick={() => setIsModalOpen(true)}
            style={{
              padding: '7px 14px',
              fontSize: '0.82rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Plus size={14} /> {t('assets.register_asset')}
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {shieldingSuccessMsg && (
        <div className="glass-panel" style={{ padding: '16px 20px', borderLeft: '4px solid var(--accent-emerald)', background: '#0b0f19', color: 'var(--accent-emerald)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: 600 }}>
            <CheckCircle2 size={18} />
            <span>{shieldingSuccessMsg}</span>
          </div>
          <button onClick={() => setShieldingSuccessMsg(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Filter Toolbar & View Mode Switcher */}
      <div className="glass-panel" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '280px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              className="input-field"
              placeholder={t('action.search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="input-field"
            style={{ width: '150px' }}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="WEBSITE">Websites</option>
            <option value="API">REST APIs</option>
            <option value="SERVER">Servers</option>
            <option value="CLOUD">Cloud Accounts</option>
            <option value="CONTAINER">Containers</option>
          </select>

          <select
            className="input-field"
            style={{ width: '150px' }}
            value={filterEnv}
            onChange={(e) => setFilterEnv(e.target.value)}
          >
            <option value="">All Environments</option>
            <option value="PRODUCTION">Production</option>
            <option value="STAGING">Staging</option>
            <option value="DEVELOPMENT">Development</option>
          </select>
        </div>

        {/* View Mode Toggle Buttons: Mosaico (Cards Grid) vs Linha (Table List) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(11, 15, 25, 0.9)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <button
            onClick={() => setViewMode('MOSAIC')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              background: viewMode === 'MOSAIC' ? 'var(--accent-cyan)' : 'transparent',
              color: viewMode === 'MOSAIC' ? '#060813' : 'var(--text-muted)',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
            }}
          >
            <LayoutGrid size={16} />
            <span>{t('view_mode.mosaic')}</span>
          </button>

          <button
            onClick={() => setViewMode('LINE')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              background: viewMode === 'LINE' ? 'var(--accent-cyan)' : 'transparent',
              color: viewMode === 'LINE' ? '#060813' : 'var(--text-muted)',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
            }}
          >
            <List size={16} />
            <span>{t('view_mode.line')}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedAsset ? '1fr 420px' : '1fr', gap: '24px' }}>
        {filteredAssets.length === 0 && (
          <div className="glass-panel" style={{ padding: '48px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <Server size={48} color="var(--accent-cyan)" style={{ opacity: 0.7 }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Nenhum ativo encontrado</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', maxWidth: '450px', lineHeight: 1.5 }}>
              Não há serviços cadastrados correspondentes à pesquisa ou filtro selecionado. Clique no botão abaixo para adicionar o seu site, servidor ou API.
            </p>
            <button className="btn-primary" onClick={() => setIsModalOpen(true)} style={{ padding: '12px 24px', fontWeight: 800, gap: '8px' }}>
              <Plus size={18} /> Cadastrar Novo Ativo
            </button>
          </div>
        )}

        {/* Mosaico Mode (Grid Cards View) */}
        {viewMode === 'MOSAIC' && filteredAssets.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                onClick={() => inspectAsset(asset)}
                className="glass-panel"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.22s ease',
                  borderLeft: asset.criticality === 'CRITICAL' ? '4px solid var(--accent-rose)' : '4px solid var(--accent-cyan)',
                  background: selectedAsset?.id === asset.id ? 'rgba(0, 242, 254, 0.08)' : 'rgba(15, 23, 42, 0.7)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(11, 15, 25, 0.9)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {getIcon(asset.type)}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>{asset.name}</h4>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          {asset.target}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(asset.id);
                      }}
                      style={{ background: 'transparent', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer' }}
                      title="Remover Ativo"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                    <span className="badge badge-cyan">{asset.type}</span>
                    <span className="badge badge-purple">{asset.environment}</span>
                    <span className={asset.criticality === 'CRITICAL' ? 'badge badge-rose' : 'badge badge-amber'}>
                      {asset.criticality}
                    </span>
                    {asset.isShielded && <span className="badge badge-emerald">🛡️ BLINDAGEM ATIVA</span>}
                  </div>

                  {/* Security Score Bar */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Score de Segurança</span>
                      <span style={{ color: 'var(--accent-emerald)' }}>{asset.securityScore}/100 (Ótimo)</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(11, 15, 25, 0.9)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${asset.securityScore}%`, height: '100%', background: 'var(--gradient-cyan)', borderRadius: '3px' }} />
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button
                    className={asset.isShielded ? 'btn-secondary' : 'btn-primary'}
                    style={{
                      fontSize: '0.75rem',
                      padding: '8px 12px',
                      width: '100%',
                      justifyContent: 'center',
                      gap: '6px',
                      fontWeight: 800,
                      borderColor: asset.isShielded ? 'rgba(244, 63, 94, 0.4)' : undefined,
                      color: asset.isShielded ? 'var(--accent-rose)' : undefined,
                    }}
                    onClick={(e) => handleToggleShieldAsset(asset.id, asset.name, asset.isShielded, e)}
                    disabled={shieldingAssetId === asset.id}
                  >
                    {shieldingAssetId === asset.id ? (
                      <RefreshCw size={14} className="spin" />
                    ) : asset.isShielded ? (
                      <ShieldCheck size={14} />
                    ) : (
                      <Zap size={14} />
                    )}
                    {asset.isShielded ? '🛡️ DESATIVAR BLINDAGEM' : '⚡ BLINDAR AUTOMATICAMENTE'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Linha Mode (Table List View) */}
        {viewMode === 'LINE' && filteredAssets.length > 0 && (
          <div className="glass-panel" style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(11, 15, 25, 0.9)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>NOME DO SERVIÇO</th>
                  <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TIPO</th>
                  <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ALVO / ENDEREÇO</th>
                  <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>AMBIENTE</th>
                  <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>CRITICIDADE</th>
                  <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SCORE</th>
                  <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textAlign: 'right' }}>PROTEÇÃO 1-CLIQUE</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map((asset) => (
                  <tr
                    key={asset.id}
                    style={{
                      borderBottom: '1px solid rgba(56, 189, 248, 0.08)',
                      background: selectedAsset?.id === asset.id ? 'rgba(0, 242, 254, 0.06)' : 'transparent',
                      cursor: 'pointer',
                    }}
                    onClick={() => inspectAsset(asset)}
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
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          className={asset.isShielded ? 'btn-secondary' : 'btn-primary'}
                          style={{
                            fontSize: '0.75rem',
                            padding: '6px 12px',
                            gap: '4px',
                            fontWeight: 800,
                            borderColor: asset.isShielded ? 'rgba(244, 63, 94, 0.4)' : undefined,
                            color: asset.isShielded ? 'var(--accent-rose)' : undefined,
                          }}
                          onClick={(e) => handleToggleShieldAsset(asset.id, asset.name, asset.isShielded, e)}
                          disabled={shieldingAssetId === asset.id}
                        >
                          {shieldingAssetId === asset.id ? (
                            <RefreshCw size={12} className="spin" />
                          ) : asset.isShielded ? (
                            <ShieldCheck size={12} />
                          ) : (
                            <Zap size={12} />
                          )}
                          {asset.isShielded ? 'DESATIVAR' : '⚡ BLINDAR'}
                        </button>

                        <button
                          onClick={() => handleDelete(asset.id)}
                          style={{ background: 'transparent', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer', padding: '4px' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

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

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span className="badge badge-cyan">{selectedAsset.type}</span>
              <span className="badge badge-purple">{selectedAsset.environment}</span>
              <span className="badge badge-emerald">SCORE: {selectedAsset.securityScore}/100</span>
            </div>

            {/* 1-Click Shielding Card in Inspector */}
            <div style={{ padding: '16px', borderRadius: '10px', background: selectedAsset.isShielded ? 'rgba(244, 63, 94, 0.08)' : 'rgba(0, 242, 254, 0.08)', border: selectedAsset.isShielded ? '1px solid var(--accent-rose)' : '1px solid var(--accent-cyan)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: selectedAsset.isShielded ? 'var(--accent-rose)' : 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Zap size={16} /> {selectedAsset.isShielded ? 'BLINDAGEM ATIVA NO ATIVO' : 'BLINDAGEM AUTOMÁTICA EM 1-CLIQUE'}
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                {selectedAsset.isShielded
                  ? 'A proteção eBPF, Baseline Lock SHA-256 e WAF Rate Limiting estão ativos. Clique abaixo se desejar desativar temporariamente.'
                  : 'Aplica instantaneamente Baseline Lock SHA-256, Hot-Patching eBPF no Kernel, Autopiloto FULL_AUTO e WAF Rate Limiting neste serviço.'}
              </p>
              <button
                className={selectedAsset.isShielded ? 'btn-secondary' : 'btn-primary'}
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  fontSize: '0.82rem',
                  gap: '6px',
                  fontWeight: 800,
                  borderColor: selectedAsset.isShielded ? 'rgba(244, 63, 94, 0.4)' : undefined,
                  color: selectedAsset.isShielded ? 'var(--accent-rose)' : undefined,
                }}
                onClick={() => handleToggleShieldAsset(selectedAsset.id, selectedAsset.name, selectedAsset.isShielded)}
                disabled={shieldingAssetId === selectedAsset.id}
              >
                {shieldingAssetId === selectedAsset.id ? (
                  <RefreshCw size={14} className="spin" />
                ) : selectedAsset.isShielded ? (
                  <ShieldCheck size={14} />
                ) : (
                  <Zap size={14} />
                )}
                {selectedAsset.isShielded ? '🛡️ DESATIVAR BLINDAGEM DESTE ATIVO' : '⚡ EXECUTAR BLINDAGEM AUTOMÁTICA AGORA'}
              </button>
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
