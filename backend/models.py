"""
models.py
----------
SQLAlchemy ORM model for the Project entity.

AI-Readiness note:
  The `description_embedding` field is intentionally commented out below.
  When the platform is ready for RAG / semantic search:
    1. pip install pgvector (after migrating to PostgreSQL)
    2. Replace the ARRAY placeholder with: Vector(1536) from pgvector.sqlalchemy
    3. Run a schema migration (Alembic) to add the column
    4. Populate embeddings via an async background task calling an
       embeddings API (e.g. OpenAI text-embedding-3-small)
"""

from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Enum, Integer, String, Text
import enum

from database import Base


class ProjectStatus(str, enum.Enum):
    """Strongly-typed status — enforced at both the DB and API layers."""
    PLANNING = "Planning"
    ACTIVE = "Active"
    ON_HOLD = "On Hold"
    COMPLETED = "Completed"


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(255), nullable=False, index=True)

    description = Column(Text, nullable=True)

    status = Column(
        Enum(ProjectStatus),
        nullable=False,
        default=ProjectStatus.PLANNING,
    )

    owner = Column(String(100), nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )

    updated_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # -------------------------------------------------------------------------
    # AI-READY: Semantic embedding placeholder
    # Uncomment and install pgvector to enable semantic / RAG search.
    #
    # from pgvector.sqlalchemy import Vector
    # description_embedding = Column(
    #     Vector(1536),   # Dimension matches OpenAI text-embedding-3-small
    #     nullable=True,
    #     comment="1536-dim embedding of `description` for cosine-similarity search"
    # )
    # -------------------------------------------------------------------------

    def __repr__(self) -> str:
        return f"<Project id={self.id} title={self.title!r} status={self.status}>"
