from flask import Blueprint


api_bp = Blueprint("api", __name__)

@api_bp.route("/")
def root_api():
    return "Hello, World!!!!"