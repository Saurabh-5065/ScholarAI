from dataclasses import dataclass
from uuid import UUID

from psycopg.rows import dict_row
from pgvector.psycopg import register_vector


@dataclass(frozen=True)
class RetrievedChunk:
    id: UUID
    documentId: UUID
    documentName: str
    pageNumber: int | None
    content: str
    score: float


class RetrievalService:
    def search(
        self,
        conn,
        user_id: UUID,
        project_id: UUID,
        document_ids: list[UUID],
        query_embedding: list[float],
        top_k: int,
    ) -> list[RetrievedChunk]:
        register_vector(conn)
        params: list[object] = [query_embedding, user_id, project_id]
        document_filter = ""
        if document_ids:
            document_filter = " AND dc.document_id = ANY(%s::uuid[])"
            params.append([str(document_id) for document_id in document_ids])
        params.extend([query_embedding, top_k])
        sql = f"""
            SELECT
              dc.id,
              dc.document_id,
              d.original_filename,
              dc.page_number,
              dc.content,
              1 - (dc.embedding <=> %s::vector) AS score
            FROM document_chunks dc
            JOIN documents d ON d.id = dc.document_id
            WHERE dc.user_id = %s
              AND dc.project_id = %s
              AND dc.embedding IS NOT NULL
              {document_filter}
            ORDER BY dc.embedding <=> %s::vector
            LIMIT %s
        """
        with conn.cursor(row_factory=dict_row) as cur:
            cur.execute(sql, params)
            rows = cur.fetchall()
        return [
            RetrievedChunk(
                id=row["id"],
                documentId=row["document_id"],
                documentName=row["original_filename"],
                pageNumber=row["page_number"],
                content=row["content"],
                score=round(float(row["score"]), 4),
            )
            for row in rows
        ]
