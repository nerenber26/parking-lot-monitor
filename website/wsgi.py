from flask import Flask, render_template
from flask_minify import minify

from app.pages.base import pages_bp
from app.api.base import api_bp


def create_app():
    app = Flask(__name__, static_url_path="")
    minify(app, html=True, js=True, cssless=True)

    app.register_blueprint(pages_bp, url_prefix="/")
    app.register_blueprint(api_bp, url_prefix="/api")

    @app.errorhandler(404)
    def page_not_found(error):
        return render_template(
            "error.html",
            error_code=404,
            error_message="Page not found"
        ), 404

    @app.errorhandler(500)
    def internal_server_error(error):
        return render_template(
            "error.html",
            error_code=500,
            error_message="Internal server error"
        ), 500

    return app
