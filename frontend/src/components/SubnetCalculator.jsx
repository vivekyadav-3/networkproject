import React, { useState } from 'react';
import { api } from '../api';
import { Calculator, Network, Globe, Binary, CheckCircle, AlertCircle } from 'lucide-react';

export default function SubnetCalculator() {
  const [ipAddress, setIpAddress] = useState('192.168.1.55');
  const [cidr, setCidr] = useState(24);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCalculate = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await api.calculateSubnet({
        ipAddress: ipAddress.trim(),
        cidr: parseInt(cidr, 10)
      });
      setResult(data);
    } catch (err) {
      setError(err.message || 'Subnet calculation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Input Form Panel */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Calculator size={22} style={{ color: 'var(--accent-cyan)' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>IPv4 Subnet Calculator</h2>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 20px 0' }}>
          Compute network boundaries, broadcast domains, usable host addresses, and bitwise masks using Spring Boot algorithms.
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

        <form onSubmit={handleCalculate} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '16px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
              IP Address
            </label>
            <input
              type="text"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              placeholder="e.g. 192.168.1.55"
              required
              className="form-input"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
              CIDR Prefix (/{cidr})
            </label>
            <input
              type="number"
              min="1"
              max="32"
              value={cidr}
              onChange={(e) => setCidr(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ height: '44px' }}>
            {loading ? 'Calculating...' : 'Calculate'}
          </button>
        </form>
      </div>

      {/* Results Display */}
      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Quick Metrics Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px'
          }}>
            <div className="glass-panel" style={{ padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-dim)', fontSize: '0.8rem', marginBottom: '6px' }}>
                <Network size={16} />
                <span>NETWORK ADDRESS</span>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                {result.networkAddress}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                Subnet Identifier /{result.cidr}
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-dim)', fontSize: '0.8rem', marginBottom: '6px' }}>
                <Globe size={16} />
                <span>BROADCAST ADDRESS</span>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-blue)' }}>
                {result.broadcastAddress}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                All-host broadcast target
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-dim)', fontSize: '0.8rem', marginBottom: '6px' }}>
                <CheckCircle size={16} />
                <span>USABLE HOSTS</span>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-emerald)' }}>
                {result.usableHosts.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                Total: {result.totalHosts.toLocaleString()} addresses
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-dim)', fontSize: '0.8rem', marginBottom: '6px' }}>
                <Binary size={16} />
                <span>IP CLASSIFICATION</span>
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {result.ipClass}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                IPv4 Address Space
              </div>
            </div>
          </div>

          {/* Detailed Breakdown Card */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>
              Address Range & Mask Specification
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>
                  Subnet Mask
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.05rem', fontWeight: 600 }}>
                  {result.subnetMask}
                </span>
              </div>

              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>
                  Wildcard Mask (Inverse)
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.05rem', fontWeight: 600 }}>
                  {result.wildcardMask}
                </span>
              </div>

              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>
                  First Usable Host
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.05rem', fontWeight: 600, color: 'var(--accent-emerald)' }}>
                  {result.firstUsableHost}
                </span>
              </div>

              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>
                  Last Usable Host
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.05rem', fontWeight: 600, color: 'var(--accent-emerald)' }}>
                  {result.lastUsableHost}
                </span>
              </div>
            </div>

            {/* Binary Bit Representation */}
            <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'block', marginBottom: '8px' }}>
                Binary Subnet Mask (Network Bits vs Host Bits)
              </span>
              <div style={{
                backgroundColor: 'rgba(8, 13, 24, 0.8)',
                padding: '12px 16px',
                borderRadius: '8px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.95rem',
                letterSpacing: '0.06em',
                color: 'var(--accent-cyan)',
                overflowX: 'auto'
              }}>
                {result.binarySubnetMask}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
