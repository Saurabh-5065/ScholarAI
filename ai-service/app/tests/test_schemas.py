from uuid import UUID

from pydantic import ValidationError
import pytest

from app.schemas import IngestDocumentRequest, InternalRagQueryRequest, InternalWritingRequest


def test_ingest_schema_uses_camel_case_fields():
    request = IngestDocumentRequest.model_validate(
        {
            "documentId": "00000000-0000-0000-0000-000000000001",
            "projectId": "00000000-0000-0000-0000-000000000002",
            "userId": "00000000-0000-0000-0000-000000000003",
            "storedPath": "../storage/uploads/user-id/project-id/document.pdf",
            "originalFilename": "document.pdf",
            "contentType": "application/pdf",
        }
    )

    assert request.documentId == UUID("00000000-0000-0000-0000-000000000001")
    assert "documentId" in request.model_dump(mode="json")


def test_rag_schema_validates_top_k_range():
    with pytest.raises(ValidationError):
        InternalRagQueryRequest.model_validate(
            {
                "userId": "00000000-0000-0000-0000-000000000001",
                "projectId": "00000000-0000-0000-0000-000000000002",
                "sessionId": "00000000-0000-0000-0000-000000000003",
                "message": "Question",
                "documentIds": [],
                "topK": 21,
            }
        )


def test_writing_schema_accepts_contract_enums():
    request = InternalWritingRequest.model_validate(
        {
            "userId": "00000000-0000-0000-0000-000000000001",
            "projectId": None,
            "inputText": "This paper is about fake news and uses ML.",
            "tone": "ACADEMIC",
            "targetLength": "MEDIUM",
        }
    )

    assert request.tone == "ACADEMIC"
    assert request.targetLength == "MEDIUM"
