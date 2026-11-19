from groq import Groq

from app.core.config import get_settings


class GroqService:
    def __init__(self):
        settings = get_settings()

        if not settings.groq_api_key:
            raise ValueError("GROQ_API_KEY is not configured.")

        self.client = Groq(api_key=settings.groq_api_key)
        self.model = settings.ai_model

    @staticmethod
    def _normalize_text(text: str) -> str:
        if "â" not in text and "ð" not in text and "Ã" not in text:
            return text

        try:
            repaired = text.encode("latin-1").decode("utf-8")
        except (UnicodeEncodeError, UnicodeDecodeError):
            return text

        return repaired

    def generate(self, prompt: str) -> str:
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are ApplyPilot AI. "
                        "Return accurate, conservative results. "
                        "Use standard UTF-8 text."
                    ),
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            temperature=0.1,
            max_tokens=2000,
            response_format={"type": "json_object"},
        )

        content = response.choices[0].message.content

        if not content:
            raise RuntimeError("Groq returned an empty response.")

        return self._normalize_text(content.strip())


groq_service = GroqService()
