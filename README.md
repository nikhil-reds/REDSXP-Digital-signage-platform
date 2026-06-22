# Rubenius — Digital Signage Platform

Rubenius is a white-label, multi-tenant SaaS platform for digital signage powered by industrial-grade **BrightSign** hardware. Businesses (tenants) can upload media, construct playlists, configure sensor-driven edge content rules, schedule screen playback, and deploy content across thousands of displays globally through a single unified dashboard.

---

## Table of Contents
1. [Platform Overview](#1-platform-overview)
2. [Technology Stack](#2-technology-stack)
3. [BrightSign Hardware Support](#3-brightsign-hardware-support)
4. [Sensor Gateways & Edge Intelligence](#4-sensor-gateways--edge-intelligence)
5. [Data Flow Pipelines](#5-data-flow-pipelines)
6. [System Architecture Layers](#6-system-architecture-layers)
7. [Database Schema Design](#7-database-schema-design)
8. [Super Admin Panel Features](#8-super-admin-panel-features)
9. [Tenant Dashboard Features](#9-tenant-dashboard-features)
10. [On-Device Media Player App](#10-on-device-media-player-app)
11. [Tenant Subscription Plans](#11-tenant-subscription-plans)
12. [Sensor Interaction Flows](#12-sensor-interaction-flows)
13. [Scalability Roadmap](#13-scalability-roadmap)
14. [Implementation & Build Phases](#14-implementation--build-phases)
15. [Getting Started (Local Development)](#15-getting-started-local-development)

---

## 1. Platform Overview

Rubenius operates as a white-labeled SaaS platform structure divided into three main operational components:

*   **Super Admin Panel (Rubenius Owned):** Provides a global administrative dashboard to manage all tenants, handle subscriptions and billing, view platform-wide analytics, monitor server/infrastructure health, and impersonate tenant dashboards for support.
*   **Tenant Dashboard (White-Labeled per Client):** A dedicated, branded experience for each business. Tenants manage their own media libraries, create complex schedules, register devices via serial keys, configure interactive sensor rules, and review proof-of-play metrics.
*   **On-Device Media Player App (BrightSign OS):** A hybrid application (HTML5 runtime + Native BrightScript background process) running directly on the edge. It caches the manifest, stores media locally, evaluates sensor logic with sub-200ms latencies, and sends proof-of-play telemetry back to the cloud.

---

## 2. Technology Stack

Built with modern, production-grade tools designed for scalability, low edge latency, and multi-tenant isolation.

| Layer | Technology | Purpose | Key Justification |
| :--- | :--- | :--- | :--- |
| **Frontend — Admin** | Next.js 14 (App Router) | Super Admin SPA | Server-Side Rendering (SSR), React Server Components (RSC). |
| **Frontend — Tenant** | Next.js 14 + Tailwind CSS | White-label Dashboard | Support for custom domains, dynamically injected CSS brand tokens. |
| **State Management** | TanStack React Query | Cache & Server State | Out-of-the-box caching, background synchronization. |
| **Backend API** | NestJS (Node.js) | Core REST + WebSocket | Dependency injection, structured modules, TypeScript-first. |
| **ORM** | Prisma | Database Access Layer | Type-safe schema generation, automatic migration tracking. |
| **Primary Database** | PostgreSQL (AWS RDS) | Relational Storage | Robust transactions, JSONB indices for sensor configurations. |
| **Time-Series DB** | TimescaleDB | Telemetry, Events & Logs | Partitions sensor events & proof-of-play data; aggregates queries. |
| **Cache / Queue** | Redis (AWS ElastiCache) | Session Cache & Job Queue | In-memory token management, BullMQ queue for schedule triggers. |
| **Message Queue** | AWS SQS | Durable Ingestion Buffer | Decouples high-volume device telemetry from primary API writes. |
| **File Storage** | AWS S3 (ap-south-1) | Media Assets Repository | Multi-tenant folder structures, Lifecycle transition rules. |
| **CDN** | AWS CloudFront | Global Edge Delivery | Generates secure signed URLs with 24h TTL; caching in Mumbai PoP. |
| **Real-Time Gateway** | Socket.io (WebSockets) | Screen Connection State | Live online/offline heartbeats, remote restart triggers. |
| **Auth Gateway** | JWT + Refresh Tokens | Auth & Access Security | Separate tokens for user dashboards and physical edge hardware. |
| **Media Processing** | FFmpeg on AWS Lambda | Serverless Transcoding | Automatically converts uploads to BrightSign-compliant H.264 MP4. |
| **Billing Engine** | Razorpay Subscriptions | Payment Processing | Recurrent India-focused gateway, proration handlers, webhook alerts. |

---

## 3. BrightSign Hardware Support

BrightSign manufactures dedicated commercial media players running a custom security-hardened OS. Rubenius communicates directly with these devices over their network APIs, local DWS (Device Web Server), and GPIO/Serial interfaces:

*   **LS Series (Lite — LS424, LS425):** Entry-level systems supporting Full HD 1080p single video outputs. Best suited for basic retail menus and static digital boards.
*   **XD Series (Extended — XD1035, XD1235):** Mid-range systems supporting 4K playback and dual video outputs. Fully equipped with GPIO, USB, and Serial ports.
*   **XT Series (High-End — XT1143, XT1144):** High-performance players supporting 4K HDR playback, interactive HTML5 widgets, and triple video feeds.
*   **XC Series (Enterprise — XC2055, XC4055):** Premium enterprise players capable of driving 8K display canvases and multi-screen video walls.

---

## 4. Sensor Gateways & Edge Intelligence

Physical hardware players connect to external sensors via GPIO pins, RS-232/RS-485 Serial buses, USB, and local network signals (UDP). When these sensors trigger, they emit structured events parsed locally by the BrightScript runtime:

```json
// Example: PIR Motion sensor detects proximity
{ "type": "motion", "detected": true, "ts": 1719055361 }

// Example: Temperature sensor reading
{ "type": "temp", "celsius": 28.4, "humidity": 62.0, "ts": 1719055380 }
```

### Supported Sensors & Interfaces:
1.  **PIR Motion Sensor (GPIO IN):** Detects human presence within 5–10 meters.
2.  **Ultrasonic Distance (RS-232):** Measures exact viewer proximity (in cm).
3.  **Temperature DHT22 (RS-232/I2C):** Evaluates ambient environmental heat.
4.  **Humidity Sensor (RS-232):** Tracks ambient humidity percentage.
5.  **Ambient Light Sensor (GPIO):** Regulates display backlight brightness.
6.  **Sound/Noise Level (GPIO):** Monitors environmental decibels (dB).
7.  **Touchscreen input (USB HID):** Enables interactive wayfinding/kiosks.
8.  **QR/Barcode Scanner (USB Serial):** Scans ticket numbers or product barcodes.
9.  **RFID/NFC Reader (USB/Serial):** Identifies member or loyalty card UIDs.
10. **GPIO Push Button (GPIO IN):** Receives physical input triggers (e.g. "Next slide").
11. **UDP Network Packets (Local LAN):** Coordinates multi-screen triggers or POS notifications.
12. **Serial Bus (RS-232 / RS-485):** Links PLC systems, queues, and automation gear.
13. **GPS Module (Serial):** Provides coordinates for mobile signs (buses, logistics).
14. **Power/Relay Switch (GPIO OUT):** Drives physical elements like backlights, door locks, or bells.
15. **HDMI-CEC Command (HDMI):** Schedules physical screen power-on/off sequences.
16. **People Counter (USB Camera):** Runs computer-vision to track footfall counts locally.

---

## 5. Data Flow Pipelines

Rubenius handles data through four isolated pipelines, separating telemetry writes from media distribution.

### ① Content Delivery Pipeline (Cloud to Edge)
```
[Tenant Dashboard] ──> [NestJS API] ──> [S3 File Upload] ──> [CloudFront CDN]
                               │
                        [PostgreSQL DB] ──> [Job Queue] ──> [BrightSign Player (Manifest Poll)]
```

### ② Sensor Trigger Pipeline (Edge to Cloud)
```
[Sensor Input] ──> [BrightScript Event Handler] ──> [Edge Rule Engine] ──> [Local Content Switch (<200ms)]
                                                                  │
                                                          (Async Batch POST)
                                                                  │
                                                           [AWS SQS Buffer]
                                                                  │
                                                        [TimescaleDB Telemetry]
```

### ③ Real-Time Device Status (Heartbeat)
```
[BrightSign Device] ──(30s POST)──> [NestJS Guard] ──> [Redis Status Cache] ──> [Socket.io Gateway] ──> [Tenant Live UI]
```

### ④ Analytics Ingestion (Telemetry Buffer)
```
[Device Proof-of-Play] ──(5m Batch POST)──> [NestJS Telemetry Receiver] ──> [SQS Ingestion Queue] ──> [Worker Process]
                                                                                                            │
                                                                                                 [TimescaleDB Hypertables]
```

---

## 6. System Architecture Layers

The architecture consists of seven segregated layers, ensuring separation of concerns:

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Layer 7: Edge Runtime (BrightScript + HTML5 App, Local Rules Engine)     │
├─────────────────────────────────────────────────────────────────────────┤
│ Layer 6: Content Delivery Network (AWS CloudFront Signed URLs)          │
├─────────────────────────────────────────────────────────────────────────┐
│ Layer 5: Presentation / Dashboard (Next.js 14 SPA, Tenant Domains)      │
├─────────────────────────────────────────────────────────────────────────┤
│ Layer 4: API & Routing Gateway (NestJS Guard Pipeline, Rate Limiter)     │
├─────────────────────────────────────────────────────────────────────────┤
│ Layer 3: Core Business Services (Scheduling, Sensor Rules, Transcoders)  │
├─────────────────────────────────────────────────────────────────────────┤
│ Layer 2: Job & Event Queues (Redis BullMQ + AWS SQS Telemetry Buffer)   │
├─────────────────────────────────────────────────────────────────────────┤
│ Layer 1: Persistence Storage (PostgreSQL RDS, TimescaleDB, AWS S3)      │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Database Schema Design

Every table is multi-tenant enabled and contains a `tenant_id` foreign key. The application queries use tenant-scoping middleware to filter data automatically at the ORM layer.

```prisma
// Simplified Schema overview (prisma/schema.prisma)

model Tenant {
  id              String        @id @default(uuid())
  name            String
  slug            String        @unique
  customDomain    String?       @map("custom_domain")
  brandLogoUrl    String?       @map("brand_logo_url")
  primaryColor    String        @default("#1A4E8C") @map("primary_color")
  plan            SubscriptionPlan
  razorpaySubId   String?       @map("razorpay_sub_id")
  status          TenantStatus  @default(ACTIVE)
  createdAt       DateTime      @default(now()) @map("created_at")
  devices         Device[]
  mediaAssets     MediaAsset[]
  
  @@map("tenants")
}

model Device {
  id                String        @id @default(uuid())
  tenantId          String        @map("tenant_id")
  serialNumber      String        @unique @map("serial_number")
  deviceToken       String        @map("device_token")
  model             String
  name              String
  location          String?
  firmwareVersion   String?       @map("firmware_version")
  lastSeen          DateTime?     @map("last_seen")
  status            DeviceStatus  @default(OFFLINE)
  currentPlaylistId String?       @map("current_playlist_id")
  tenant            Tenant        @relation(fields: [tenantId], references: [id])
  sensorRules       SensorRule[]

  @@map("devices")
}

model MediaAsset {
  id          String        @id @default(uuid())
  tenantId    String        @map("tenant_id")
  filename    String
  s3Key       String        @map("s3_key")
  cdnUrl      String        @map("cdn_url")
  type        AssetType
  durationSec Int           @map("duration_sec")
  sizeBytes   BigInt        @map("size_bytes")
  tags        String[]
  createdAt   DateTime      @default(now()) @map("created_at")
  tenant      Tenant        @relation(fields: [tenantId], references: [id])

  @@map("media_assets")
}

model SensorRule {
  id               String   @id @default(uuid())
  tenantId         String   @map("tenant_id")
  deviceId         String   @map("device_id")
  sensorType       String   @map("sensor_type")
  condition        Json     // Injected logic: e.g. { "detected": true }
  action           Json     // Injected action: e.g. { "switch_playlist": "uuid" }
  targetPlaylistId String   @map("target_playlist_id")
  priority         Int      @default(0)
  enabled          Boolean  @default(true)
  device           Device   @relation(fields: [deviceId], references: [id])

  @@map("sensor_rules")
}
```

*Note: Time-series telemetry tables (`sensor_events` and `proof_of_play`) are written directly to **TimescaleDB** hypertables, partitioned by `time` and `tenant_id`.*

---

## 8. Super Admin Panel Features

*   **Tenant Management:** Provision, edit, and suspend tenants. Customize white-label credentials, upload logos, map custom domain records, and configure feature flag thresholds.
*   **Support Impersonation:** Securely impersonate any active tenant session with audit logging to troubleshoot issues in real time.
*   **Billing Infrastructure:** Track Monthly Recurring Revenue (MRR), Lifetime Value (LTV), subscription histories, and Razorpay webhook callback queues.
*   **Global Diagnostics:** View platform-wide resource consumption, active player populations, global CDN bandwidth costs, and TimescaleDB data volume metrics.

---

## 9. Tenant Dashboard Features

*   **Asset Management:** Bulk drag-and-drop file uploaders, automatic serverless transcoding status views, tags, folders, and in-browser content previews.
*   **Playlist Editor:** Dynamic ordering tool. Re-arrange media items, configure transitions, and scale timings per playlist slot.
*   **Scheduling Calendar:** Schedule playlists by day-of-week and hour-of-day. Real-time overlap warning notifications prevent conflicting playback slots.
*   **Device Management:** Hardware registration via serial numbers, real-time online status monitoring, WebSockets commands (reboot, refresh manifest), and physical maps.
*   **Sensor Rule Builder:** Intuitive visual mapping: `IF [sensor_type] [condition] THEN [action] [target_playlist_id]`.
*   **Analytics Reports:** proof-of-play dashboards showing play duration metrics, SLA compliance graphs, QR scan rates, and interaction correlations. Reports are exportable to CSV and PDF formats.

---

## 10. On-Device Media Player App

The client player app runs continuously inside the BrightSign player environment.

### Core Architecture:
*   **Manifest Processing:** Every 60 seconds, the device polls `/api/v1/device/manifest` using its secure hardware-tied token. It compares hashes; if changes are detected, it pulls assets.
*   **Asset Local Cache:** Media assets are pre-fetched over CloudFront signed URLs, checked against SHA-256 hashes, and stored on local flash storage. Playback runs entirely from local memory.
*   **Edge Intelligence Module:** Checks sensor signals locally using the evaluated rules. The player runs a Priority Stack; if multiple rules fire, the highest priority rule wins. The network is bypassable.
*   **Telemetry Processing:** Playback events and sensor logs are buffered on the device and sent as a batch POST request every 5 minutes. If offline, the buffer persists until connection restoration.

### Manifest Payload Sample:
```json
{
  "device_id": "893c5d62-720a-426b-a2c3-1678bfa7604f",
  "manifest_hash": "sha256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "playlist": [
    {
      "media_id": "7611a2f4-8b6b-4e16-bb4d-ef7285d8528f",
      "cdn_url": "https://cdn.rubenius.com/tenant-1/assets/7611a2f4.mp4",
      "duration_sec": 30,
      "checksum": "sha256-b5bb9d8014a0f9b1d61e21e796"
    }
  ],
  "schedule_rules": [
    {
      "days": ["mon", "tue", "wed", "thu", "fri"],
      "start": "09:00",
      "end": "18:00",
      "playlist_id": "358e0a42-7f2a-4db3-bb6c-7f55a1215b22"
    }
  ],
  "sensor_rules": [
    {
      "id": "rule-pir-attract-1",
      "sensor": "pir",
      "condition": { "detected": true },
      "action": { "switch_playlist": "8fa11a43-cf8a-4bb2-aa92-f0441d283c44" },
      "priority": 1
    }
  ]
}
```

---

## 11. Tenant Subscription Plans

All plans are billed monthly in INR (₹) via Razorpay:

| Plan Feature | Starter (₹1,999/mo) | Growth (₹4,999/mo) | Business (₹12,999/mo) | Enterprise (Custom) |
| :--- | :--- | :--- | :--- | :--- |
| **Max Connected Screens** | Up to 5 | Up to 25 | Up to 100 | Unlimited |
| **Cloud Storage Limit** | 10 GB | 50 GB | 250 GB | Custom / Dedicated |
| **Tenant User Seats** | 2 Seats | 5 Seats | 20 Seats | Unlimited |
| **Advanced Scheduling** | Included | Included | Included | Included |
| **Sensor Rules Limit** | Max 2 Rules | Max 10 Rules | Unlimited Rules | Unlimited Rules |
| **Telemetry History** | 30 Days Retention | 90 Days Retention | 365 Days Retention | Unlimited Retention |
| **White-Label Branding**| No | Yes (Basic CSS/Logo) | Yes (Full White-label) | Custom / Isolated |
| **Custom Domain Mapping**| No | No | Yes | Yes |
| **Developer API Access**| None | Read-Only | Read & Write API | Full API + Webhooks |
| **Support SLA** | Email only | Email + Live Chat | Priority SLA | Dedicated CSM |

---

## 12. Sensor Interaction Flows

Detailed walkthroughs of the physical interaction pipelines:

### Scenario A: PIR Motion Sensor (Engagement Trigger)
1.  **Motion Sensor Event:** Passive Infrared sensor wired to GPIO pin 1 transitions to `HIGH` state when a visitor stands in front of the screen.
2.  **Edge Detection:** The BrightScript player captures an `InputChange` event on `roControlPort` at the hardware level (sub-millisecond delay).
3.  **Local Rule Check:** Evaluates matching rules in memory: `IF sensor == pir AND state == HIGH AND time within business_hours`.
4.  **Local Display Switch:** Transitions from the ambient looping playlist to the `PROMO` video in less than 200ms using local flash playback.
5.  **Telemetry Batching:** Records the interaction to the local log buffer: `{ type: "pir", action: "play_promo", ts: 1719055400 }`.
6.  **Reversion Loop:** Reverts to the ambient loop if no motion events occur for 30 consecutive seconds.

### Scenario B: Temperature Sensor (Contextual Advertising)
1.  **Sensor Polling:** The on-device player queries the DHT22 Temperature sensor over Serial RS-232 every 60 seconds.
2.  **Rolling Average Calculation:** Evaluates a rolling window of the last 5 readings. This prevents screen flickering caused by singular temperature spikes.
3.  **Hysteresis Buffer:** Uses buffer thresholds (e.g. cold drinks play at $\ge 20^{\circ}$C, hot drinks play at $\le 18^{\circ}$C) to prevent rapid playlist oscillation.
4.  **Automated Playlist Flip:** Smoothly shifts to the cold-beverage playlist when temperature averages cross the warmth boundary.
5.  **Data Correlation:** Sends temperature readings back with proof-of-play logs to let tenants correlate sales volumes with local temperatures.

### Scenario C: Kiosk Call Button (Immediate Action Kiosk)
1.  **GPIO Push Button:** A customer presses the physical "Call Staff" button, making GPIO pin 2 transition to `HIGH`.
2.  **Hardware Debounce:** The player filters signals within a 50ms window to reject electrical contact bounce.
3.  **On-Screen Confirmer:** Display instantly triggers a pop-up: *"A staff member is on the way."*
4.  **Relay Action:** Closes GPIO Out relay on pin 8 for 2 seconds to fire a buzzer in the service room.
5.  **Immediate API Alert:** Unlike buffered logs, the device triggers an immediate API request: `POST /api/v1/device/alert`.
6.  **WebSockets Broadcast:** The NestJS API receives the alert and broadcasts it using Socket.io to all live tenant dashboards.
7.  **Acknowledge Logging:** The manager acknowledges the notification in the dashboard. The system clears the screen pop-up and logs response timings.

---

## 13. Scalability Roadmap

Designed to support scaling configurations from startup to global enterprise deployments.

### Stage 1: Launch (10 – 500 Screens)
*   **Deployment:** Single NestJS instance deployed via AWS ECS (Fargate).
*   **Database:** A single shared PostgreSQL database instance (AWS RDS t3.medium).
*   **Telemetry:** TimescaleDB enabled directly as an extension inside primary RDS instance.
*   **Cache:** Single-node Redis instance for cached dashboard states and session tokens.

### Stage 2: Growth (500 – 5,000 Screens)
*   **Deployment:** Horizontal scaling configured on AWS ECS (2–5 active tasks).
*   **Database:** Configured read replica instances for PostgreSQL to offload analytical query traffic.
*   **Telemetry:** TimescaleDB partitioned off to a dedicated EC2 compute instance.
*   **Cache:** Enabled Redis cluster architecture with separate read-write setups.
*   **Ingestion:** Implemented AWS SQS queues to batch write operations.

### Stage 3: Scale (5,000 – 50,000 Screens)
*   **Deployment:** Split monolith into dedicated microservices: Core API, Device Gateway, Analytics Engine, and Billing.
*   **Device Isolation:** Isolated device heartbeat handlers onto independent high-throughput servers.
*   **Query Layer:** Integrated connection pooling with PgBouncer.
*   **Aggregates:** TimescaleDB continuous aggregates compute daily dashboards on a schedule.
*   **Transcoder:** Migrated FFmpeg jobs to serverless AWS Lambda pipelines.

### Stage 4: Enterprise (50,000+ Screens)
*   **Deployment:** Run microservices on AWS EKS (Kubernetes) with automatic Pod Scaling.
*   **Messaging:** Event-driven message broker architecture powered by Apache Kafka.
*   **Database:** Migrated to Aurora PostgreSQL Serverless v2.
*   **Tenant Sharding:** Multi-region deployment partitions (Mumbai and Singapore) with database sharding.

---

## 14. Implementation & Build Phases

A 12-week development timeline split into six distinct implementation phases:

*   **Phase 1: Foundation (Weeks 1–2):** AWS infrastructure provisioning, NestJS workspace scaffolding, Prisma entity creation, user authentication guards, and database multi-tenant isolation middleware.
*   **Phase 2: Content Pipeline (Weeks 3–4):** Integration of S3 presigned upload URLs, CloudFront signed URLs, Next.js media library views, playlist builders, and FFmpeg transcoding lambda triggers.
*   **Phase 3: BrightSign Integration (Weeks 5–6):** Development of the BrightScript client framework, manifest synchronization endpoints, hardware authentication handlers, and WebSockets heartbeat gateways.
*   **Phase 4: Scheduling Engine (Weeks 7–8):** Core playlist scheduling systems, Calendar UI views, Redis BullMQ cron job queues, time-zone matching, and collision resolving algorithms.
*   **Phase 5: Sensors & Edge Intelligence (Weeks 9–10):** Edge rule evaluation engines, 15+ sensor parsers, visual rule-builder dashboard, TimescaleDB hypertable setups, and SQS queue setups.
*   **Phase 6: Hardening, Billing & Launch (Weeks 11–12):** proof-of-play dashboard charts, PDF reporting exports, Razorpay payment processing APIs, Super Admin platform dashboards, and E2E system testing.

---

## 15. Getting Started (Local Development)

To run the Next.js development environment locally:

### Prerequisites
*   Node.js 18+
*   NPM or Yarn
*   A running PostgreSQL instance

### Setup
1.  Clone the repository and install dependencies:
    ```bash
    npm install
    ```
2.  Configure environment variables:
    *   Create a `.env` file in the root directory (refer to `.env.example` if available).
3.  Synchronize the database schema:
    ```bash
    npx prisma db push
    ```
4.  Run the development server:
    ```bash
    npm run dev
    ```
5.  Open [http://localhost:3000](http://localhost:3000) with your browser to view the application.
