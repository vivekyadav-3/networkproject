# 🌐 NetPulse — Network Monitoring & Incident Intelligence Platform

NetPulse is a full-stack network device management and incident intelligence platform built with **Spring Boot 3** and **React 19 (Vite)**. It blends deterministic network telemetry analysis with **Jev AI's TypeSafe SystemOne typed structured decision model** (`choice`, `score`, and `noul` evaluations) for automated classification, severity scoring, and operational incident escalation.

---

## 🚀 Key Features

- **📡 Device Inventory Management**:
  - Full CRUD lifecycle for network devices (Routers, Switches, Firewalls, Servers, Access Points).
  - Track IP addresses, MAC addresses, status (`ONLINE`, `OFFLINE`, `MAINTENANCE`), and hardware types.
- **🧠 Jev AI Structured Incident Intelligence**:
  - Ingests raw telemetry: latency, packet loss, DNS resolution times, active/failed TCP socket connections, and system event logs.
  - **Three Typed Decisions in One Pass**:
    1. **Choice** (`incident_type`): `NETWORK_DEGRADATION`, `DNS_FAILURE`, `CONNECTION_FAILURE`, `SERVER_UNAVAILABLE`, `UNKNOWN`.
    2. **Score** (`severity`): `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`.
    3. **Noul** (`requires_escalation`): Boolean (`true`/`false`) determining whether on-call intervention is mandatory.
  - Returns confidence percentages and transparent diagnostic reasoning.
  - **Deterministic Fast-Path**: Purely nominal metrics skip LLM calls, saving latency and tokens.
- **📜 Incident Intelligence Ledger & History**:
  - Persists all detected incidents in JPA/database with full audit trail.
  - Real-time status progression (`OPEN` ➔ `RESOLVED` ➔ `UNDER_REVIEW`).
- **🧮 IPv4 Subnet & CIDR Calculator**:
  - Real-time bitwise calculation of network IDs, broadcast domains, subnet masks, usable host ranges, and host counts.
- **✨ Modern Glassmorphic Dashboard**:
  - Dark-mode responsive UI powered by React 19 and Lucide icons.

---

## 🛠️ Architecture & Tech Stack

```text
  [ Telemetry Probes ] 
          │  (Latency, Packet Loss, DNS, TCP)
          ▼
  [ Deterministic Rule Engine ] ── Nominal ──► Fast OK (No AI)
          │ (Anomalies detected)
          ▼
  [ Jev Service & Jev Client ] 
          │ (POST /v1/systemone)
          ▼
  [ Jev AI Structured Decision ]
     ├── Choice: Incident Type
     ├── Score: Severity Level
     └── Noul: Human Escalation (Yes/No)
          │
          ▼
  [ Incident DB & React Dashboard ]
```

### Backend
- **Framework:** Spring Boot 3.2.4 (Java 17)
- **AI Decision Engine:** Jev AI SystemOne API (TypeSafe)
- **HTTP Client:** Spring `RestClient` with Bearer token authentication
- **Database:** H2 In-Memory (development) / PostgreSQL-ready
- **Persistence:** Spring Data JPA / Hibernate
- **Validation:** Jakarta Bean Validation (JSR-380)

### Frontend
- **Framework:** React 19 + Vite
- **Icons:** Lucide React
- **Styling:** Modern Vanilla CSS Glassmorphism

---

## 📁 Project Structure

```text
├── backend/
│   ├── src/main/java/com/netpulse/
│   │   ├── config/             # CORS and RestClient beans
│   │   ├── controller/         # REST Controllers (Device, Subnet, JevController)
│   │   ├── dto/                # Request & Response DTOs (JevDecision, NetworkIncident)
│   │   ├── entity/             # JPA Entities (Device, Incident, Enums)
│   │   ├── exception/          # Global Exception Handler
│   │   ├── repository/         # DeviceRepository & IncidentRepository
│   │   └── service/            # DeviceService, JevClient, JevService, IncidentAnalysisService
│   ├── src/main/resources/     # application.properties
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/         # DeviceTable, AIIncidentPanel, IncidentHistory, SubnetCalculator
│   │   ├── App.jsx             # Main Dashboard orchestrator
│   │   ├── api.js              # Full backend REST client
│   │   └── index.css           # Glassmorphism design system
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## ⚡ Getting Started

### 1. Environment Setup

Set your Jev API key as an environment variable (never commit keys to source code):

**Windows PowerShell:**
```powershell
$env:JEV_API_KEY="your_jev_api_key_here"
```

**Linux / macOS:**
```bash
export JEV_API_KEY="your_jev_api_key_here"
```

---

### 2. Start the Backend

```bash
cd backend
mvn clean spring-boot:run
```

- Server runs at: `http://localhost:8080`
- H2 Console: `http://localhost:8080/h2-console` (`jdbc:h2:mem:netpulsedb`, user: `sa`, no password)

---

### 3. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

- Dashboard opens at: `http://localhost:5173`

---

## 🔌 API Endpoints

### 🧠 Jev AI Incident Intelligence (`/api/ai`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/ai/analyze` | Ingests telemetry, runs Jev structured decision, and records incident |
| `GET` | `/api/ai/incidents` | Returns all logged incidents ordered by creation time |
| `GET` | `/api/ai/incidents/{id}` | Fetches detailed incident by ID |
| `PATCH` | `/api/ai/incidents/{id}/status?status={STATUS}` | Updates incident lifecycle (`OPEN`, `RESOLVED`, `UNDER_REVIEW`) |

#### Example Incident Analysis Request:
```json
{
  "host": "core-router-01",
  "latencyMs": 480.0,
  "packetLossPercent": 35.0,
  "dnsLatencyMs": 18.0,
  "activeConnections": 187,
  "failedConnections": 64,
  "events": ["connection timeout", "HTTP 502 Bad Gateway", "TCP RST"]
}
```

#### Example Jev Output:
```json
{
  "id": 1,
  "host": "core-router-01",
  "incidentType": "NETWORK_DEGRADATION",
  "severity": "CRITICAL",
  "confidence": 0.94,
  "requiresEscalation": true,
  "status": "OPEN",
  "summary": "High latency (480ms) and 35% packet loss indicating severe upstream degradation.",
  "createdAt": "2026-10-04T13:50:00"
}
```

### 📡 Device Management (`/api/devices`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/devices` | List all network devices |
| `POST` | `/api/devices` | Register a new device |
| `GET` | `/api/devices/{id}` | Retrieve device by ID |
| `PUT` | `/api/devices/{id}` | Update device info |
| `DELETE` | `/api/devices/{id}` | Remove device |

### 🧮 Subnet Calculator (`/api/subnet`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/subnet/calculate` | Calculate network, broadcast, and usable host range from IP & CIDR |

---

## 🛡️ License

MIT License &copy; 2026 Vivek Yadav
