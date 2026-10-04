import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DeviceTable from './components/DeviceTable';
import AddDeviceModal from './components/AddDeviceModal';
import SubnetCalculator from './components/SubnetCalculator';
import { api } from './api';
import { Server, CheckCircle2, AlertTriangle, Network, RefreshCw } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('devices');
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Fetch devices from Spring Boot backend
  const loadDevices = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getDevices();
      setDevices(data);
    } catch (err) {
      setError('Cannot connect to Spring Boot backend at http://localhost:8080. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDevices();
  }, []);

  const handleAddDevice = async (newDeviceData) => {
    const saved = await api.createDevice(newDeviceData);
    setDevices(prev => [...prev, saved]);
  };

  const handleDeleteDevice = async (id) => {
    if (window.confirm('Are you sure you want to remove this device?')) {
      await api.deleteDevice(id);
      setDevices(prev => prev.filter(d => d.id !== id));
    }
  };

  // Metrics
  const totalCount = devices.length;
  const onlineCount = devices.filter(d => d.status === 'ONLINE').length;
  const offlineCount = devices.filter(d => d.status === 'OFFLINE').length;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main style={{ maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '32px 24px', flex: 1 }}>
        {/* Backend Error Banner */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(244, 63, 94, 0.12)',
            color: '#fb7185',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: '12px',
            padding: '14px 18px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertTriangle size={18} />
              <span>{error}</span>
            </div>
            <button onClick={loadDevices} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        )}

        {/* Global Network Overview KPIs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '28px'
        }}>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-dim)', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>TOTAL NODES</span>
              <Server size={18} style={{ color: 'var(--accent-cyan)' }} />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{totalCount}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>Registered hardware units</div>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-dim)', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>ONLINE</span>
              <CheckCircle2 size={18} style={{ color: 'var(--accent-emerald)' }} />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>{onlineCount}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>Active interfaces responding</div>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-dim)', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>OFFLINE</span>
              <AlertTriangle size={18} style={{ color: 'var(--accent-rose)' }} />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: offlineCount > 0 ? 'var(--accent-rose)' : 'var(--text-dim)' }}>
              {offlineCount}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>Requires attention</div>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-dim)', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>ENGINE</span>
              <Network size={18} style={{ color: 'var(--accent-blue)' }} />
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-blue)', marginTop: '6px' }}>CIDR IPv4</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>RFC 3021 compliant</div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'devices' ? (
          <DeviceTable
            devices={devices}
            onDelete={handleDeleteDevice}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        ) : (
          <SubnetCalculator />
        )}
      </main>

      {/* Add Device Modal */}
      <AddDeviceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddDevice={handleAddDevice}
      />
    </div>
  );
}
