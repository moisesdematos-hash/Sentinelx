import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import {
  Share2,
  GitBranch,
  ShieldAlert,
  Zap,
  CheckCircle2,
  ArrowRight,
  Server,
  Cloud,
  User,
  AlertTriangle,
  RotateCw,
  Eye,
} from 'lucide-react';

export const SecurityGraphPage: React.FC = () => {
  const [topology, setTopology] = useState<any>({ nodes: [], edges: [] });
  const [attackPaths, setAttackPaths] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [blastRadiusResult, setBlastRadiusResult] = useState<any | null>(null);
  const [calculating, setCalculating] = useState(false);

  const loadData = async () => {
    try {
      const [topoRes, pathsRes]: any = await Promise.all([
        apiClient.get('/graph/topology'),
        apiClient.get('/graph/attack-paths'),
      ]);

      if (topoRes.success) setTopology(topoRes.data);
      if (pathsRes.success) setAttackPaths(pathsRes.data);
    } catch (err) {
      console.error('Failed to load security graph topology', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSimulateBlastRadius = async (nodeId: string) => {
    setCalculating(true);
    try {
      const res: any = await apiClient.get(`/graph/blast-radius/${nodeId}`);
      if (res.success) {
        setBlastRadiusResult(res.data);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to calculate blast radius');
    } finally {
      setCalculating(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
        [SENTINELX GRAPH ENGINE] BUILDING DIRECTED GRAPH TOPOLOGY & ATTACK VECTORS...
      </div>
    );
  }

  const { nodes, edges } = topology;

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Share2 size={28} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Graph-Based Security & Blast Radius Engine</h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Entity Topology Graph, Multi-Hop Attack Vectors & Lateral Movement Blast Radius Calculator
          </p>
        </div>

        <button className="btn-primary" onClick={loadData}>
          <RotateCw size={16} /> Refresh Graph Topology
        </button>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            GRAPH NODES
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
            {nodes.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={12} /> Assets, Connectors, Identities
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            GRAPH EDGES (RELATIONSHIPS)
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-purple)' }}>
            {edges.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Directed data & privilege flows
          </div>
        </div>

        <div className="glass-panel glass-panel-danger" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-rose)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            DISCOVERED ATTACK PATHS
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-rose)' }}>
            {attackPaths.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Multi-hop lateral risk vectors
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '8px' }}>
            BLAST RADIUS CALCULATOR
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
            ACTIVE
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Click node to simulate breach
          </div>
        </div>
      </div>

      {/* Main Grid: Visual Topology Map & Attack Vectors */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Visual Topology Map */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GitBranch size={18} color="var(--accent-cyan)" />
            Security Entity Topology Graph
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {nodes.map((node: any) => (
              <div
                key={node.id}
                style={{
                  padding: '16px',
                  borderRadius: '8px',
                  background: 'rgba(11, 15, 25, 0.7)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: node.type === 'USER' ? 'rgba(236, 72, 153, 0.2)' : node.type === 'CONNECTOR' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(0, 242, 254, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {node.type === 'USER' ? (
                      <User size={18} color="#ec4899" />
                    ) : node.type === 'CONNECTOR' ? (
                      <Cloud size={18} color="#a855f7" />
                    ) : (
                      <Server size={18} color="var(--accent-cyan)" />
                    )}
                  </div>

                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 700 }}>{node.label}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                      Type: {node.type} | Risk Score: {node.riskScore}/100
                    </div>
                  </div>
                </div>

                <button
                  className="btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                  onClick={() => handleSimulateBlastRadius(node.id)}
                >
                  <Eye size={12} /> Simulate Blast Radius
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Attack Paths Breakdown */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={18} color="var(--accent-rose)" />
            Multi-Hop Attack Path Analysis
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {attackPaths.map((path: any) => (
              <div
                key={path.id}
                style={{
                  padding: '18px',
                  borderRadius: '8px',
                  background: 'rgba(244, 63, 94, 0.06)',
                  border: '1px solid rgba(244, 63, 94, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-rose)' }}>
                    {path.name}
                  </span>
                  <span className="badge badge-rose">{path.severity}</span>
                </div>

                {/* Hops Walkthrough */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  {path.nodesSequence.map((n: any, idx: number) => (
                    <React.Fragment key={idx}>
                      <span className="badge badge-purple" style={{ fontFamily: 'var(--font-mono)' }}>
                        {n.label}
                      </span>
                      {idx < path.nodesSequence.length - 1 && <ArrowRight size={14} color="var(--text-muted)" />}
                    </React.Fragment>
                  ))}
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px' }}>
                  💡 <strong>Remediation Recommendation:</strong> {path.remediation}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Blast Radius Simulation Drawer / Modal */}
      {blastRadiusResult && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(6, 8, 19, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '550px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--accent-rose)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                BLAST RADIUS SIMULATION RESULT
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '4px' }}>
                Impact Analysis for {blastRadiusResult.targetNode.label}
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="glass-panel" style={{ padding: '16px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>BLAST RADIUS SCORE</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-rose)', marginTop: '4px' }}>
                  {blastRadiusResult.blastRadiusScore}<span style={{ fontSize: '0.9rem' }}>/100</span>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '16px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>AFFECTED DOWNSTREAM NODES</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-cyan)', marginTop: '4px' }}>
                  {blastRadiusResult.reachableNodesCount} Nodes
                </div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
                LATERAL COMPROMISE IMPACT LEVEL
              </div>
              <span className="badge badge-rose" style={{ padding: '6px 12px' }}>
                {blastRadiusResult.impactLevel}
              </span>
            </div>

            <button className="btn-secondary" onClick={() => setBlastRadiusResult(null)}>
              Close Simulation
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
