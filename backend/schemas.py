"""
schemas.py
----------
Pydantic v2 schemas define the API contract — separate from ORM models.

This separation is intentional:
  - ORM models handle persistence (columns, indexes, relationships).
  - Schemas handle HTTP (validation, serialisation, documentation, versioning).
  Mixing them exposes internal DB fields and makes API versioning painful.
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, ConfigDict

from models import ProjectStatus


# ---------------------------------------------------------------------------
# Auth
# ---------------------------------------------------------------------------

class LoginRequest(BaseModel):
    username: str = Field(..., min_length=1)
    password: str = Field(..., min_length=1)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ---------------------------------------------------------------------------
# Project
# ---------------------------------------------------------------------------

class ProjectBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255, examples=["KVMRT Line 3"])
    description: Optional[str] = Field(default=None, examples=["Tunnelling works"])
    status: ProjectStatus = Field(default=ProjectStatus.PLANNING)
    owner: str = Field(..., min_length=1, max_length=100, examples=["Ahmad Razif"])


class ProjectCreate(ProjectBase):
    """Schema for POST /projects."""
    pass


class ProjectUpdate(BaseModel):
    """
    Schema for PUT /projects/{id}.
    All fields optional — clients send only the fields they want to change.
    """
    title: Optional[str] = Field(default=None, min_length=1, max_length=255)
    description: Optional[str] = None
    status: Optional[ProjectStatus] = None
    owner: Optional[str] = Field(default=None, min_length=1, max_length=100)


class ProjectResponse(ProjectBase):
    """Schema returned to the client — includes server-generated fields."""
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime
