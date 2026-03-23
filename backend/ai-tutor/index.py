"""
ИИ-помощник по ЕГЭ 2026 — отвечает на вопросы по математике, русскому языку и информатике.
"""
import json
import os
import urllib.request
import urllib.error


SYSTEM_PROMPT = """Ты — дружелюбный ИИ-репетитор по ЕГЭ 2026. Помогаешь ученикам понять задания по трём предметам:
- Профильная математика
- Русский язык
- Информатика

Правила общения:
1. Отвечай коротко и понятно (3–6 предложений максимум)
2. Используй простые объяснения, не перегружай терминами
3. Если задан конкретный вопрос по заданию — объясни шаг за шагом
4. Если ученик не понимает — предложи другой способ объяснения
5. Поддерживай и мотивируй ученика
6. Используй эмодзи умеренно
7. Отвечай на русском языке
8. Если вопрос не по ЕГЭ — вежливо перенаправь к учёбе
"""


def handler(event: dict, context) -> dict:
    """Обработчик запросов к ИИ-репетитору ЕГЭ."""

    cors_headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors_headers, "body": ""}

    if event.get("httpMethod") != "POST":
        return {
            "statusCode": 405,
            "headers": cors_headers,
            "body": json.dumps({"error": "Method not allowed"}),
        }

    body = json.loads(event.get("body") or "{}")
    messages = body.get("messages", [])
    
    if not messages:
        return {
            "statusCode": 400,
            "headers": cors_headers,
            "body": json.dumps({"error": "No messages provided"}),
        }

    api_key = os.environ.get("OPENAI_API_KEY", "")
    if not api_key:
        return {
            "statusCode": 500,
            "headers": cors_headers,
            "body": json.dumps({"error": "API key not configured"}),
        }

    payload = json.dumps({
        "model": "gpt-4o-mini",
        "messages": [{"role": "system", "content": SYSTEM_PROMPT}] + messages,
        "max_tokens": 400,
        "temperature": 0.7,
    }).encode("utf-8")

    req = urllib.request.Request(
        "https://api.openai.com/v1/chat/completions",
        data=payload,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    with urllib.request.urlopen(req, timeout=25) as resp:
        result = json.loads(resp.read().decode("utf-8"))

    reply = result["choices"][0]["message"]["content"]

    return {
        "statusCode": 200,
        "headers": cors_headers,
        "body": json.dumps({"reply": reply}),
    }
