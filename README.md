# MoneyNext 💰

**India's First Income-Adaptive Personal Finance Platform**

*Financial Wellness for Every Indian - From Daily Wages to Wealth Management*

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED)](https://www.docker.com/)

---

## 🎯 About MoneyNext

MoneyNext is India's first **income-adaptive personal finance platform** providing completely personalized money management based on your income level. Someone earning ₹20,000/month has different needs than someone earning ₹2,00,000/month - we recognize that.

### 🌟 What Makes Us Different

- **Income-Adaptive UI**: Three distinct experiences for Low, Middle, High income users
- **Localized for India**: Voice expense in Hindi, SMS auto-capture, govt scheme eligibility
- **Financial Inclusion**: Free forever for low-income users (< ₹30,000/month)
- **Real Tools**: Features that matter for YOUR situation

---

## 💡 The Problem & Solution

**82% of Indians** earn < ₹50,000/month, yet most apps target high-income users.

| Income | Monthly | Focus | Price |
|--------|---------|-------|-------|
| **Low** | < ₹30K | Daily tracking, micro-savings, govt schemes | **₹0 Forever** |
| **Middle** | ₹30K-₹1L | Debt optimization, retirement, credit score | ₹99/month |
| **High** | > ₹1L | Estate planning, tax optimization | ₹499/month |

---

## ✨ Features (22 Total)

### Low Income (6 Features)
✅ Micro Savings (₹10/day challenges)  
✅ Voice Expense (Hindi: "Bees rupay chai")  
✅ SMS Auto-Capture (Bank messages)  
✅ Daily Spending Limits (₹200/day cap)  
✅ No-Spend Challenges ("No chai week")  
✅ Govt Schemes (PM-KISAN, Ayushman)  

### Middle Income (9 Features)
✅ EMI Optimizer (₹5L loan = ₹7.2L truth)  
✅ Credit Score Simulator (+45/-80 points)  
✅ Retirement Planner (₹10k SIP = ₹2Cr?)  
✅ Tax Harvesting (Save ₹25k/year)  
✅ Debt Payoff Calculator  
✅ Subscription Tracker (₹2,400/month)  
✅ Budget Categories  
✅ Savings Goals  
✅ Expense Analytics  

### High Income (7 Features)
✅ Estate Planning (₹5Cr tracking)  
✅ Multi-Account Consolidation  
✅ Charitable Tax (₹1L donate = ₹30k save)  
✅ Nominee Management  
✅ Net Worth Dashboard  
✅ Tax Optimizer (80C/80D/80G)  
✅ Investment Portfolio  

---

## 🛠️ Tech Stack

**Frontend**: Next.js 14, TypeScript, Tailwind CSS, Radix UI  
**Backend**: Node.js, Express/NestJS, Prisma  
**Database**: PostgreSQL 15, Redis 7  
**DevOps**: Docker, Vercel, Railway  

---

## 🚀 Quick Start

```bash
git clone https://github.com/Guru2025-KIT/MoneyNext.git
cd MoneyNext
docker compose up -d
docker compose exec backend npx prisma migrate deploy
# Open: http://localhost:3000
```

**Endpoints:**
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`

---

## 📁 Structure

```
MoneyNext/
├── apps/
│   ├── frontend/              # Next.js 14
│   │   └── src/app/
│   │       ├── page.tsx       # Landing
│   │       ├── login/         # Login
│   │       ├── signup/        # Signup
│   │       └── dashboard/
│   │           ├── low/       # Low income
│   │           ├── middle/    # Middle income
│   │           └── high/      # High income
│   └── backend/               # NestJS
│       ├── src/
│       └── prisma/
└── docker-compose.yml
```

---

## 🗺️ Roadmap

### ✅ Phase 1 (Jan 2026)
Three-tier dashboards, auth, expenses, budgets, goals, Docker

### 🚧 Phase 2 (Feb 2026)
Voice Hindi, govt schemes, credit simulator, bank linking, mobile app

### 📅 Phase 3 (March 2026)
AI insights, bill prediction, cashback tracking

---

## 📊 Stats

- **Dev Time**: 8 weeks (Jan-Feb 2026)
- **Features**: 22 across 3 tiers
- **Code**: 15,000+ lines
- **Components**: 50+
- **APIs**: 25+

---


## 📈 Target Impact (2026)

📱 100K+ users | 💰 ₹500Cr+ managed | 💸 ₹10Cr+ saved  
🎯 50K+ free users | 🏛️ 10K+ govt scheme access

---

## 🤝 Contributing

Fork → Branch → Commit → Push → PR

---

## 📄 License

MIT License

---

## 👥 Team

Students passionate about financial inclusion in India

**GitHub**: [@Guru2025-KIT](https://github.com/Guru2025-KIT)
**GitHub**: [@HarshSATHE001](https://github.com/HarshSATHE001)
**GitHub**: [@Dhanvantri37](https://github.com/Dhanvantri37)



---

## 🔮 Vision

**Mission**: Financial wellness for EVERY Indian

**Belief**: Financial inclusion = Right tools for each person

---

**Made with ❤️ for India**

⭐ Star us if MoneyNext helps you!
