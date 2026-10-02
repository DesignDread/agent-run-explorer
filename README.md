# Agent Run Explorer

A full-stack web tool for browsing and understanding agent run traces. Built with **FastAPI** (Python) and **Next.js** (TypeScript/React).

## Prerequisites

- Python 3.11+
- Node.js 20+
- npm 10+

## Quick Start

### 1. Clone and enter the project

```bash
git clone https://github.com/DesignDread/agent-run-explorer.git
cd agent-run-explorer
```

### 2. Start the backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

The API is now running at `http://localhost:8000`. You can verify at `http://localhost:8000/docs`.

### 3. Start the frontend (new terminal)

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

The app is now running at `http://localhost:3000`.

### 4. Open the app

- **Runs list**: [http://localhost:3000/runs](http://localhost:3000/runs)
- **Run detail**: [http://localhost:3000/runs/run_0001](http://localhost:3000/runs/run_0001)
- **Dashboard**: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
- **API docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

## Running Tests

### Backend tests

```bash
cd backend
pytest -v
```

### Frontend tests

```bash
cd frontend
npm test
```

## Project Structure

```
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app entry point
│   │   ├── models.py        # Pydantic models
│   │   ├── data_loader.py   # JSONL data loading with irregularity handling
│   │   └── routes.py        # API endpoints
│   ├── tests/
│   │   └── test_api.py      # Backend tests
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx    # Root layout with navigation
│   │   │   ├── runs/         # Runs list and detail pages
│   │   │   └── dashboard/    # Dashboard with charts
│   │   ├── components/       # Reusable UI components
│   │   └── lib/
│   │       ├── types.ts      # TypeScript type definitions
│   │       └── api.ts        # API client functions
│   ├── package.json
│   └── .env.example
├── data/
│   └── runs.jsonl            # 201 agent run records
├── DECISIONS.md              # Design decisions and data observations
├── DATA.md                   # Dataset documentation
└── README.md                 # This file
```

## Environment Variables

See `.env.example` files in both `backend/` and `frontend/` directories.

### Backend (`backend/.env`)

| Variable       | Default              | Description                          |
| -------------- | -------------------- | ------------------------------------ |
| `LLM_PROVIDER` | `mock`               | LLM provider for /explain endpoint   |
| `DATA_PATH`    | `../data/runs.jsonl` | Path to the JSONL data file          |

### Frontend (`frontend/.env.local`)

| Variable               | Default | Description            |
| ---------------------- | ------- | ---------------------- |
| `NEXT_PUBLIC_API_URL`  | (empty) | API base URL (proxied) |

## API Endpoints

| Method | Path                      | Description                              |
| ------ | ------------------------- | ---------------------------------------- |
| GET    | `/api/runs`               | Paginated, filtered, sorted list of runs |
| GET    | `/api/runs/{id}`          | Single run with full step details        |
| GET    | `/api/stats`              | Aggregated statistics for dashboard      |
| POST   | `/api/runs/{id}/explain`  | Streaming natural-language explanation    |

## Data Quality Notes

The dataset contains intentional irregularities. See [DECISIONS.md](DECISIONS.md) for how each is handled.
