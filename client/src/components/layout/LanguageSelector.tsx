import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Language } from '../../i18n';
import { Globe, ChevronDown } from 'lucide-react';

export const LanguageSelector: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { language, setLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (langKey: Language) => {
    setLanguage(langKey);
    setIsOpen(false);
  };

  const current = languages[language];

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn-secondary"
        style={{
          padding: compact ? '6px 10px' : '8px 14px',
          fontSize: '0.82rem',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid var(--border-color)',
          color: 'var(--accent-cyan)',
          cursor: 'pointer',
          borderRadius: '8px',
          fontWeight: 700,
        }}
        title="Alterar Idioma / Change Language"
      >
        <Globe size={14} color="var(--accent-cyan)" />
        <span>{current.flag}</span>
        {!compact && <span>{current.name}</span>}
        <ChevronDown size={12} color="var(--text-muted)" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {isOpen && (
        <div
          className="glass-panel"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            background: 'rgba(6, 8, 19, 0.98)',
            border: '1px solid var(--accent-cyan)',
            borderRadius: '10px',
            padding: '6px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            minWidth: '150px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
            zIndex: 9999,
          }}
        >
          {(Object.keys(languages) as Language[]).map((langKey) => {
            const item = languages[langKey];
            const isSelected = language === langKey;
            return (
              <button
                key={langKey}
                onClick={() => handleSelect(langKey)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  background: isSelected ? 'rgba(0, 242, 254, 0.15)' : 'transparent',
                  color: isSelected ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.84rem',
                  fontWeight: isSelected ? 800 : 500,
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                <span style={{ fontSize: '1rem' }}>{item.flag}</span>
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
