# Subhvivah - Professional Matrimonial Platform

A high-performance, AI-powered matrimonial platform built with Next.js, Express, and FastAPI.

## 🚀 Features

- **AI-Driven Onboarding**: Two-way registration (Manual or AI Document Parsing).
- **Admin Delegation System**: Role-based verticals (Verification, Support, Sales, Finance).
- **Global Dynamic Theming**: Real-time theme changes with contrast-aware UI.
- **Advanced User Management**: Full CRUD controls and profile verification workflows.
- **Modern UI/UX**: Professional glassmorphism design with traditional Indian aesthetics.

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Zustand, Framer Motion.
- **Backend**: Node.js, Express, Prisma (PostgreSQL).
- **AI Service**: FastAPI, OCR (simulated).

## 🌍 Deployment Guide

### **Step 1: Database Setup**
1. Create a PostgreSQL database on **Neon.tech**, **Supabase**, or **Aiven**.
2. Copy your Connection String (`DATABASE_URL`).

### **Step 2: Backend Deployment (Vercel)**
1. Import this repository into Vercel.
2. Set the **Root Directory** to `apps/backend`.
3. Add these **Environment Variables**:
   - `DATABASE_URL`: Your PostgreSQL connection string.
   - `JWT_SECRET`: A secure random string.
   - `NODE_ENV`: `production`

### **Step 3: Frontend Deployment (Vercel)**
1. Create a new project on Vercel and import the same repository.
2. Set the **Root Directory** to `apps/frontend`.
3. Add this **Environment Variable**:
   - `NEXT_PUBLIC_API_URL`: The URL of your deployed backend.

## 📦 Local Development

1. Install all dependencies:
   ```bash
   npm run install:all
   ```
2. Run the development environment:
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

- `apps/frontend`: Next.js web application.
- `apps/backend`: Express API and Prisma database logic.
- `apps/ai-service`: Python-based AI parsing service.
- `apps/mobile`: React Native mobile application.

---
Built with precision by DevAstra AI.
