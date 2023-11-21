import jwt

secret='django-insecure-yx0_es9okr6pcsa_xd-9@u3##kymq@_hga+aj1whai*9q%zsxt'

def decode_user(token: str):
    """
    :param token: jwt token
    :return:
    """
    decoded_data = jwt.decode(jwt=token,
                              key=secret,
                              algorithms=["HS256"])

    return decoded_data