# Streamflow

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Turborepo](https://img.shields.io/badge/Turborepo-EF4444?style=for-the-badge&logo=turborepo&logoColor=white)](https://turbo.build/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)

**Streamflow** is a modern, full-stack video streaming platform architecture built with a focus on scalability, type safety, and developer experience. Leveraging a monorepo structure, it demonstrates how to build and manage a complex ecosystem of applications and shared libraries.

---

## 🚀 Key Features

- **Full-Stack Monorepo**: Managed with **Turborepo** and **pnpm workspaces** for optimized build pipelines and seamless code sharing.
- **End-to-End Type Safety**: Shared **Zod** schemas between the Express API and Next.js frontend ensure 100% data integrity.
- **Video Infrastructure**: Integrated with **Supabase Storage** for resilient video hosting and thumbnail management.
- **Robust Authentication**: Secure JWT-based authentication using **HttpOnly cookies**, mitigating common security vulnerabilities like XSS.
- **Dynamic Content Discovery**: A high-performance feed featuring **cursor-based pagination** for smooth, infinite scrolling.
- **Engagement Engine**: Fully functional subscription system, like/dislike mechanics, and an interactive comment system.
- **Modern UI/UX**: Built with **React 19**, **Tailwind CSS 4**, and **Shadcn/UI**, featuring responsive layouts and optimized client-side state management via **Zustand** and **TanStack Query**.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Library**: React 19
- **Styling**: Tailwind CSS 4 + Shadcn/UI
- **State Management**: Zustand (Global) + TanStack Query (Server State)
- **Forms**: React Hook Form + Zod

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Auth**: JSON Web Tokens (JWT) + Cookie-parser

### Shared & Infrastructure
- **Monorepo Tooling**: Turborepo
- **Package Manager**: pnpm
- **Validation**: Zod
- **Cloud Services**: Supabase (Storage & Auth integration)

---

## 🏗 Architecture Overview

The project is structured as a monorepo to promote modularity and reusability:

```text
streamflow/
├── apps/
│   ├── web/                # Next.js frontend application
│   └── api/                # Express.js RESTful API
├── packages/
│   ├── validation/         # Shared Zod schemas for request/response validation
│   ├── ui/                 # Shared React component library
│   ├── typescript-config/  # Centrally managed TS configurations
│   └── eslint-config/      # Shared linting rules
└── turbo.json              # Turborepo task orchestration
```

### Technical Highlights

1.  **Shared Validation Logic**: By housing Zod schemas in `@streamflow/validation`, both the frontend (forms) and backend (request bodies) use the exact same source of truth for data validation.
2.  **Optimized Data Fetching**: Utilizing TanStack Query's `useInfiniteQuery` for cursor-based pagination reduces server load and provides a snappy user experience.
3.  **Secure by Design**: Auth tokens are never stored in `localStorage`. Instead, the API issues HttpOnly, Secure, and SameSite cookies, ensuring a high security posture.

---

## ⚙️ Getting Started

### Prerequisites
- Node.js >= 18
- pnpm 9.x
- PostgreSQL instance
- Supabase project (for storage)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/streamflow.git
    cd streamflow
    ```

2.  **Install dependencies**:
    ```bash
    pnpm install
    ```

3.  **Environment Setup**:
    - Navigate to `apps/api/` and create a `.env` file based on `.env.example`.
    - Navigate to `apps/web/` and create a `.env.local` file.

4.  **Database Migration**:
    ```bash
    pnpm --filter=api prisma migrate dev
    ```

5.  **Run Development Servers**:
    ```bash
    pnpm dev
    ```
    - Web: `http://localhost:3000`
    - API: `http://localhost:8000`

---

## 🗺 Roadmap

- [ ] **Creator Dashboard**: Detailed analytics and video management for uploaders.
- [ ] **Global Search**: Full-text search implementation for videos and channels.
- [ ] **Watch History**: Cross-device playback history tracking.
- [ ] **Transcoding Pipeline**: Automated video transcoding for adaptive bitrate streaming.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ by [Your Name]
