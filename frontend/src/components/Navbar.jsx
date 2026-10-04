import React from 'react';
import { Activity, Server, Calculator, BrainCircuit } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      backgroundColor: 'rgba(9, 13, 22, 0.8)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Logo & Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#050b14'
          }}>
            <Activity size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
              Net<span style={{ color: 'var(--accent-cyan)' }}>Pulse</span>
            </h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', margin: 0 }}>
              Network Intelligence & Jev AI Diagnostics
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('devices')}
            className={activeTab === 'devices' ? 'btn-primary' : 'btn-secondary'}
          >
            <Server size={18} />
            Device Inventory
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={activeTab === 'ai' ? 'btn-primary' : 'btn-secondary'}
          >
            <BrainCircuit size={18} />
            AI Incident Intelligence
          </button>

          <button
            onClick={() => setActiveTab('subnet')}
            className={activeTab === 'subnet' ? 'btn-primary' : 'btn-secondary'}
          >
            <Calculator size={18} />
            Subnet Calculator
          </button>
        </nav>

        {/* Status Indicator */}
        <div className="badge-online">
          <span className="pulse-dot"></span>
          Jev SystemOne Ready
        </div>
      </div>
    </header>
  );
}
