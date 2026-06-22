from pathlib import Path

from docx import Document as DocxDocument
from pypdf import PdfReader

from app.errors import IngestionError
from app.services.chunker import ParsedPage


SUPPORTED_CONTENT_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "text/markdown",
}


class DocumentParser:
    def parse(self, stored_path: str, content_type: str) -> list[ParsedPage]:
        path = Path(stored_path)
        if not path.exists():
            raise IngestionError("File does not exist", status_code=400)
        if content_type not in SUPPORTED_CONTENT_TYPES:
            raise IngestionError("Unsupported file type", status_code=400)
        try:
            if content_type == "application/pdf":
                return self._parse_pdf(path)
            if content_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                return self._parse_docx(path)
            return self._parse_text(path)
        except IngestionError:
            raise
        except Exception as exc:
            raise IngestionError("Unable to parse document") from exc

    def _parse_pdf(self, path: Path) -> list[ParsedPage]:
        reader = PdfReader(str(path))
        pages = []
        for index, page in enumerate(reader.pages, start=1):
            pages.append(ParsedPage(pageNumber=index, text=page.extract_text() or ""))
        return pages

    def _parse_docx(self, path: Path) -> list[ParsedPage]:
        doc = DocxDocument(str(path))
        text = "\n".join(p.text for p in doc.paragraphs)
        return [ParsedPage(pageNumber=None, text=text)]

    def _parse_text(self, path: Path) -> list[ParsedPage]:
        return [ParsedPage(pageNumber=None, text=path.read_text(encoding="utf-8"))]
