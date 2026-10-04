import React from 'react';
import { History, ShieldAlert, CheckCircle, Clock, ArrowRight } from 'lucide-react';

export default function IncidentHistory({ incidents, onStatusChange }) {
  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'CRITICAL': return 'badge-critical';
      case 'HIGH': return 'badge-high';
      case 'MEDIUM': return 'badge-medium';
      default: return 'badge-low';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'RESOLVED':
        return <span style={{ color: 'var(--accent-green)', fontWeight: 600, fontSize: '0.8rem' }}>RESOLVED</span>;
      case 'UNDER_REVIEW':
        return <span style={{ color: 'var(--accent-amber)', fontWeight: 600, fontSize: '0.8rem' }}>UNDER REVIEW</span>;
      default:
        return <span style={{ color: 'var(--accent-red)', fontWeight: 600, fontSize: '0.8rem' }}>OPEN</span>;
    }
  };

  return (
    <div className="card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <History size={20} color="var(--accent-cyan)" />
          <h2 style={{ fontSize: '1.15rem', margin: 0 }}>Incident Intelligence Ledger</h2>
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {incidents.length} incidents logged
        </span>
      </div>

      {incidents.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)' }}>
          <ShieldAlert size={36} style={{ opacity: 0.3, marginBottom: '8px' }} />
          <p>No incidents recorded in the database yet.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)' }}>
                <th style={{ padding: '10px 12px' }}>ID</th>
                <th style={{ padding: '10px 12px' }}>Host</th>
                <th style={{ padding: '10px 12px' }}>Jev Classification</th>
                <th style={{ padding: '10px 12px' }}>Severity</th>
                <th style={{ padding: '10px 12px' }}>Confidence</th>
                <th style={{ padding: '10px 12px' }}>Escalation</th>
                <th style={{ padding: '10px 12px' }}>Metrics</th>
                <th style={{ padding: '10px 12px' }}>Status</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((inc) => (
                <tr
                  key={inc.id}
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.03)',
                    transition: 'background 0.2s',
                  }}
                >
                  <td style={{ padding: '12px', color: 'var(--text-dim)', fontFamily: 'monospace' }}>
                    #{inc.id}
                  </td>
                  <td style={{ padding: '12px', fontWeight: 600, color: 'var(--text-main)' }}>
                    {inc.host}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '4px',
                      background: 'rgba(56, 189, 248, 0.1)',
                      color: 'var(--accent-cyan)',
                      fontSize: '0.78rem',
                      fontFamily: 'monospace'
                    }}>
                      {inc.incidentType}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span className={getSeverityBadge(inc.severity)}>
                      {inc.severity}
                    </span>
                  </td>
                  <td style={{ padding: '12px', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                    {Math.round((inc.confidence || 0) * 100)}%
                  </td>
                  <td style={{ padding: '12px' }}>
                    {inc.requiresEscalation ? (
                      <span style={{ color: 'var(--accent-red)', fontWeight: 600 }}>YES</span>
                    ) : (
                      <span style={{ color: 'var(--text-dim)' }}>NO</span>
                    )}
                  </td>
                  <td style={{ padding: '12px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {inc.latencyMs}ms / {inc.packetLossPercent}% loss
                  </td>
                  <td style={{ padding: '12px' }}>
                    {getStatusBadge(inc.status)}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    {inc.status === 'OPEN' && (
                      <button
                        onClick={() => onStatusChange(inc.id, 'RESOLVED')}
                        className="btn-secondary"
                        style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                      >
                        Resolve
                      </button>
                    )}
                    {inc.status === 'RESOLVED' && (
                      <button
                        onClick={() => onStatusChange(inc.id, 'UNDER_REVIEW')}
                        className="btn-secondary"
                        style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                      >
                        Reopen
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
