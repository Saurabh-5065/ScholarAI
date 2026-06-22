from dataclasses import dataclass

from app.services.token_counter import TokenCounter


@dataclass(frozen=True)
class ParsedPage:
    pageNumber: int | None
    text: str


@dataclass(frozen=True)
class TextChunk:
    chunkIndex: int
    pageNumber: int | None
    content: str
    tokenCount: int


class Chunker:
    def __init__(self, chunk_size: int = 800, overlap: int = 120, token_counter: TokenCounter | None = None) -> None:
        self.chunk_size = chunk_size
        self.overlap = overlap
        self.token_counter = token_counter or TokenCounter()

    def chunk_pages(self, pages: list[ParsedPage]) -> list[TextChunk]:
        chunks: list[TextChunk] = []
        for page in pages:
            tokens = self.token_counter.encode(page.text.strip())
            if not tokens:
                continue
            start = 0
            while start < len(tokens):
                window = tokens[start : start + self.chunk_size]
                content = self.token_counter.decode(window).strip()
                if content:
                    chunks.append(
                        TextChunk(
                            chunkIndex=len(chunks),
                            pageNumber=page.pageNumber,
                            content=content,
                            tokenCount=len(window),
                        )
                    )
                if start + self.chunk_size >= len(tokens):
                    break
                start += self.chunk_size - self.overlap
        return chunks
