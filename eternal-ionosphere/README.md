# AI Procurement Sourcing Application

A production-grade full-stack platform for intelligent global supplier discovery, real-time weighted scoring, and automated RFQ generation.

## 🚀 Quick Start

### 1. Start the Antigravity Backend (FastAPI)

Requires Python 3.10+. This runs the AI pipelines (supplier search, RFQ generation, scoring, etc).

```bash
cd backend
python -m venv venv
# Windows: venv\\Scripts\\activate | Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
Backend will be available at `http://localhost:8000`. Test the health endpoint at `http://localhost:8000/health`.

### 2. Start the Frontend (Next.js)

Open a new terminal session. Requires Node.js.

```bash
npm install
npm run dev
```
The application will be available at `http://localhost:3000`. It automatically connects to the Python backend.

## 🧩 Core Architecture

- **Frontend:** Next.js 14 App Router, React, Tailwind CSS, Framer Motion, Radix UI.
- **Backend:** Python FastAPI, Pydantic.
- **Data Fetching:** React Query proxying to FastAPI.
- **Pipelines:** Modular functions in `backend/main.py`.

## 🛠 Features Included

- **AI Supplier Search:** Multi-criteria automated discovery
- **Weighted Scoring Engine:** Re-rank global suppliers in real-time based on price, quality, lead time, and ESG.
- **RFQ Builder:** Automatically generate tailored RFQs with AI and manage line-item responses.
- **Landed Cost Estimator:** Real-time tariff and freight calculation pipeline.
- **Shortlist Manager:** Save, evaluate, and export top supplier picks (CSV/XLSX).

## 🚀 Deployment

The Next.js frontend is optimized for **Vercel**:
1. Push this repository to GitHub.
2. Import project into Vercel.
3. Add environment variable `ANTIGRAVITY_API_URL` pointing to your deployed FastAPI backend URL.
4. Deploy.

Deploying the Python backend works on **Render, Railway, or Heroku**:
1. Create a new Web Service using the `backend` folder as the root.
2. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

---
*Built with Antigravity*
