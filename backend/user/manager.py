from .models import User


def get_user_by_user_id(user_id):
    try:
        return User.objects.get(user_id=user_id)
    except User.DoesNotExist:
        return None
