# Tech Stack Justification

> Architecture decisions for the Gamuda PM Platform take-home assessment.

---

## Backend: FastAPI (Python)

### Why FastAPI over Flask or Django?

| Concern | Flask | Django | **FastAPI** |
|---------|-------|--------|-------------|
| Async support | Bolt-on (Quart) | Limited | **Native — ASGI-first** |
| Auto API docs | Manual | drf-yasg | **Built-in OpenAPI/Swagger** |
| Validation | Manual | Forms | **Pydantic v2 — zero boilerplate** |
| Performance | Moderate | Moderate | **Comparable to NodeJS** |
| AI/ML integration | Thread-blocking | Thread-blocking | **Awaitable — shares event loop** |

**The decisive factor for an AI Engineer role:** FastAPI runs on an async event loop. When this platform later calls an embeddings API (OpenAI, Cohere) or a local inference endpoint (Ollama, vLLM), those calls can be `await`-ed without spawning new threads. In contrast, a synchronous Flask route would block the entire worker while waiting for inference — killing throughput under load.

```python
# Future AI endpoint — no new threads needed
@app.post("/projects/{id}/embed")
async def embed_description(id: int, db: Session = Depends(get_db)):
    project = db.query(Project).get(id)
    embedding = await openai_client.embeddings.create(input=project.description)
    project.description_embedding = embedding.data[0].embedding
    db.commit()
    return {"status": "embedded"}
```

### Pydantic v2 Schemas

Schemas are **separated from ORM models** by design. This is not boilerplate — it enforces a clean boundary between:
- **ORM layer**: persistence concerns (columns, indexes, relationships, migrations)
- **API layer**: HTTP concerns (validation rules, serialisation, versioning, documentation)

Using an ORM model directly as both input and output leaks internal fields and makes API versioning painful. The three-schema pattern (`Create` / `Update` / `Response`) is industry standard for production FastAPI services.

---

## Database: SQLite (via SQLAlchemy)

### Why SQLite for this assessment?

SQLite is chosen for **local portability and zero configuration**:

| Criterion | SQLite | PostgreSQL |
|-----------|--------|------------|
| Setup time | 0 seconds | 5–10 min (install + configure) |
| File to share | `projects.db` — one file | Docker / connection string |
| Reviewer setup | `pip install` only | Requires running server |
| Data portability | Copy the file | `pg_dump` / restore |

For a take-home assessment where the reviewer runs the project on their machine, SQLite removes every possible friction point.

### SQLAlchemy as the abstraction layer

The migration path to PostgreSQL is **one line**:

```python
# SQLite (current)
DATABASE_URL = "sqlite:///./projects.db"

# PostgreSQL (production) — everything else stays identical
DATABASE_URL = "postgresql+asyncpg://user:password@localhost/gamuda_pm"
```

SQLAlchemy's unified ORM API means models, queries, and session management are **database-agnostic**. No application code changes required when upgrading.

---

## AI-Readiness: `description_embedding`

The `description_embedding` field is commented out in `models.py`:

```python
# AI-READY: Semantic embedding placeholder
# from pgvector.sqlalchemy import Vector
# description_embedding = Column(
#     Vector(1536),   # Dimension matches OpenAI text-embedding-3-small
#     nullable=True,
# )
```

**Why this matters:** Embedding project descriptions enables:

1. **Semantic search** — "find projects similar to 'tunnelling civils work'" returns relevant results even if the exact words don't match.
2. **RAG (Retrieval-Augmented Generation)** — an AI assistant can ground its answers in actual project data, not hallucinations.
3. **Anomaly detection** — cluster embeddings to spot projects that are outliers in scope, risk, or timeline.

The activation path:
1. Migrate to PostgreSQL
2. `pip install pgvector`
3. Uncomment the column + run `alembic upgrade head`
4. Add a background task to populate embeddings via the OpenAI API

---

## Frontend: React + Vite + Tailwind CSS

- **Vite** over Create React App: 10–100× faster builds, native ESM dev server.
- **TypeScript**: Type safety catches integration bugs at compile time (e.g., mismatched API field names).
- **Axios interceptors**: JWT injection and 401-auto-logout handled once, never duplicated in component code.
- **Custom hook pattern** (`useAuth`): Auth state is global, testable, and decoupled from UI components.
- **Industrial dark theme**: Blueprint-grid background, Space Mono typography, amber accents — contextually appropriate for an engineering platform, not generic.
