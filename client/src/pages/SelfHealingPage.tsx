import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import {
  Wrench,
  Sparkles,
  RotateCw,
  CheckCircle2,
  GitPullRequest,
  FileCode,
  ShieldCheck,
  ExternalLink,
  Code2,
  GitBranch,
} from 'lucide-react';

export const SelfHealingPage: React.FC = () => {
  const [patches, setPatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [synthesizing, setSynthesizing] = useState(false);
  const [applyingId, setApplyingId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const res: any = await apiClient.get('/self-healing/patches');
      if (res.success) setPatches(res.data);
    } catch (err) {
      console.error('Failed to load self-healing patches data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSynthesize = async () => {
    setSynthesizing(true);
    try {
      const res: any = await apiClient.post('/self-healing/patches', {
        title: 'Fix Insecure CORS Configuration & Missing Rate Limits',
        targetFile: 'src/middleware/cors.middleware.ts',
      });
      if (res.success) loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to synthesize code auto-fix patch');
    } finally {
      setSynthesizing(false);
    }
  };

  const handleApply = async (patchId: string) => {
    setApplyingId(patchId);
    try {
      const res: any = await apiClient.post(`/self-healing/patches/${patchId}/apply`, {});
      if (res.success) loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to apply self-healing patch');
    } finally {
      setApplyingId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
        [SENTINELX SELF-HEALING ENGINE] SYNTHESIZING GENERATIVE SOURCE CODE PATCHES & RUNNING CI/CD GUARDRAILS...
      </div>
    );
  }

  const activePrsCount = patches.filter((p) => p.status === 'PR_OPENED' || p.status === 'PROPOSED').length;
  const appliedCount = patches.filter((p) => p.status === 'APPLIED').length;

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Wrench size={28} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Autonomous Self-Healing & Code Auto-Fix Engine</h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Generative Code Patching, Automated Git PR Creation (GitHub/GitLab) & CI/CD Safety Verification
          </p>
        </div>

        <button className="btn-primary" disabled={synthesizing} onClick={handleSynthesize}>
          {synthesizing ? <RotateCw size={16} className="spin" /> : <Sparkles size={16} />}
          Synthesize Generative Code Fix
        </button>
      </div>

      {/* Metric Cards Tally */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            TOTAL CODE PATCHES
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
            {patches.length} PATCHES
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Synthesized auto-fixes
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-purple)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            OPEN GIT PULL REQUESTS
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-purple)' }}>
            {activePrsCount} OPEN PRs
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            GitHub / GitLab PR worker
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            MERGED & APPLIED
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
            {appliedCount} APPLIED
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Applied to production codebase
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            CI/CD SAFETY GRADE
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
            98.5% SCORE
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Automated regression pass rate
          </div>
        </div>
      </div>

      {/* Synthesized Patches & Git Diff Table */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {patches.map((patch) => (
          <div key={patch.id} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <GitPullRequest size={20} color="var(--accent-cyan)" />
                  <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>{patch.title}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span>TARGET: {patch.targetFile}</span>
                  <span>REPO: {patch.repositoryUrl}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="badge badge-amber" style={{ fontSize: '0.78rem' }}>
                  SAFETY SCORE: {patch.safetyScore}%
                </span>
                <span className={patch.status === 'APPLIED' ? 'badge badge-emerald' : 'badge badge-cyan'}>
                  {patch.status}
                </span>
              </div>
            </div>

            {/* Git Diff Code Block */}
            <div style={{ background: '#070913', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', whiteSpace: 'pre-wrap', color: '#e2e8f0', lineHeight: 1.6 }}>
              {patch.codeDiff.split('\n').map((line: string, idx: number) => {
                const isAdd = line.startsWith('+');
                const isSub = line.startsWith('-');
                return (
                  <div key={idx} style={{ color: isAdd ? '#34d399' : isSub ? '#f87171' : '#94a3b8', background: isAdd ? 'rgba(52, 211, 153, 0.08)' : isSub ? 'rgba(248, 113, 113, 0.08)' : 'transparent', padding: '2px 6px', borderRadius: '4px' }}>
                    {line}
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px' }}>
              <a href={patch.pullRequestUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.82rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
                <GitBranch size={14} /> View Pull Request on GitHub <ExternalLink size={12} />
              </a>

              {patch.status !== 'APPLIED' && (
                <button
                  className="btn-primary"
                  style={{ fontSize: '0.8rem', padding: '8px 16px' }}
                  disabled={applyingId === patch.id}
                  onClick={() => handleApply(patch.id)}
                >
                  {applyingId === patch.id ? <RotateCw size={14} className="spin" /> : <CheckCircle2 size={14} />}
                  Merge PR & Deploy Code Auto-Fix
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
