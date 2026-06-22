from typing import Literal
from uuid import UUID

from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: Literal["ok"]

class IngestDocumentRequest(BaseModel):
    documentId: UUID
    projectId: UUID
    userId: UUID
    storedPath: str
    originalFilename: str
    contentType: str


class IngestDocumentResponse(BaseModel):
    documentId: UUID
    status: Literal["READY"]
    chunksCreated: int
    pageCount: int


class Citation(BaseModel):
    documentId: UUID
    documentName: str
    pageNumber: int | None
    chunkId: UUID
    quote: str
    score: float


class Usage(BaseModel):
    model: str
    inputTokens: int
    outputTokens: int
    
    
class InternalRagQueryRequest(BaseModel):
    userId: UUID
    projectId: UUID
    sessionId: UUID
    message: str
    documentIds: list[UUID]
    topK: int = Field(ge=1, le=20)


class InternalRagQueryResponse(BaseModel):
    answer: str
    citations: list[Citation]
    usage: Usage