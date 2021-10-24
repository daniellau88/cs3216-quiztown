from __future__ import annotations

from threading import Thread, current_thread

from django.http import HttpRequest

_requests: dict[Thread, HttpRequest] = {}


def get_request():
    t = current_thread()
    if t not in _requests:
        return None
    return _requests[t]


# ref: https://stackoverflow.com/a/36328564
class RequestMiddleware(object):
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        _requests[current_thread()] = request
        response = self.get_response(request)
        return response
