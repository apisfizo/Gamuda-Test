"""
database.py
-----------
Configures the SQLite engine and provides a per-request session dependency.

SQLite is chosen for this assessment for two reasons:
  1. Zero-config portability — a single `projects.db` file, no server to install.
  2. SQLAlchemy's unified ORM API means swapping to PostgreSQL later requires
     only changing the DATABASE_URL string and driver import.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

DATABASE_URL = "sqlite:///./projects.db"

engine = create_engine(
    DATABASE_URL,
    # check_same_thread=False is required for SQLite when used with FastAPI,
    # which may run across multiple threads in the same process.
    connect_args={"check_same_thread": False},
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    """Shared declarative base — all ORM models inherit from this."""
    pass


def get_db():
    """
    FastAPI dependency that yields a database session per request.
    Guarantees the session is closed even if an exception occurs.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
