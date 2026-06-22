from fastapi.testclient import TestClient

from app.main import app


def test_health_endpoint():
    client = TestClient(app)

    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_internal_token_rejection():
    client = TestClient(app)

    response = client.post(
        "/internal/rag/query",
        json={
            "userId": "00000000-0000-0000-0000-000000000001",
            "projectId": "00000000-0000-0000-0000-000000000002",
            "sessionId": "00000000-0000-0000-0000-000000000003",
            "message": "What is the research gap?",
            "documentIds": [],
            "topK": 8,
        },
    )

    assert response.status_code == 401
    assert response.json() == {
        "error": "UNAUTHORIZED",
        "message": "Invalid internal service token",
    }
