from fastapi import APIRouter, Depends

from app.schemas import InternalWritingRequest, InternalWritingResponse
from app.security import require_internal_token
from app.services.writing_tools import WritingToolsService

router = APIRouter(prefix="/internal/writing", dependencies=[Depends(require_internal_token)])


def execute(tool: str, request: InternalWritingRequest) -> InternalWritingResponse:
    return WritingToolsService().execute(tool, request)


@router.post("/outline", response_model=InternalWritingResponse)
def outline(request: InternalWritingRequest) -> InternalWritingResponse:
    return execute("outline", request)


@router.post("/abstract", response_model=InternalWritingResponse)
def abstract(request: InternalWritingRequest) -> InternalWritingResponse:
    return execute("abstract", request)


@router.post("/improve", response_model=InternalWritingResponse)
def improve(request: InternalWritingRequest) -> InternalWritingResponse:
    return execute("improve", request)


@router.post("/summarize", response_model=InternalWritingResponse)
def summarize(request: InternalWritingRequest) -> InternalWritingResponse:
    return execute("summarize", request)


@router.post("/extract-paper-insights", response_model=InternalWritingResponse)
def extract_paper_insights(request: InternalWritingRequest) -> InternalWritingResponse:
    return execute("extract-paper-insights", request)


@router.post("/citation-format", response_model=InternalWritingResponse)
def citation_format(request: InternalWritingRequest) -> InternalWritingResponse:
    return execute("citation-format", request)
