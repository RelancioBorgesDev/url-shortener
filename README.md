# 🔗 URL Shortener API / API de Encurtador de URLs

<div align="center">

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Fastify](https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white)](https://www.fastify.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Test](https://img.shields.io/badge/Test-Passing-green?style=for-the-badge)]()
[![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)]()

[English](#english) | [Português](#português)

---

## English

A high-performance URL shortener built with Clean Architecture, focusing on observability, security, and scalability.

---

## Português

Um encurtador de URLs de alta performance construído com Arquitetura Limpa, focado em observabilidade, segurança e escalabilidade.

---

## 📋 Table of Contents / Índice

- [Architecture / Arquitetura](#-architecture--arquitetura)
- [Technology Stack / Stack de Tecnologias](#-technology-stack--stack-de-tecnologias)
- [Features / Funcionalidades](#-features--funcionalidades)
- [Getting Started / Primeiros Passos](#-getting-started--primeiros-passos)
- [API Reference / Referência da API](#-api-reference--referência-da-api)
- [Swagger Documentation / Documentação Swagger](#-swagger-documentation--documentação-swagger)
- [Environment Variables / Variáveis de Ambiente](#-environment-variables--variáveis-de-ambiente)
- [Observability / Observabilidade](#-observability--observabilidade)
- [Project Structure / Estrutura do Projeto](#-project-structure--estrutura-do-projeto)
- [Testing / Testes](#-testing--testes)
- [Deployment / Implantação](#-deployment--implantação)

---

## 🏗️ Architecture / Arquitetura

```mermaid
graph TB
    subgraph "Client Layer"
        A[User Browser/Mobile App]
    end

    subgraph "Infrastructure Layer"
        B[Traefik Reverse Proxy]
        C[URL Shortener API]
    end

    subgraph "Data Layer"
        D[PostgreSQL Database]
        E[(In-Memory Cache)]
    end

    subgraph "Observability"
        F[Prometheus]
        G[Grafana]
        H[OpenTelemetry]
        I[Loki]
    end

    A -->|HTTPS Request| B
    B -->|Route to API| C
    C -->|Query| E
    C -->|Query/Write| D
    C -->|Metrics| F
    C -->|Traces| H
    H -->|Store Traces| I
    F -->|Scrape Metrics| G
```

### Request Flow

```mermaid
sequenceDiagram
    participant U as User
    participant T as Traefik
    participant A as API
    participant C as Cache
    participant D as Database

    U->>T: GET /abc123
    T->>A: Forward Request
    A->>C: Check Cache
    alt Cache Hit
        C-->>A: Return URL
    else Cache Miss
        A->>D: Query by short_code
        D-->>A: Return URL
        A->>C: Store in Cache
    end
    A->>A: Track Analytics (Async)
    A-->>U: 302 Redirect to Original URL
```

---

## 🛠️ Technology Stack / Stack de Tecnologias

| Category | Technology | Version | Description |
|----------|------------|---------|-------------|
| **Runtime** | Node.js | 22.x | JavaScript runtime |
| **Language** | TypeScript | 5.x | Type-safe JavaScript |
| **Framework** | Fastify | 5.x | High-performance web framework |
| **Database** | PostgreSQL | 15+ | Relational database |
| **ORM** | Drizzle | 0.44.x | Lightweight TypeScript ORM |
| **Validation** | Zod | 3.x | Schema validation |
| **Container** | Docker | 24.x | Containerization |
| **Reverse Proxy** | Traefik | 3.x | Routing & load balancing |
| **Metrics** | Prometheus | 2.x | Metrics collection |
| **Tracing** | OpenTelemetry | 1.x | Distributed tracing |
| **Logging** | Loki | 2.x | Log aggregation |

### Why These Technologies?

| Technology | Rationale |
|------------|------------|
| **Fastify** | 3-4x faster than Express, built-in TypeScript support, low overhead |
| **Drizzle ORM** | Lightweight, type-safe, SQL-like syntax, excellent performance |
| **PostgreSQL** | Robust ACID compliance, excellent JSON support, mature ecosystem |
| **Traefik** | Automatic service discovery, Let's Encrypt integration, Kubernetes support |
| **OpenTelemetry** | Vendor-neutral, standard for observability |

---

## ✨ Features / Funcionalidades

### Core Features
- ✅ **URL Shortening** - Create short codes with auto-generation
- ✅ **Redirect Tracking** - Track clicks with IP, user-agent, geo data
- ✅ **Analytics** - View click statistics per URL
- ✅ **URL Expiration** - Optional expiration dates
- ✅ **Rate Limiting** - Configurable request limits

### Performance Features
- ⚡ **In-Memory Caching** - 5-minute TTL cache for frequently accessed URLs
- 📊 **Database Indexing** - Optimized indexes on short_code, created_at
- 🔄 **Async Analytics** - Non-blocking analytics tracking

### Security Features
- 🔒 **Input Validation** - Block dangerous protocols (javascript:, data:)
- 🚫 **Private IP Blocking** - Prevent redirection to internal networks
- ✅ **Type-safe** - End-to-end TypeScript with Zod validation

### Observability
- 📈 **Prometheus Metrics** - Request duration, cache hits, URL clicks
- 📝 **Structured Logging** - JSON logs with request correlation
- 🏥 **Health Checks** - Liveness, readiness, and full health endpoints
- 🔍 **OpenTelemetry** - Distributed tracing support

---

## 🚀 Getting Started / Primeiros Passos

### Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 22.x |
| Docker | 24.x |
| Docker Compose | 2.x |
| PostgreSQL | 15+ (optional, via Docker) |

### Quick Start (Development)

```bash
# Clone the repository
git clone <repository-url>
cd url-shortcut

# Install dependencies
npm install

# Start PostgreSQL with Docker
docker-compose up -d postgres

# Run migrations
npx drizzle-kit push

# Start development server
npm run dev
```

### Quick Start (Full Stack)

```bash
# Start all services (API + Database + Traefik)
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

### Environment Setup

Create a `.env` file:

```env
# Server
HOSTNAME=0.0.0.0
PORT=3333
NODE_ENV=development

# Database
POSTGRES_USER=admin
POSTGRES_PASSWORD=secret
POSTGRES_DB=urlshortener
DATABASE_URL=postgresql://admin:secret@localhost:5432/urlshortener

# Rate Limiting
RATE_LIMIT_MAX=1000
RATE_LIMIT_TIME_WINDOW=1 minute
```

---

## 📖 API Reference / Referência da API

### Swagger Documentation / Documentação Swagger

The API includes interactive Swagger documentation for easy exploration and testing.

**Access / Acesso:** `http://localhost:3333/docs`

#### English

The Swagger UI provides:
- Interactive API exploration
- Request/response examples
- Schema validation
- Online testing capabilities

#### Português

O Swagger UI oferece:
- Exploração interativa da API
- Exemplos de requisição/resposta
- Validação de schema
- Capacidades de teste online

---

### Base URL

```
Development: http://localhost:3333
Production:  https://api.yourdomain.com
```

### Endpoints

#### 1. Create Short URL

```http
POST /shorten
Content-Type: application/json

{
  "url": "https://example.com/very/long/url"
}
```

**Response (201 Created)**

```json
{
  "shorten_url": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "originalUrl": "https://example.com/very/long/url",
    "shortCode": "abc123xy",
    "shortUrl": "http://localhost:3333/abc123xy",
    "clicks": 0,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### 2. Redirect to Original URL

```http
GET /{shortCode}
```

**Response:** 302 Found (Redirect to original URL)

#### 3. List All Short URLs

```http
GET /shorten
```

**Response (200 OK)**

```json
{
  "shorten_urls": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "originalUrl": "https://example.com",
      "shortCode": "abc123xy",
      "shortUrl": "http://localhost:3333/abc123xy",
      "clicks": 42,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### 4. Delete Short URL

```http
DELETE /shorten/{shortCode}
```

**Response (200 OK)**

```json
{
  "message": "URL deleted successfully"
}
```

#### 5. Get Analytics

```http
GET /analytics/{shortCode}
```

**Response (200 OK)**

```json
{
  "analytics": {
    "shortCode": "abc123xy",
    "totalClicks": 42,
    "clicksByCountry": {
      "BR": 25,
      "US": 10,
      "PT": 7
    },
    "recentClicks": [
      {
        "ipAddress": "192.168.1.1",
        "userAgent": "Mozilla/5.0...",
        "country": "BR",
        "accessedAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

#### 6. Health Check

```http
GET /health
```

**Response (200 OK)**

```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600.5
}
```

```http
GET /health/live   # Liveness probe
GET /health/ready  # Readiness probe
```

#### 7. Metrics (Prometheus)

```http
GET /metrics
```

**Response**

```
# HELP http_request_duration_seconds Duration of HTTP requests in seconds
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{method="GET",route="/health",status_code="200",le="0.005"} 142

# HELP url_shortener_clicks_total Total number of URL clicks
# TYPE url_shortener_clicks_total counter
url_shortener_clicks_total 1234
```

### Error Responses

| Status | Description |
|--------|-------------|
| 400 | Invalid input / URL validation failed |
| 404 | URL not found or expired |
| 429 | Rate limit exceeded |
| 500 | Internal server error |

---

## ⚙️ Environment Variables / Variáveis de Ambiente

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `HOSTNAME` | string | `0.0.0.0` | Server bind address |
| `PORT` | number | `3333` | Server port |
| `NODE_ENV` | string | `development` | Environment (development/production/test) |
| `DATABASE_URL` | string | - | PostgreSQL connection string |
| `POSTGRES_USER` | string | - | PostgreSQL username |
| `POSTGRES_PASSWORD` | string | - | PostgreSQL password |
| `POSTGRES_DB` | string | - | Database name |
| `RATE_LIMIT_MAX` | number | `1000` | Max requests per window |
| `RATE_LIMIT_TIME_WINDOW` | string | `1 minute` | Rate limit window |

---

## 📊 Observability / Observabilidade

### Metrics Endpoint

Access Prometheus-compatible metrics at `/metrics`:

```bash
curl http://localhost:3333/metrics
```

**Available Metrics:**

| Metric | Type | Description |
|--------|------|-------------|
| `http_request_duration_seconds` | Histogram | Request duration |
| `http_requests_total` | Counter | Total requests |
| `url_shortener_clicks_total` | Counter | Total redirects |
| `url_shortener_urls_created_total` | Counter | URLs created |
| `url_shortener_cache_hits_total` | Counter | Cache hits |
| `url_shortener_cache_misses_total` | Counter | Cache misses |

### Structured Logging

All logs are JSON-formatted with the following structure:

```json
{
  "level": "info",
  "message": "Incoming request",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "context": {
    "service": "url-shortener",
    "requestId": "abc-123-def",
    "method": "GET",
    "url": "/health"
  }
}
```

### Grafana Dashboard

Import the included Grafana dashboard for:
- Request rate and latency
- Cache hit/miss ratio
- URL click trends
- Error rates
- System health

---

## 📁 Project Structure / Estrutura do Projeto

```
url-shortcut/
├── src/
│   ├── core/                      # Core utilities
│   │   ├── entities/              # Base entities
│   │   ├── types/                 # TypeScript types
│   │   └── either.ts              # Either monad
│   │
│   ├── domain/                    # Domain layer (business logic)
│   │   └── urls/
│   │       ├── application/       # Use cases
│   │       │   ├── repositories/  # Repository interfaces
│   │       │   └── use-cases/     # Business operations
│   │       └── enterprise/        # Entities
│   │           └── entities/      # Domain models
│   │
│   ├── infra/                     # Infrastructure layer
│   │   ├── cache/                # Caching (in-memory)
│   │   ├── database/             # Database
│   │   │   ├── repositories/     # Drizzle implementations
│   │   │   ├── schema/           # Table schemas
│   │   │   └── client.ts         # DB client
│   │   ├── env/                  # Environment config
│   │   ├── http/                 # HTTP layer
│   │   │   ├── controllers/      # Request handlers
│   │   │   ├── presenters/       # Response formatters
│   │   │   ├── routes/           # Route definitions
│   │   │   └── server.ts         # Entry point
│   │   ├── logging/              # Structured logger
│   │   ├── metrics/              # Prometheus metrics
│   │   └── utils/                # Utilities
│   │
│   └── types/                     # Global TypeScript types
│
├── test/
│   ├── e2e/                       # End-to-end tests
│   ├── unit/                     # Unit tests
│   └── repositories/             # Test repositories
│
├── config/                        # Configuration files
│   ├── datasources.yml          # Grafana datasources
│   ├── loki.yml                 # Loki config
│   ├── mimir.yml                # Mimir config
│   ├── otel-collector-config.yml
│   ├── prometheus.yml
│   ├── tempo.yml
│   └── traefik.yml
│
├── docker-compose.yml            # Full stack composition
├── Dockerfile                    # Production image
├── drizzle.config.ts             # Drizzle configuration
├── jest.config.ts               # Jest configuration
├── package.json                  # Dependencies
└── tsconfig.json                # TypeScript config
```

### Clean Architecture Layers

```mermaid
graph TB
    subgraph "Domain Layer"
        A[Entities]
        B[Use Cases]
        C[Repository Interfaces]
    end

    subgraph "Application Layer"
        D[Controllers]
        E[Presenters]
    end

    subgraph "Infrastructure Layer"
        F[Database]
        G[Cache]
        H[Metrics]
        I[Logging]
    end

    A --> B
    B --> C
    C --> F
    D --> B
    E --> B
    F --> G
    F --> H
    F --> I
```

---

## 🧪 Testing / Testes

### Run All Tests

```bash
npm test
```

### Run Unit Tests

```bash
npm run test:unit
```

### Run E2E Tests

```bash
npm run test:e2e
```

### Test Coverage

```
Test Suites: 4 passed
Tests:       5 passed
Coverage:    [See Jest output]
```

---

## 🚢 Deployment / Implantação

### Docker Compose (Development)

```bash
docker-compose up -d
```

### Production with Traefik

```yaml
# docker-compose.production.yml
version: '3.8'

services:
  api:
    build: .
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres:5432/urlshortener
      - NODE_ENV=production
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.api.rule=Host(`api.yourdomain.com`)"
      - "traefik.http.routers.api.tls=true"
      - "traefik.http.routers.api.entrypoints=websecure"

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_USER=admin
      - POSTGRES_PASSWORD=secret
      - POSTGRES_DB=urlshortener

  traefik:
    image: traefik:v3.0
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
```

### Kubernetes Deployment

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: url-shortener
spec:
  replicas: 3
  selector:
    matchLabels:
      app: url-shortener
  template:
    spec:
      containers:
        - name: api
          image: url-shortener:latest
          ports:
            - containerPort: 3333
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: url-shortener-secrets
                  key: database-url
          livenessProbe:
            httpGet:
              path: /health/live
              port: 3333
          readinessProbe:
            httpGet:
              path: /health/ready
              port: 3333
```

---

## 🔧 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with watch |
| `npm run start` | Start production server |
| `npm run build` | Build for production |
| `npm run test` | Run all tests |
| `npm run test:unit` | Run unit tests |
| `npm run test:e2e` | Run e2e tests |
| `npm run test:watch` | Run tests in watch mode |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

ISC License - see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- [Fastify](https://www.fastify.io/) - Amazing web framework
- [Drizzle ORM](https://orm.drizzle.team/) - Great TypeScript ORM
- [OpenTelemetry](https://opentelemetry.io/) - Observability standards
- [Traefik](https://traefik.io/) - Excellent reverse proxy
