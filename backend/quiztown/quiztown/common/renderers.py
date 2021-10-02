from __future__ import annotations

from rest_framework.renderers import JSONRenderer


class QuiztownJSONRenderer(JSONRenderer):
    def render(
        self,
        payload: dict[any, any],
        accepted_media_type=None,
        renderer_context=None,
        code: int = 0,
        messages: list[str] = [],
        **kwargs,
    ) -> bytes:

        response_data = {
            "code": code,
            "messages": messages,
            "payload": payload,
        }

        response = super(QuiztownJSONRenderer, self).render(
            response_data, accepted_media_type, renderer_context, **kwargs
        )

        return response
