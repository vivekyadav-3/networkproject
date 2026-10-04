import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

export default function AddDeviceModal({ isOpen, onClose, onAddDevice }) {
  const [formData, setFormData] = useState({
    hostname: '',
    ipAddress: '',
    macAddress: '',
    deviceType: 'ROUTER',
    status: 'ONLINE'
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await onAddDevice(formData);
      setFormData({
        hostname: '',
        ipAddress: '',
        macAddress: '',
        deviceType: 'ROUTER',
        status: 'ONLINE'
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Error creating device');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '16px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '520px',
        width: '100%',
        padding: '28px',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 6px 0' }}>
          Register Network Device
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', margin: '0 0 20px 0' }}>
          Enter the device details to add it to NetPulse monitoring.
        </p>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(244, 63, 94, 0.12)',
            color: '#fb7185',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: '8px',
            padding: '10px 14px',
            fontSize: '0.85rem',
            marginBottom: '16px'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
              Hostname *
            </label>
            <input
              type="text"
              name="hostname"
              value={formData.hostname}
              onChange={handleChange}
              placeholder="e.g. Core-Router-01"
              required
              className="form-input"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
              IPv4 Address *
            </label>
            <input
              type="text"
              name="ipAddress"
              value={formData.ipAddress}
              onChange={handleChange}
              placeholder="e.g. 192.168.1.1"
              required
              className="form-input"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
              MAC Address (Optional)
            </label>
            <input
              type="text"
              name="macAddress"
              value={formData.macAddress}
              onChange={handleChange}
              placeholder="e.g. 00:1A:2B:3C:4D:5E"
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
                Device Type
              </label>
              <select
                name="deviceType"
                value={formData.deviceType}
                onChange={handleChange}
                className="form-select"
              >
                <option value="ROUTER">Router</option>
                <option value="SWITCH">Switch</option>
                <option value="FIREWALL">Firewall</option>
                <option value="SERVER">Server</option>
                <option value="ACCESS_POINT">Access Point</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select"
              >
                <option value="ONLINE">Online</option>
                <option value="OFFLINE">Offline</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Registering...' : 'Save Device'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
