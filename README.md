# 💍 Subhvivah - Professional Matrimonial Platform

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fchitranjanpro-ship-it%2Fsubhvivah)

A high-performance, AI-powered matrimonial platform built with Next.js 14, Prisma, and PostgreSQL.

## 🚀 Deployment Instructions

This project is optimized for **Vercel** as a single-project Next.js application.

### **Option 1: One-Click Deploy (Recommended)**
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fchitranjanpro-ship-it%2Fsubhvivah)

### **Option 2: Manual Import**
1.  Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New Project"**.
2.  Import the **`subhvivah`** repository.
3.  **Crucial Settings**:
    -   **Framework Preset**: Select **`Next.js`**.
    -   **Root Directory**: Leave it **empty** (or set to `.`). **Do NOT** set it to `apps/frontend`.
4.  **Environment Variables**:
    -   `DATABASE_URL`: Your PostgreSQL connection string.
    -   `JWT_SECRET`: A secure random string.
5.  Click **"Deploy"**. Vercel will automatically build the project and provide a single URL for everything.

## 🛠️ Features

- **Unified Architecture**: Single-project Next.js application with integrated API routes.
- **AI-Driven Onboarding**: Two-way registration (Manual or AI Document Parsing).
- **Admin Delegation System**: Role-based verticals (Verification, Support, Sales, Finance).
- **Global Dynamic Theming**: Real-time theme changes with contrast-aware UI.
- **Advanced User Management**: Full CRUD controls and profile verification workflows.
- **Modern UI/UX**: Professional glassmorphism design with traditional Indian aesthetics.

## 📦 Local Development

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up your `.env` file with `DATABASE_URL` and `JWT_SECRET`.
4.  Generate Prisma client:
    ```bash
    npx prisma generate
    ```
5.  Run the development server:
    ```bash
    npm run dev
    ```

## 🏗️ Project Structure

- `src/app/api`: Next.js API Route Handlers (Unified Backend).
- `src/app/(auth)`: Authentication pages (Login/Register).
- `src/app/admin`: Comprehensive Admin Dashboard.
- `src/app/dashboard`: User-specific dashboard.
- `prisma`: Database schema and migrations.
- `src/server`: Legacy logic consolidated for unified processing.

---
Built with precision by DevAstra AI.
