# Project Name
Tick tock

---

## 🛠️ Frameworks & Libraries Used

This project leverages the following major dependencies to ensure scalability, security, and clean responsive styling:

- **Next.js (v16.2.7)** – React framework utilizing the App Router architecture.
- **React & React-DOM (v19.2.4)** – Core library leveraging the latest concurrent features.
- **Next-Auth (v5.0.0-beta.31)** – Edge-compatible, stateless authentication management.
- **Lucide-React (v1.17.0)** – Light, scalable icon family.
- **Clsx (v2.1.1)** – Utility for conditionally constructing CSS class strings.
- **Tailwind-Merge (v3.6.0)** – Intelligently merges Tailwind CSS classes without style conflicts.

---

## 🚀 Setup Instructions

Follow these sequential steps to clone, configure, and boot the application locally:

### 1. Prerequisites

Ensure you have [Node.js](https://nodejs.org) (v18.x or higher recommended) installed.

### 2. Install Dependencies

Run the install command using your chosen package manager inside the project's root folder:

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory and configure your authentication secrets:

```env
AUTH_SECRET="your_generated_random_secret_string"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Run the Development Server

Initiate the compiler to test your project locally:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to view the active build.

---

## 📝 Assumptions & Notes

- **Authentication Architecture:** The project uses Next-Auth v5 (Auth.js), meaning authentication configuration is handled natively in an isolated `auth.ts` config file.
- **Styling Utilities:** `clsx` and `tailwind-merge` work jointly via a standard helper utility (commonly exported as `cn`) to dynamically overwrite utility classes without inflating production CSS bundles.

---

## ⏱️ Time Spent

- **Total Duration:** 5 hours (From 09:30 to 14:30) Saturday(6-6-26)
