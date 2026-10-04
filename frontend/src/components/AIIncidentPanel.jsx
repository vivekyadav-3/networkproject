import React, { useState } from 'react';
import { BrainCircuit, AlertTriangle, ShieldCheck, Zap, Activity } from 'lucide-react';

export default function AIIncidentPanel({ onIncidentCreated }) {
  const [host, setHost] = useState('gateway-core-01');
  const [latencyMs, setLatencyMs] = useState(480);
  const [packetLossPercent, setPacketLossPercent] = useState(35);
  const [dnsLatencyMs, setDnsLatencyMs] = useState(18);
  const [activeConnections, setActiveConnections] = useState(187);
  const [failedConnections, setFailedConnections] = useState(64);
  const [eventsText, setEventsText] = useState('connection timeout\nHTTP 502 Bad Gateway\nTCP RST received');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [latestAnalysis, setLatestAnalysis] = useState(null);

  // Quick preset buttons to easily simulate network situations
  const applyPreset = (preset) => {
    if (preset === 'degraded') {
      setHost('core-router-01');
      setLatencyMs(450);
      setPacketLossPercent(38);
      setDnsLatencyMs(25);
      setActiveConnections(140);
      setFailedConnections(58);
      setEventsText('Packet drop threshold exceeded\nBGP route flapping\nHigh retransmission rate');
    } else if (preset === 'dns') {
      setHost('auth-service-internal');
      setLatencyMs(45);
      setPacketLossPercent(0);
      setDnsLatencyMs(320);
      setActiveConnections(310);
      setFailedConnections(12);
      setEventsText('DNS query timeout\nFallback resolver delayed');
    } else if (preset === 'normal') {
      setHost('edge-cache-03');
      setLatencyMs(22);
      setPacketLossPercent(0);
      setDnsLatencyMs(12);
      setActiveConnections(420);
      setFailedConnections(0);
      setEventsText('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const events = eventsText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    try {
      const payload = {
        host,
        latencyMs: parseFloat(latencyMs),
        packetLossPercent: parseFloat(packetLossPercent),
        dnsLatencyMs: parseFloat(dnsLatencyMs) || 0,
        activeConnections: parseInt(activeConnections, 10) || 0,
        failedConnections: parseInt(failedConnections, 10) || 0,
        events
      };

      const result = await onIncidentCreated(payload);
      setLatestAnalysis(result);
    } catch (err) {
      setError(err.message || 'Telemetry evaluation failed');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityBadgeClass = (sev) => {
    switch (sev) {
      case 'CRITICAL': return 'badge-critical';
      case 'HIGH': return 'badge-high';
      case 'MEDIUM': return 'badge-medium';
      default: return 'badge-low';
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', marginBottom: '32px' }}>
      {/* Simulation Form Card */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BrainCircuit size={22} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.15rem', margin: 0 }}>Telemetry Ingestion & Jev AI</h2>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>TypeSafe SystemOne</span>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
          Dispatch raw network measurements to Jev. It evaluates <strong>choice</strong> (type), <strong>score</strong> (severity), and <strong>noul</strong> (escalation).
        </p>

        {/* Preset Simulators */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <button type="button" onClick={() => applyPreset('degraded')} className="btn-secondary" style={{ fontSize: '0.75rem', padding: '6px 10px' }}>
            Simulate Degradation
          </button>
          <button type="button" onClick={() => applyPreset('dns')} className="btn-secondary" style={{ fontSize: '0.75rem', padding: '6px 10px' }}>
            Simulate DNS Lag
          </button>
          <button type="button" onClick={() => applyPreset('normal')} className="btn-secondary" style={{ fontSize: '0.75rem', padding: '6px 10px' }}>
            Simulate Healthy
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '4px' }}>Target Host / Device</label>
            <input
              type="text"
              required
              className="form-input"
              value={host}
              onChange={e => setHost(e.target.value)}
              placeholder="e.g. gateway-core-01"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '4px' }}>Latency (ms)</label>
              <input
                type="number"
                step="any"
                required
                className="form-input"
                value={latencyMs}
                onChange={e => setLatencyMs(e.target.value)}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '4px' }}>Packet Loss (%)</label>
              <input
                type="number"
                step="any"
                required
                className="form-input"
                value={packetLossPercent}
                onChange={e => setPacketLossPercent(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '4px' }}>DNS Latency (ms)</label>
              <input
                type="number"
                step="any"
                className="form-input"
                value={dnsLatencyMs}
                onChange={e => setDnsLatencyMs(e.target.value)}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '4px' }}>Failed TCP Conns</label>
              <input
                type="number"
                className="form-input"
                value={failedConnections}
                onChange={e => setFailedConnections(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '4px' }}>Raw Events (1 per line)</label>
            <textarea
              rows={3}
              className="form-input"
              value={eventsText}
              onChange={e => setEventsText(e.target.value)}
              placeholder="e.g. connection timeout"
              style={{ resize: 'vertical' }}
            />
          </div>

          {error && (
            <div style={{ padding: '8px 12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--accent-red)', borderRadius: '6px', color: 'var(--accent-red)', fontSize: '0.8rem' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ marginTop: '8px', width: '100%', justifyContent: 'center' }}
          >
            {loading ? (
              <>
                <Activity className="spinner" size={16} /> Evaluating with Jev AI...
              </>
            ) : (
              <>
                <Zap size={16} /> Run Structured Incident Evaluation
              </>
            )}
          </button>
        </form>
      </div>

      {/* Latest Analysis Results Card */}
      <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.15rem', margin: 0 }}>Typed Decision Output</h2>
          {latestAnalysis && (
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>Incident #{latestAnalysis.id}</span>
          )}
        </div>

        {latestAnalysis ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', flex: 1, justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Host and Escalation Banner */}
              <div style={{
                padding: '14px 16px',
                borderRadius: '8px',
                border: latestAnalysis.requiresEscalation ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(34, 197, 94, 0.4)',
                backgroundColor: latestAnalysis.requiresEscalation ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                {latestAnalysis.requiresEscalation ? (
                  <AlertTriangle size={24} color="var(--accent-red)" />
                ) : (
                  <ShieldCheck size={24} color="var(--accent-green)" />
                )}
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                    {latestAnalysis.requiresEscalation ? 'Immediate Escalation Required' : 'Automated Handling / Nominal'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Target: <strong>{latestAnalysis.host}</strong>
                  </div>
                </div>
              </div>

              {/* 3 Jev Typed Decisions Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {/* Decision 1: Choice (Incident Type) */}
                <div style={{ background: 'var(--bg-card-subtle)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Choice: Incident Type</div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '4px' }}>
                    {latestAnalysis.incidentType}
                  </div>
                </div>

                {/* Decision 2: Score (Severity) */}
                <div style={{ background: 'var(--bg-card-subtle)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Score: Severity</div>
                  <div style={{ marginTop: '4px' }}>
                    <span className={getSeverityBadgeClass(latestAnalysis.severity)}>
                      {latestAnalysis.severity}
                    </span>
                  </div>
                </div>

                {/* Decision 3: Noul (Escalation) */}
                <div style={{ background: 'var(--bg-card-subtle)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Noul: Escalate</div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: latestAnalysis.requiresEscalation ? 'var(--accent-red)' : 'var(--accent-green)', marginTop: '4px' }}>
                    {latestAnalysis.requiresEscalation ? 'YES (TRUE)' : 'NO (FALSE)'}
                  </div>
                </div>
              </div>

              {/* Confidence metric */}
              <div style={{ background: 'var(--bg-card-subtle)', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-dim)' }}>Decision Confidence</span>
                  <span style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>
                    {Math.round((latestAnalysis.confidence || 0.85) * 100)}%
                  </span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${Math.round((latestAnalysis.confidence || 0.85) * 100)}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-blue))',
                    borderRadius: '3px'
                  }}></div>
                </div>
              </div>

              {/* Summary / Reasoning */}
              <div style={{ background: 'var(--bg-card-subtle)', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '4px' }}>AI Reasoning & Diagnostics</div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                  {latestAnalysis.summary}
                </p>
              </div>
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textAlign: 'right' }}>
              Recorded at: {new Date(latestAnalysis.createdAt).toLocaleTimeString()}
            </div>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            color: 'var(--text-dim)',
            textAlign: 'center',
            padding: '32px'
          }}>
            <BrainCircuit size={48} strokeWidth={1.5} style={{ opacity: 0.3, marginBottom: '12px' }} />
            <p style={{ margin: 0, fontSize: '0.9rem' }}>No telemetry evaluation run yet.</p>
            <p style={{ margin: '4px 0 0', fontSize: '0.75rem' }}>Select a preset on the left or enter metrics and click evaluate.</p>
          </div>
        )}
      </div>
    </div>
  );
}
