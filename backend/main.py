"""
main.py
-------
FastAPI application entry point.
Registers routes, CORS middleware, and creates DB tables on startup.
"""

from contextlib import asynccontextmanager
from datetime import datetime, timedelta, timezone
from typing import List, Optional

from fastapi import Depends, FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

import models
import schemas
from database import Base, engine, get_db

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
SECRET_KEY = "gamuda-assessment-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 480  # 8-hour working day

DEMO_USER = {"username": "admin", "password": "gamuda2026"}

# ---------------------------------------------------------------------------
# Security utilities
# ---------------------------------------------------------------------------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def create_access_token(subject: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode({"sub": subject, "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(token: str = Depends(oauth2_scheme)) -> str:
    """FastAPI dependency — resolves and validates the Bearer token."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail="Invalid token")
        return username
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )


# ---------------------------------------------------------------------------
# Application lifespan — create tables on startup
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


# ---------------------------------------------------------------------------
# App factory
# ---------------------------------------------------------------------------
app = FastAPI(
    title="Gamuda PM Platform",
    version="1.0.0",
    description="Simple Project Management API — AI-ready, RESTful.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Auth endpoints
# ---------------------------------------------------------------------------

@app.post("/auth/login", response_model=schemas.TokenResponse, tags=["Auth"])
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """Exchange credentials for a JWT access token."""
    if (
        form_data.username != DEMO_USER["username"]
        or form_data.password != DEMO_USER["password"]
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = create_access_token(subject=form_data.username)
    return schemas.TokenResponse(access_token=token)


@app.get("/auth/me", tags=["Auth"])
def get_me(current_user: str = Depends(get_current_user)):
    return {"username": current_user}


# ---------------------------------------------------------------------------
# Project CRUD endpoints
# ---------------------------------------------------------------------------

@app.post(
    "/projects",
    response_model=schemas.ProjectResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Projects"],
    summary="Create a new project",
)
def create_project(
    payload: schemas.ProjectCreate,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_user),
):
    project = models.Project(**payload.model_dump())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@app.get(
    "/projects",
    response_model=List[schemas.ProjectResponse],
    tags=["Projects"],
    summary="List all projects with optional search",
)
def list_projects(
    search: Optional[str] = Query(default=None, description="Search by title"),
    status: Optional[models.ProjectStatus] = Query(default=None),
    db: Session = Depends(get_db),
    _: str = Depends(get_current_user),
):
    query = db.query(models.Project)
    if search:
        query = query.filter(models.Project.title.ilike(f"%{search}%"))
    if status:
        query = query.filter(models.Project.status == status)
    return query.order_by(models.Project.created_at.desc()).all()


@app.get(
    "/projects/{project_id}",
    response_model=schemas.ProjectResponse,
    tags=["Projects"],
    summary="Get a single project by ID",
)
def get_project(
    project_id: int,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_user),
):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail=f"Project {project_id} not found")
    return project


@app.put(
    "/projects/{project_id}",
    response_model=schemas.ProjectResponse,
    tags=["Projects"],
    summary="Update a project (partial update supported)",
)
def update_project(
    project_id: int,
    payload: schemas.ProjectUpdate,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_user),
):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail=f"Project {project_id} not found")

    # Only update fields that were explicitly provided in the payload
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(project, field, value)

    # Manually set updated_at since SQLite doesn't auto-trigger onupdate
    project.updated_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(project)
    return project


@app.delete(
    "/projects/{project_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    tags=["Projects"],
    summary="Delete a project",
)
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_user),
):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail=f"Project {project_id} not found")
    db.delete(project)
    db.commit()
