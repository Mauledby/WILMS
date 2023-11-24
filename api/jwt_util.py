import jwt

secret='django-insecure-n9gx_l8!6tp*^ws9tov)vkt1djt+%pp=l(^d5^bdzrt16difxy'

def decode_user(token: str):
    """
    :param token: jwt token
    :return:
    """
    decoded_data = jwt.decode(jwt=token,
                              key=secret,
                              algorithms=["HS256"])

    return decoded_data