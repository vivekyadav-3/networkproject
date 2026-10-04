# 🌐 NetPulse — Network Monitoring & Topology Management System

NetPulse is a full-stack network device management and subnet utility platform built with **Spring Boot** and **React (Vite)**. It provides real-time oversight of network infrastructure, device status tracking, and automated IPv4 CIDR subnet calculation.

---

## 🚀 Features

- **Device Inventory Management**: Add, view, edit, and delete network devices (Routers, Switches, Firewalls, Access Points, Servers).
- **Status & Health Monitoring**: Categorize and filter devices by status (`ONLINE`, `OFFLINE`, `MAINTENANCE`, `DEGRADED`).
- **Interactive Subnet Calculator**:
  - Computes Network Address, Broadcast Address, Netmask, CIDR prefix.
  - Generates usable host IP range and total usable host count.
- **Modern Responsive Dashboard**: Clean UI built with React 19, Lucide icons, and responsive CSS styling.
- **RESTful Architecture**: Clean Spring Boot REST APIs with comprehensive DTO validation and global exception handling.

---

## 🛠️ Tech Stack

### Backend
- **Framework:** Spring Boot 3.2.4 (Java 17)
- **Database:** H2 In-Memory (development) / PostgreSQL-ready
- **Persistence:** Spring Data JPA / Hibernate
- **Validation:** Jakarta Bean Validation (JSR-380)
- **Build Tool:** Maven

### Frontend
- **Framework:** React 19 + Vite
- **Icons:** Lucide React
- **Styling:** Modern Vanilla CSS (Dark/Modern theme)
- **HTTP Client:** Fetch API with CORS integration

---

## 📁 Project Structure

```text
├── backend/
│   ├── src/main/java/com/netpulse/
│   │   ├── config/             # CORS configuration
│   │   ├── controller/         # REST Controllers (Device, Subnet)
│   │   ├── dto/                # Request & Response DTOs
│   │   ├── entity/             # JPA Entities (Device, Enums)
│   │   ├── exception/          # Global Exception Handler & Custom Errors
│   │   ├── repository/         # Spring Data JPA Repositories
│   │   └── service/            # Business Logic & Subnet Calculator
│   ├── src/main/resources/     # Application Properties & DB Config
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/         # Navbar, DeviceTable, AddDeviceModal, SubnetCalculator
│   │   ├── App.jsx             # Main Dashboard view
│   │   ├── api.js              # Backend API integration
│   │   └── index.css           # Design system & styles
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## ⚡ Getting Started

### Prerequisites
- **Java**: JDK 17 or higher
- **Maven**: 3.8+ (or Maven wrapper)
- **Node.js**: 18+ and npm

---

### 1. Run the Backend

```bash
# Navigate to backend directory
cd backend

# Build and run with Maven
mvn clean spring-boot:run
```

- Backend server starts at: `http://localhost:8080`
- H2 Database Console: `http://localhost:8080/h2-console`
  - **JDBC URL:** `jdbc:h2:mem:netpulsedb`
  - **Username:** `sa`
  - **Password:** *(empty)*

---

### 2. Run the Frontend

```bash
# In a new terminal, navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

- Frontend interface will be available at: `http://localhost:5173`

---

## 🔌 API Endpoints

### 📡 Device Management (`/api/devices`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/devices` | List all network devices |
| `POST` | `/api/devices` | Register a new device |
| `GET` | `/api/devices/{id}` | Retrieve device details by ID |
| `PUT` | `/api/devices/{id}` | Update device information |
| `DELETE` | `/api/devices/{id}` | Remove a device |
| `GET` | `/api/devices/status/{status}` | Filter devices by status |
| `GET` | `/api/devices/type/{type}` | Filter devices by device type |

### 🧮 Subnet Calculator (`/api/subnet`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/subnet/calculate` | Calculate network, broadcast, and host range from IP & CIDR |

#### Example Subnet Request:
```json
{
  "ipAddress": "192.168.1.10",
  "cidr": 24
}
```

#### Example Subnet Response:
```json
{
  "networkAddress": "192.168.1.0",
  "broadcastAddress": "192.168.1.255",
  "subnetMask": "255.255.255.0",
  "cidr": 24,
  "usableHostRange": "192.168.1.1 - 192.168.1.254",
  "totalHosts": 256,
  "usableHosts": 254
}
```

---

## 🛡️ License

This project is licensed under the MIT License - see the LICENSE file for details.
