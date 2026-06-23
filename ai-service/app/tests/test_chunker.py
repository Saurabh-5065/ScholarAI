from app.services.chunker import Chunker, ParsedPage


def test_chunker_creates_overlapping_token_chunks():
    text = " ".join(["academic research writing"] * 500)
    chunker = Chunker(chunk_size=50, overlap=10)

    chunks = chunker.chunk_pages([ParsedPage(pageNumber=1, text=text)])

    assert len(chunks) > 1
    assert chunks[0].chunkIndex == 0
    assert chunks[0].pageNumber == 1
    assert chunks[0].tokenCount <= 50
    assert all(chunk.content for chunk in chunks)
