from fastapi import APIRouter, Depends

from app.db import get_connection
from app.schemas import InternalRagQueryRequest, InternalRagQueryResponse
from app.security import require_internal_token
from app.services.rag import RagService

router = APIRouter(prefix="/internal", dependencies=[Depends(require_internal_token)])


@router.post("/rag/query", response_model=InternalRagQueryResponse)
def rag_query(request: InternalRagQueryRequest, conn=Depends(get_connection)) -> InternalRagQueryResponse:
    return RagService().query(conn, request)
