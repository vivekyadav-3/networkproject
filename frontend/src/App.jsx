import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DeviceTable from './components/DeviceTable';
import AddDeviceModal from './components/AddDeviceModal';
import SubnetCalculator from './components/SubnetCalculator';
import AIIncidentPanel from './components/AIIncidentPanel';
import IncidentHistory from './components/IncidentHistory';
import { api } from './api';
import { Server, CheckCircle2, AlertTriangle, Network, RefreshCw, BrainCircuit } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('devices');
  const [devices, setDevices] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Fetch initial data
  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [devData, incData] = await Promise.all([
        api.getDevices().catch(() => []),
        api.getIncidents().catch(() => [])
      ]);
      setDevices(devData);
      setIncidents(incData);
    } catch (err) {
      setError('Cannot connect to Spring Boot backend at http://localhost:8080. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
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

  const handleIncidentCreated = async (payload) => {
    const newInc = await api.analyzeIncident(payload);
    setIncidents(prev => [newInc, ...prev]);
    return newInc;
  };

  const handleIncidentStatusChange = async (id, status) => {
    const updated = await api.updateIncidentStatus(id, status);
    setIncidents(prev => prev.map(i => (i.id === id ? updated : i)));
  };

  // Metrics
  const totalCount = devices.length;
  const onlineCount = devices.filter(d => d.status === 'ONLINE').length;
  const offlineCount = devices.filter(d => d.status === 'OFFLINE').length;
  const activeIncidentCount = incidents.filter(i => i.status === 'OPEN').length;

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
            padding: '16px 20px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            color: 'var(--accent-red)',
            marginBottom: '24px',
            fontSize: '0.9rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <AlertTriangle size={20} />
              <span>{error}</span>
            </div>
            <button
              onClick={loadData}
              className="btn-secondary"
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            >
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        )}

        {/* Global Network Health Stat Cards */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <div className="card stat-card">
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Total Managed Devices</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '4px' }}>{totalCount}</div>
            </div>
            <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent-cyan)' }}>
              <Server size={24} />
            </div>
          </div>

          <div className="card stat-card">
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Healthy / Online</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-green)', marginTop: '4px' }}>{onlineCount}</div>
            </div>
            <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(34, 197, 94, 0.1)', color: 'var(--accent-green)' }}>
              <CheckCircle2 size={24} />
            </div>
          </div>

          <div className="card stat-card">
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Offline / Critical</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-red)', marginTop: '4px' }}>{offlineCount}</div>
            </div>
            <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-red)' }}>
              <AlertTriangle size={24} />
            </div>
          </div>

          <div className="card stat-card">
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Active AI Incidents</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-cyan)', marginTop: '4px' }}>{activeIncidentCount}</div>
            </div>
            <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent-cyan)' }}>
              <BrainCircuit size={24} />
            </div>
          </div>
        </section>

        {/* Tab 1: Device Inventory */}
        {activeTab === 'devices' && (
          <DeviceTable
            devices={devices}
            loading={loading}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onDeleteDevice={handleDeleteDevice}
          />
        )}

        {/* Tab 2: AI Incident Intelligence */}
        {activeTab === 'ai' && (
          <div>
            <AIIncidentPanel onIncidentCreated={handleIncidentCreated} />
            <IncidentHistory
              incidents={incidents}
              onStatusChange={handleIncidentStatusChange}
            />
          </div>
        )}

        {/* Tab 3: Subnet Calculator */}
        {activeTab === 'subnet' && (
          <SubnetCalculator />
        )}
      </main>

      {/* Add Device Modal */}
      {isAddModalOpen && (
        <AddDeviceModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddDevice}
        />
      )}

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '24px',
        textAlign: 'center',
        color: 'var(--text-dim)',
        fontSize: '0.8rem'
      }}>
        NetPulse Network &copy; {new Date().getFullYear()} — Powered by Spring Boot 3, React 19 & Jev AI Structured Decisions
      </footer>
    </div>
  );
}
