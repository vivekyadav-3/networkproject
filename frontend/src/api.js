const BASE_URL = 'http://localhost:8080/api';

export const api = {
  // 1. Fetch all devices
  async getDevices() {
    const res = await fetch(`${BASE_URL}/devices`);
    if (!res.ok) throw new Error('Failed to fetch devices');
    return res.json();
  },

  // 2. Create a new device
  async createDevice(deviceData) {
    const res = await fetch(`${BASE_URL}/devices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deviceData),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to create device');
    }
    return res.json();
  },

  // 3. Delete a device by ID
  async deleteDevice(id) {
    const res = await fetch(`${BASE_URL}/devices/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete device');
  },

  // 4. Calculate Subnet
  async calculateSubnet(calcData) {
    const res = await fetch(`${BASE_URL}/subnet/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(calcData),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || 'Subnet calculation failed');
    }
    return res.json();
  },

  // 5. Analyze telemetry with Jev Structured Decision AI
  async analyzeIncident(telemetryData) {
    const res = await fetch(`${BASE_URL}/ai/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(telemetryData),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || 'Incident analysis failed');
    }
    return res.json();
  },

  // 6. Fetch historical incidents from database
  async getIncidents() {
    const res = await fetch(`${BASE_URL}/ai/incidents`);
    if (!res.ok) throw new Error('Failed to fetch incidents');
    return res.json();
  },

  // 7. Update incident status
  async updateIncidentStatus(id, status) {
    const res = await fetch(`${BASE_URL}/ai/incidents/${id}/status?status=${status}`, {
      method: 'PATCH',
    });
    if (!res.ok) throw new Error('Failed to update incident status');
    return res.json();
  },
};
