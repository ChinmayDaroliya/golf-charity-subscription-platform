# 🚀 Golf Charity Subscription Platform

[![Deployment Status](https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel)](https://golf-charity-subscription-platform-jet.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-App_Router-black?logo=next.js)](https://nextjs.org/)
[![Database](https://img.shields.io/badge/Database-Supabase-green?logo=supabase)](https://supabase.com/)
[![Auth](https://img.shields.io/badge/Auth-Clerk-blue?logo=clerk)](https://clerk.dev/)

A modern, full-stack Gamified SaaS platform designed for golf enthusiasts to subscribe, manage their scores, participate in randomized reward draws, and contribute a percentage of their subscription completely to their selected charities.

**Live Demo:** [https://golf-charity-subscription-platform-jet.vercel.app/](https://golf-charity-subscription-platform-jet.vercel.app/)

---

## 🎯 Features & Core Systems

### 1. 🔐 Authentication System 
Powered by **Clerk** to handle seamless User Sessions, seamless Sign Up, and Secure Login interactions out of the box, auto-syncing session user metadata into the Postgres Database.

### 2. 💳 Simulated Subscription System
MVP implementation handling the subscription logic natively. Users can easily initiate subscriptions, set their preferred billing interval (Monthly / Yearly), and immediately gain access to the restricted dashboard zones natively simulated without requiring active payment gateway (Stripe) credentials.

### 3. 📊 Score Management System
A dynamic API layer where users can confidently load and store their scores (valued securely between 1-45). 
- Designed with strict data limits: **Only the 5 most recent scores are stored**. If a 6th score is entered, the platform inherently deletes your oldest score sequentially.

### 4. 🎲 Gamified Draw System (Admin Operated)
An algorithmic probability draw executed natively by admins to dispense randomized winning digits against active users.
- **Strict Eligibility Requirement:** Only users explicitly possessing active subscriptions *and* strictly 5 submitted scores enter the draw.
- **Match Counting Engine:** Predictively checks the Random Draw Array against User Arrays for overlapping values, distributing simulated prize rewards hierarchically:
  - 5 Matches ➔ Splits 40% of the Prize Pool
  - 4 Matches ➔ Splits 35% of the Prize Pool
  - 3 Matches ➔ Splits 25% of the Prize Pool

### 5. 💙 Charity Ecosystem
Every finalized subscription carries a noble cause. Users actively designate a custom percentage (Minimum 10%) of their billing explicitly toward a dedicated, validated charity stored natively via the platform ecosystem.

### 6. 🛠 Secure Admin Panel
Protected Route configuration explicitly restricting unauthorized visits. Admins command unrestricted access to systematically manage: 
- Global App Users & Subscriptions statuses
- Integrated Charities (Create/Read/Update/Delete)
- Draw Execution Events (Trigger "Run Draw")
- Total Analytics around Winners and distributed earnings

---

## 💻 Technology Stack

* **Frontend:** Next.js (App Router), React, Tailwind CSS, Shadcn UI, Framer Motion
* **Backend:** Next.js Serverless API Routes
* **Database:** Supabase (PostgreSQL)
* **Authentication:** Clerk Auth
* **Deployment:** Vercel

---

## 📂 Project Structure

```bash
/src
 ├── /app
 │    ├── /admin                # Protected admin portal routing & configurations
 │    ├── /api                  # Backend routes (charities, draw, scores, user, webhooks)
 │    ├── /dashboard            # Core authenticated user hub (Scores, Checkout, Winnings)
 │    ├── /sign-in              # Auth routes
 │    ├── layout.tsx            # Global structural configurations
 │    └── page.tsx              # Main public marketing landing page
 │
 ├── /components                # Shadcn primitives + reusable client logic pieces
 │
 └── /lib
      ├── /supabase             # Instantiated Supabase Admin/Client SDKs
      └── utils.ts              # System calculation abstractions and class mergers
```

---

## ⚙️ Engineering Principles

Developed strictly adhering to precise MVP mandates: prioritizing a seamlessly fully configured algorithmic database design, immaculate UX responsiveness via client state interactions, and error-proof conditional architectures, effectively prioritizing immediate core usability and platform stability over unnecessary abstraction loops.
