from openai import OpenAI

from app.config import get_settings
from app.schemas import InternalWritingRequest, InternalWritingResponse, Usage
from app.services.token_counter import TokenCounter

WARNING = "Verify all claims and citations before using this in final academic work."


class WritingToolsService:
    def __init__(self, token_counter: TokenCounter | None = None) -> None:
        self.settings = get_settings()
        self.client = OpenAI(api_key=self.settings.openai_api_key)
        self.token_counter = token_counter or TokenCounter()

    def execute(self, tool: str, request: InternalWritingRequest) -> InternalWritingResponse:
        prompt = self._prompt(tool, request)
        response = self.client.chat.completions.create(
            model=self.settings.openai_chat_model,
            messages=[
                {"role": "system", "content": "You are ScholarAI, an academic writing assistant. Preserve meaning and avoid unsupported claims."},
                {"role": "user", "content": prompt},
            ],
        )
        output = response.choices[0].message.content or ""
        usage = self._usage(response, prompt, output)
        return InternalWritingResponse(outputText=output, warnings=[WARNING], usage=usage)

    def _prompt(self, tool: str, request: InternalWritingRequest) -> str:
        length = request.targetLength.lower()
        tone = request.tone.lower()
        text = request.inputText
        prompts = {
            "outline": f"Create a {length} structured academic outline in a {tone} tone from this topic or notes:\n{text}",
            "abstract": (
                f"Write a {length} academic abstract in a {tone} tone. Include background, problem, method, "
                f"results placeholder if results are missing, and conclusion:\n{text}"
            ),
            "improve": f"Improve this text into {tone} academic writing without changing its meaning. Target length: {length}.\n{text}",
            "summarize": f"Summarize this text into a {length} concise academic summary in a {tone} tone:\n{text}",
            "extract-paper-insights": (
                "Extract the following as clear markdown sections: research problem, objectives, methodology, "
                f"dataset, key findings, limitations, and future scope.\n{text}"
            ),
            "citation-format": (
                "Format the citation-like input into APA, IEEE, and MLA sections when possible. "
                f"Do not invent missing metadata; mark unknowns clearly.\n{text}"
            ),
        }
        return prompts[tool]

    def _usage(self, response, input_text: str, output_text: str) -> Usage:
        usage = getattr(response, "usage", None)
        if usage is not None:
            return Usage(
                model=self.settings.openai_chat_model,
                inputTokens=int(getattr(usage, "prompt_tokens", 0) or 0),
                outputTokens=int(getattr(usage, "completion_tokens", 0) or 0),
            )
        return Usage(
            model=self.settings.openai_chat_model,
            inputTokens=self.token_counter.count(input_text),
            outputTokens=self.token_counter.count(output_text),
        )
