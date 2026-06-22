import tiktoken


class TokenCounter:
    def __init__(self) -> None:
        self._encoding = tiktoken.get_encoding("cl100k_base")

    def count(self, text: str) -> int:
        return len(self._encoding.encode(text))

    def encode(self, text: str) -> list[int]:
        return self._encoding.encode(text)

    def decode(self, tokens: list[int]) -> str:
        return self._encoding.decode(tokens)
