import React from 'react';
import { ShieldCheck, Award, Lock, FileCheck, Printer, X, Zap, CheckCircle2, Crown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface GoldenKeyCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoldenKeyCertificateModal: React.FC<GoldenKeyCertificateModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const masterHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <div
        className="glass-panel print-area"
        style={{
          width: '780px',
          maxWidth: '100%',
          background: 'linear-gradient(145deg, #0b0f19 0%, #121829 100%)',
          border: '2px solid #ffd700',
          boxShadow: '0 0 50px rgba(255, 215, 0, 0.3)',
          borderRadius: '16px',
          padding: '36px',
          position: 'relative',
          color: '#fff',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="no-print"
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
        >
          <X size={24} />
        </button>

        {/* Certificate Golden Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #ffd700 0%, #ffaa00 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(255, 215, 0, 0.6)' }}>
            <Crown size={36} color="#060813" />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#ffd700', letterSpacing: '2px', fontFamily: 'var(--font-mono)' }}>
              🏆 CERTIFICAÇÃO COM CHAVE DE OURO
            </span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginTop: '4px', background: 'linear-gradient(135deg, #ffffff 0%, #ffd700 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              PASSAPORTE MESTRE DE CIBERDEFESA AUTÔNOMA
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>
              Plataforma SENTINELX — Continuous Autonomous Cyber Defense Control Plane
            </p>
          </div>
        </div>

        {/* Certificate Body Details */}
        <div style={{ padding: '20px', borderRadius: '12px', background: 'rgba(6, 8, 19, 0.7)', border: '1px solid rgba(255, 215, 0, 0.3)', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 215, 0, 0.15)', paddingBottom: '12px' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ORGANIZAÇÃO / EMPRESA CERTIFICADA</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#00f2fe', marginTop: '2px' }}>
                {user?.organizationName || 'SENTINELX Security Corp'}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>STATUS DE BLINDAGEM</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#00e676', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={18} /> 100/100 (CHAVE DE OURO)
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '6px' }}>CONTROLES TÉCNICOS & NORMAS VINCULADAS (APPROVED & LOCKED)</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(0, 242, 254, 0.08)', border: '1px solid rgba(0, 242, 254, 0.3)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#00f2fe' }}>ISO 27001</div>
                <div style={{ fontSize: '0.65rem', color: '#00e676', marginTop: '2px' }}>✓ A.12.6.1 Lock</div>
              </div>
              <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(124, 77, 255, 0.08)', border: '1px solid rgba(124, 77, 255, 0.3)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#7c4dff' }}>SOC 2 TYPE II</div>
                <div style={{ fontSize: '0.65rem', color: '#00e676', marginTop: '2px' }}>✓ CC6.8 Audited</div>
              </div>
              <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(0, 230, 118, 0.08)', border: '1px solid rgba(0, 230, 118, 0.3)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#00e676' }}>LGPD / GDPR</div>
                <div style={{ fontSize: '0.65rem', color: '#00e676', marginTop: '2px' }}>✓ Artigo 46 OK</div>
              </div>
              <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(255, 215, 0, 0.08)', border: '1px solid rgba(255, 215, 0, 0.3)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ffd700' }}>NIST CSF 2.0</div>
                <div style={{ fontSize: '0.65rem', color: '#00e676', marginTop: '2px' }}>✓ Protect & Respond</div>
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>HASH MESTRE DE AUDITORIA CRIPTOGRÁFICA (SHA-256)</div>
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#ffd700', wordBreak: 'break-all', marginTop: '4px', background: '#060813', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255, 215, 0, 0.2)' }}>
              SHA256: {masterHash}
            </div>
          </div>
        </div>

        {/* Certificate Footer Stamp */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 215, 0, 0.2)', paddingTop: '16px' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>EMITIDO EM</div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>{currentDate}</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffd700', fontWeight: 800, fontSize: '0.85rem' }}>
            <Award size={20} /> CHAVE DE OURO SENTINELX DEPLOYED
          </div>

          <button
            onClick={handlePrint}
            className="btn-primary no-print"
            style={{
              background: 'linear-gradient(135deg, #ffd700 0%, #ffaa00 100%)',
              color: '#060813',
              fontWeight: 900,
              padding: '10px 20px',
              fontSize: '0.88rem',
              boxShadow: '0 0 20px rgba(255, 215, 0, 0.4)',
            }}
          >
            <Printer size={16} /> Imprimir / Salvar PDF
          </button>
        </div>
      </div>
    </div>
  );
};
