# Engineering India Website

Welcome to the **Engineering India Website** repository! This is a modern, high-performance web platform built to handle everything from landing pages to robust administrative dashboards and dynamic event registrations.

📚 **Curious about how this is built?** Check out the [ARCHITECTURE.md](./ARCHITECTURE.md) file for a deep dive into our tech stack and data flow!

---

## 🚀 Quick Start & Installation

To get this project up and running locally, follow these steps:

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v18.17 or higher)
- **pnpm** (Package manager used for this project)
- **Git**

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/ChirayuPatle/Engineering_India_Website.git](https://github.com/ChirayuPatle/Engineering_India_Website)
   cd Engineering_India_Website
   ```

2. **Install dependencies:**
   We strictly use `pnpm` for deterministic dependency resolution.
   ```bash
   pnpm install
   ```

3. **Set up Environment Variables:**
   Copy the example environment file and fill in your local secrets.
   ```bash
   cp .env.example .env
   ```
   *Note: You will need access to Turso (Database), UploadThing (Files), and Better Auth secrets for local development.*

4. **Initialize the Database:**
   Push the latest Drizzle schema to your local or remote Turso database.
   ```bash
   pnpm run db:push
   ```

5. **Start the Development Server:**
   Launch the app locally with Turbopack for lightning-fast hot module replacement!
   ```bash
   pnpm dev
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application!

---

## 🛠️ Available Scripts

- `pnpm dev`: Starts the development server using Turbopack.
- `pnpm build`: Creates an optimized production build.
- `pnpm start`: Starts the production server (requires `pnpm build` first).
- `pnpm lint`: Runs ESLint to catch formatting and code logic issues.
- `pnpm run typecheck`: Validates the codebase using the TypeScript compiler.
- `pnpm run db:push`: Syncs your local Drizzle schema with the Turso database.
- `pnpm run db:studio`: Opens Drizzle Studio to inspect your database visually.

---

## 🤝 Contributing

When contributing to this repository, please ensure that you:
1. Create a descriptive branch name (`feature/my-feature` or `fix/issue-description`).
2. Run `pnpm run typecheck` and `pnpm lint:fix` before committing.
3. Write clear and concise commit messages.

Enjoy building!
