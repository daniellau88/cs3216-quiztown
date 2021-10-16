from __future__ import annotations

from rest_framework.renderers import JSONRenderer

from quiztown.common.errors import get_code_from_context, get_messages_from_context
from quiztown.common.utils import generate_response


class QuiztownJSONRenderer(JSONRenderer):
    def render(
        self,
        payload: dict,
        accepted_media_type=None,
        context=None,
        *args,
        **kwargs,
    ) -> bytes:
        code = get_code_from_context(context)
        messages = get_messages_from_context(context)

        response_data = generate_response(
            code, messages, payload if payload is not None else {})

        response = super(QuiztownJSONRenderer, self).render(
            response_data, accepted_media_type, context,
        )

        return response
