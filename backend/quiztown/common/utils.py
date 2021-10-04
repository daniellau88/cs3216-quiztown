from __future__ import annotations


def generate_response(code: int, messages: list[str], payload: dict):
    return {
        "code": code,
        "messages": messages,
        "payload": payload,
    }
