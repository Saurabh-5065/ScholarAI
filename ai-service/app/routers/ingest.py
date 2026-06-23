from fastapi import APIRouter, Depends

from app.db import get_connection
from app.schemas import IngestDocumentRequest, IngestDocumentResponse
from app.security import require_internal_token
from app.services.ingest_service import IngestService

router = APIRouter(prefix="/internal", dependencies=[Depends(require_internal_token)])


@router.post("/ingest", response_model=IngestDocumentResponse)
def ingest_document(request: IngestDocumentRequest, conn=Depends(get_connection)) -> IngestDocumentResponse:
    return IngestService().ingest(conn, request)
