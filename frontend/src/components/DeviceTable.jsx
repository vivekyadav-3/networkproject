import React from 'react';
import { Router, Cpu, Shield, Server, Laptop, Trash2, Filter } from 'lucide-react';

const getDeviceIcon = (type) => {
  switch (type) {
    case 'ROUTER':
      return <Router size={18} style={{ color: 'var(--accent-cyan)' }} />;
    case 'SWITCH':
      return <Cpu size={18} style={{ color: 'var(--accent-blue)' }} />;
    case 'FIREWALL':
      return <Shield size={18} style={{ color: 'var(--accent-rose)' }} />;
    case 'SERVER':
      return <Server size={18} style={{ color: 'var(--accent-emerald)' }} />;
    default:
      return <Laptop size={18} style={{ color: 'var(--accent-amber)' }} />;
  }
};

export default function DeviceTable({ devices, onDelete, filterStatus, setFilterStatus, onOpenAddModal }) {
  const filteredDevices = filterStatus === 'ALL'
    ? devices
    : devices.filter(d => d.status === filterStatus);

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      {/* Table Header / Action Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '20px'
      }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Device Inventory</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Managed network nodes, interfaces, and operational status
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} style={{ color: 'var(--text-dim)' }} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="form-select"
              style={{ width: 'auto', padding: '8px 12px', fontSize: '0.85rem' }}
            >
              <option value="ALL">All Statuses</option>
              <option value="ONLINE">Online Only</option>
              <option value="OFFLINE">Offline Only</option>
            </select>
          </div>

          <button onClick={onOpenAddModal} className="btn-primary">
            + Add Device
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 16px' }}>Device</th>
              <th style={{ padding: '12px 16px' }}>IP Address</th>
              <th style={{ padding: '12px 16px' }}>MAC Address</th>
              <th style={{ padding: '12px 16px' }}>Type</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDevices.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '36px', textAlign: 'center', color: 'var(--text-dim)' }}>
                  No devices found. Click "+ Add Device" to register a network device.
                </td>
              </tr>
            ) : (
              filteredDevices.map((device) => (
                <tr
                  key={device.id}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        padding: '8px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.04)'
                      }}>
                        {getDeviceIcon(device.deviceType)}
                      </div>
                      <span style={{ fontWeight: 600 }}>{device.hostname}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontSize: '0.88rem', color: 'var(--accent-cyan)' }}>
                    {device.ipAddress}
                  </td>
                  <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {device.macAddress || '—'}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontFamily: 'var(--font-mono)'
                    }}>
                      {device.deviceType}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span className={device.status === 'ONLINE' ? 'badge-online' : 'badge-offline'}>
                      <span className="pulse-dot"></span>
                      {device.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <button
                      onClick={() => onDelete(device.id)}
                      className="btn-danger"
                      title="Delete Device"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
