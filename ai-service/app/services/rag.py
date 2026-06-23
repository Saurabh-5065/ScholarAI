from openai import OpenAI

from app.config import get_settings
from app.schemas import Citation, InternalRagQueryRequest, InternalRagQueryResponse, Usage
from app.services.embeddings import EmbeddingService
from app.services.retrieval import RetrievalService, RetrievedChunk
from app.services.token_counter import TokenCounter

WEAK_CONTEXT_ANSWER = "I could not find enough relevant evidence in the uploaded documents to answer this confidently."


class RagService:
    def __init__(
        self,
        embeddings: EmbeddingService | None = None,
        retrieval: RetrievalService | None = None,
        token_counter: TokenCounter | None = None,
    ) -> None:
        self.settings = get_settings()
        self.client = OpenAI(api_key=self.settings.openai_api_key)
        self.embeddings = embeddings or EmbeddingService()
        self.retrieval = retrieval or RetrievalService()
        self.token_counter = token_counter or TokenCounter()

    def query(self, conn, request: InternalRagQueryRequest) -> InternalRagQueryResponse:
        query_embedding = self.embeddings.embed_text(request.message)
        chunks = self.retrieval.search(
            conn,
            request.userId,
            request.projectId,
            request.documentIds,
            query_embedding,
            request.topK,
        )

        if not chunks or max(chunk.score for chunk in chunks) < 0.25:
            usage = self._estimated_usage(request.message, WEAK_CONTEXT_ANSWER)
            return InternalRagQueryResponse(answer=WEAK_CONTEXT_ANSWER, citations=[], usage=usage)

        context = self._build_context(chunks)
        messages = [
            {
                "role": "system",
                "content": (
                    "You are ScholarAI, an academic research assistant. "
                    "Answer only using provided context when document context is supplied. "
                    "Never invent citations. If context is weak, say the uploaded documents do not contain enough evidence. "
                    "Use clear academic language."
                ),
            },
            {
                "role": "user",
                "content": f"Question: {request.message}\n\nContext:\n{context}",
            },
        ]
        response = self.client.chat.completions.create(model=self.settings.openai_chat_model, messages=messages)
        answer = response.choices[0].message.content or WEAK_CONTEXT_ANSWER
        citations = [self._citation(chunk) for chunk in chunks]
        usage = self._usage_from_response(response, messages[0]["content"] + messages[1]["content"], answer)
        return InternalRagQueryResponse(answer=answer, citations=citations, usage=usage)

    def _build_context(self, chunks: list[RetrievedChunk]) -> str:
        lines = []
        for index, chunk in enumerate(chunks, start=1):
            page = f", page {chunk.pageNumber}" if chunk.pageNumber is not None else ""
            lines.append(f"[{index}] {chunk.documentName}{page}, score {chunk.score}: {chunk.content}")
        return "\n\n".join(lines)

    def _citation(self, chunk: RetrievedChunk) -> Citation:
        quote = " ".join(chunk.content.split())[:280]
        return Citation(
            documentId=chunk.documentId,
            documentName=chunk.documentName,
            pageNumber=chunk.pageNumber,
            chunkId=chunk.id,
            quote=quote,
            score=chunk.score,
        )

    def _usage_from_response(self, response, input_text: str, output_text: str) -> Usage:
        usage = getattr(response, "usage", None)
        if usage is not None:
            return Usage(
                model=self.settings.openai_chat_model,
                inputTokens=int(getattr(usage, "prompt_tokens", 0) or 0),
                outputTokens=int(getattr(usage, "completion_tokens", 0) or 0),
            )
        return self._estimated_usage(input_text, output_text)

    def _estimated_usage(self, input_text: str, output_text: str) -> Usage:
        return Usage(
            model=self.settings.openai_chat_model,
            inputTokens=self.token_counter.count(input_text),
            outputTokens=self.token_counter.count(output_text),
        )
