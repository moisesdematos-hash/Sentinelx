import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import {
  Globe2,
  RefreshCw,
  Search,
  AlertOctagon,
  CheckCircle2,
  ShieldAlert,
  Server,
  Zap,
  Filter,
  Eye,
  Radio,
} from 'lucide-react';

export const ThreatIntelPage: React.FC = () => {
  const [indicators, setIndicators] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  const loadData = async () => {
    try {
      const [indRes, matchRes]: any = await Promise.all([
        apiClient.get('/threat-intel/indicators'),
        apiClient.get('/threat-intel/matches'),
      ]);

      if (indRes.success) setIndicators(indRes.data);
      if (matchRes.success) setMatches(matchRes.data);
    } catch (err) {
      console.error('Failed to load threat intel data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSyncFeeds = async () => {
    setSyncing(true);
    try {
      const res: any = await apiClient.post('/threat-intel/sync', {});
      if (res.success) {
        loadData();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to sync threat intelligence feeds');
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
        [SENTINELX THREAT INTEL] SYNCING MULTI-FEED THREAT INTELLIGENCE & MATCHING IOCs...
      </div>
    );
  }

  const filteredIndicators = indicators.filter((item) => {
    const matchesSearch =
      item.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.threatActor && item.threatActor.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'ALL' || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Globe2 size={28} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Threat Intelligence Feed Engine</h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            MISP, AlienVault OTX, CISA KEV & AbuseIPDB Threat Feeds with Real-Time Asset IOC Matching
          </p>
        </div>

        <button className="btn-primary" disabled={syncing} onClick={handleSyncFeeds}>
          <RefreshCw size={16} className={syncing ? 'spin' : ''} />
          {syncing ? 'Syncing Feeds...' : 'Sync Threat Feeds'}
        </button>
      </div>

      {/* Metric Cards Tally */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            ACTIVE THREAT FEEDS
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
            4 FEEDS
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            CISA KEV, AbuseIPDB, OTX, MISP
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-purple)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            INGESTED IOC INDICATORS
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-purple)' }}>
            {indicators.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Correlated threat items
          </div>
        </div>

        <div className="glass-panel glass-panel-danger" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-rose)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            INFRASTRUCTURE IOC MATCHES
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-rose)' }}>
            {matches.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Active asset threat hits
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            CONFIDENCE LEVEL
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
            95% - 99%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            High-fidelity threat intel
          </div>
        </div>
      </div>

      {/* Threat Indicators Table with Search Controls */}
      <div className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ padding: '20px 24px 0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={18} color="var(--accent-cyan)" /> Ingested IOC Indicators & Threat Actor Database
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <select
              className="input-field"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{ width: '130px', fontSize: '0.8rem' }}
            >
              <option value="ALL">All Types</option>
              <option value="CVE">CVE Flaws</option>
              <option value="IP">Malicious IPs</option>
              <option value="DOMAIN">Domains</option>
              <option value="HASH">Hashes</option>
            </select>

            <div style={{ position: 'relative', width: '250px' }}>
              <input
                type="text"
                className="input-field"
                placeholder="Search IOCs, CVEs, or APTs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '32px', fontSize: '0.8rem' }}
              />
              <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
            </div>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(11, 15, 25, 0.9)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>INDICATOR VALUE</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TYPE</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>THREAT ACTOR</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SEVERITY</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>CONFIDENCE</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>INFRASTRUCTURE MATCH</th>
            </tr>
          </thead>
          <tbody>
            {filteredIndicators.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid rgba(56, 189, 248, 0.08)' }}>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                    {item.value}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {item.description}
                  </div>
                </td>

                <td style={{ padding: '16px 24px' }}>
                  <span className="badge badge-purple">{item.type}</span>
                </td>

                <td style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 600 }}>
                  {item.threatActor || 'Generic Cyber Crime'}
                </td>

                <td style={{ padding: '16px 24px' }}>
                  <span className={item.severity === 'CRITICAL' ? 'badge badge-rose' : 'badge badge-amber'}>
                    {item.severity}
                  </span>
                </td>

                <td style={{ padding: '16px 24px', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
                  {item.confidenceScore}%
                </td>

                <td style={{ padding: '16px 24px' }}>
                  {item.isMatched ? (
                    <span className="badge badge-rose" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <AlertOctagon size={12} /> MATCHED: {item.matchedAsset?.name || 'Production Asset'}
                    </span>
                  ) : (
                    <span className="badge badge-secondary">NO MATCH</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
