from flask import Blueprint, render_template, request, g

api = Blueprint("api", __name__)

@api.route("/", methods=["GET"])
def index_api():
    return "THI IS API"
