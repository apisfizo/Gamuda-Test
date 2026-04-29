# Gamuda PM Platform

> Take-Home Assessment — Software Engineer Role, Gamuda
> Simple Project Management Platform with JWT Auth, CRUD API, and AI-ready architecture.

---

## Prerequisites

- Python 3.10+
- Node.js 18+
- npm 9+

No Docker, no database server, no additional infrastructure required.

---

## Quick Start

### 1. Clone / unzip the project

```bash
cd gamuda-test
```

### 2. Start the Backend

```bash
cd backend

# Create and activate a virtual environment
python -m venv .venvgit 

# macOS / Linux
source .venv/bin/activate

# Windows (PowerShell)
.venv\Scripts\Activate

# Install dependencies
pip install -r requirements.txt

# Start the server (auto-creates projects.db on first run)
uvicorn main:app --reload --port 8000
```

The API is now running at **http://localhost:8000**
Interactive docs: **http://localhost:8000/docs**

### 3. Start the Frontend

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app is now running at **http://localhost:5173**

---

## Login Credentials

| Field    | Value        |
|----------|--------------|
| Username | `admin`      |
| Password | `gamuda2026` |

---

## Project Structure

```
gamuda-simple/
├── backend/
│   ├── main.py          # FastAPI app, all endpoints, JWT auth
│   ├── models.py        # SQLAlchemy ORM (includes AI embedding placeholder)
│   ├── schemas.py       # Pydantic v2 request/response contracts
│   ├── database.py      # SQLite engine + session dependency
│   └── requirements.txt
│
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── LoginPage.tsx         # Authentication form
│       │   ├── DashboardPage.tsx     # Project grid with search + filter
│       │   └── ProjectDetailPage.tsx # View, edit, delete
│       ├── components/
│       │   ├── atoms.tsx    # Button, Input, StatusBadge, Spinner, etc.
│       │   ├── Modal.tsx    # Reusable modal overlay
│       │   ├── Navbar.tsx   # Top navigation
│       │   └── ProjectForm.tsx  # Shared create/edit form
│       ├── hooks/
│       │   └── useAuth.tsx  # AuthContext + useAuth hook
│       └── services/
│           ├── api.ts           # Axios client + JWT interceptor
│           └── projectService.ts # Auth + project API calls
│
├── README.md
└── TECH_STACK.md
```

---

## API Endpoints

| Method   | Path                  | Auth | Description                   |
|----------|-----------------------|------|-------------------------------|
| `POST`   | `/auth/login`         | ✗    | Get JWT token                 |
| `GET`    | `/auth/me`            | ✓    | Verify token / current user   |
| `POST`   | `/projects`           | ✓    | Create project                |
| `GET`    | `/projects`           | ✓    | List all (search + filter)    |
| `GET`    | `/projects/{id}`      | ✓    | Get single project            |
| `PUT`    | `/projects/{id}`      | ✓    | Update project (partial ok)   |
| `DELETE` | `/projects/{id}`      | ✓    | Delete project                |

Query parameters for `GET /projects`:
- `search` — case-insensitive title search
- `status` — filter by `Planning`, `Active`, `On Hold`, or `Completed`

---

## Project Model Fields

| Field         | Type    | Notes                                      |
|---------------|---------|--------------------------------------------|
| `id`          | int     | Auto-generated primary key                 |
| `title`       | string  | Required, max 255 chars                    |
| `description` | string  | Optional, free text                        |
| `status`      | enum    | Planning / Active / On Hold / Completed    |
| `owner`       | string  | Required, max 100 chars                    |
| `created_at`  | datetime| UTC, auto-set on creation                 |
| `updated_at`  | datetime| UTC, auto-updated on change               |

---

## AI-Readiness

The `description_embedding` column is commented out in `models.py`. To activate:

```bash
# 1. Migrate to PostgreSQL (update DATABASE_URL in database.py)
# 2. pip install pgvector
# 3. Uncomment the embedding column in models.py
# 4. Run schema migration
```

This enables semantic search and RAG over all project descriptions without changing any other application code.

---

## Stopping the Servers

- Backend: `Ctrl+C` in the uvicorn terminal
- Frontend: `Ctrl+C` in the npm terminal
- Database: `projects.db` is a local file — delete it to reset all data
