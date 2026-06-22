from uuid import uuid4

from pgvector.psycopg import register_vector

from app.errors import IngestionError
from app.schemas import IngestDocumentRequest, IngestDocumentResponse
from app.services.chunker import Chunker
from app.services.document_parser import DocumentParser
from app.services.embeddings import EmbeddingService


class IngestService:
    def __init__(
        self,
        parser: DocumentParser | None = None,
        chunker: Chunker | None = None,
        embeddings: EmbeddingService | None = None,
    ) -> None:
        self.parser = parser or DocumentParser()
        self.chunker = chunker or Chunker()
        self.embeddings = embeddings or EmbeddingService()

    def ingest(self, conn, request: IngestDocumentRequest) -> IngestDocumentResponse:
        try:
            pages = self.parser.parse(request.storedPath, request.contentType)
            chunks = self.chunker.chunk_pages(pages)
            if not chunks:
                raise IngestionError("Document did not contain extractable text", status_code=400)

            vectors = self.embeddings.embed_texts([chunk.content for chunk in chunks])
            if len(vectors) != len(chunks):
                raise IngestionError("Embedding generation failed")

            register_vector(conn)
            with conn.cursor() as cur:
                cur.execute("DELETE FROM document_chunks WHERE document_id = %s", (request.documentId,))
                cur.executemany(
                    """
                    INSERT INTO document_chunks (
                      id, document_id, project_id, user_id, chunk_index,
                      page_number, content, token_count, embedding
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """,
                    [
                        (
                            uuid4(),
                            request.documentId,
                            request.projectId,
                            request.userId,
                            chunk.chunkIndex,
                            chunk.pageNumber,
                            chunk.content,
                            chunk.tokenCount,
                            vector,
                        )
                        for chunk, vector in zip(chunks, vectors, strict=True)
                    ],
                )
            conn.commit()
        except IngestionError:
            conn.rollback()
            raise
        except Exception as exc:
            conn.rollback()
            raise IngestionError("Ingestion failed") from exc

        page_count = max((page.pageNumber or 0 for page in pages), default=0) or len(pages)
        return IngestDocumentResponse(
            documentId=request.documentId,
            status="READY",
            chunksCreated=len(chunks),
            pageCount=page_count,
        )
