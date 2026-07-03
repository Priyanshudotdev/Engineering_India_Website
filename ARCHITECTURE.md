# Architecture Overview

This document provides a high-level overview of the architecture, technology stack, and design patterns used in the **Engineering India Website**.

## 🚀 Technology Stack

The project is built on a modern, type-safe full-stack ecosystem inspired by the T3 Stack, heavily customized for our specific needs:

### 1. Core Framework
- **[Next.js 15+ (App Router)](https://nextjs.org/)**: The foundation of our application, providing Server Components, API routes, and advanced routing.
- **[React 19](https://react.dev/)**: Building interactive UIs.
- **[TypeScript](https://www.typescriptlang.org/)**: Ensuring end-to-end type safety.

### 2. Database & ORM
- **[Turso (LibSQL)](https://turso.tech/)**: A distributed edge SQLite database for blazing-fast queries and low latency.
- **[Drizzle ORM](https://orm.drizzle.team/)**: A lightweight, type-safe ORM used to interact with the Turso database. Drizzle handles schema definitions, migrations, and queries natively.

### 3. Authentication & Security
- **[Better Auth](https://better-auth.com/)**: Handling secure user authentication, session management, and OAuth integrations seamlessly within Next.js.
- **[Zod](https://zod.dev/)**: Used extensively for strict schema validation—both for incoming API requests and client-side form submissions.

### 4. Styling & UI Components
- **[Tailwind CSS (v3)](https://tailwindcss.com/)**: Utility-first CSS framework for rapid UI development.
- **[Shadcn UI](https://ui.shadcn.com/)**: Accessible and customizable headless components built on top of Radix UI.
- **[Framer Motion](https://www.framer.com/motion/) & [GSAP](https://gsap.com/)**: Powering complex micro-animations and scroll-based effects for a premium feel.
- **[Lucide React](https://lucide.dev/)**: Clean and consistent iconography.

### 5. Media & Uploads
- **[UploadThing](https://uploadthing.com/)**: Handling secure, scalable file uploads directly to the cloud.
- **[ImageKit](https://imagekit.io/)**: Used for optimized image delivery and real-time transformations.

### 6. Forms & State
- **[React Hook Form](https://react-hook-form.com/)**: For performant, flexible, and extensible forms with easy-to-use validation.
- **[TanStack React Query](https://tanstack.com/query/latest)**: Used in specific client components for asynchronous state management and data fetching.

---

## 📂 Project Structure

```text
src/
├── app/                  # Next.js App Router (Pages, API routes, Layouts)
│   ├── (admin)/          # Admin dashboard routes
│   ├── (public)/         # Public-facing landing pages
│   └── api/              # Backend serverless endpoints
├── components/           # Reusable UI components
│   ├── ui/               # Shadcn and base components
│   └── magicui/          # Complex animated components
├── database/             # Database connection, schemas, and migrations (Drizzle)
├── lib/                  # Utility functions, API wrappers, and constants
├── types/                # Global TypeScript definitions
└── styles/               # Global CSS and Tailwind configurations
```

---

## ⚙️ How It Works

### Server Components vs. Client Components
By default, all pages and components in the `app/` directory are **Server Components**. This means they render on the server, resulting in zero JavaScript sent to the client and incredibly fast load times. 
- We selectively use **Client Components** (via `"use client"`) only when interactivity is required (e.g., forms, animations, `onClick` handlers).

### Data Flow & API
1. **Client to Server**: Forms are validated on the client side using `zod` + `react-hook-form`, then submitted to `/api/*` endpoints.
2. **Server Validation**: The API routes re-validate the incoming payload using the exact same `zod` schema to prevent tampering.
3. **Database Interaction**: Drizzle ORM executes type-safe queries against the Turso database.
4. **Response**: The server responds, and `React Query` (or server actions) updates the UI state accordingly.

### Type Safety Guarantee
Our architecture relies heavily on end-to-end type safety. The database schema defined in Drizzle automatically generates TypeScript types. These types are passed to Zod for runtime validation, ensuring that what the client sends exactly matches what the database expects, catching bugs at compile-time instead of runtime.
