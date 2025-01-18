from os import environ

from flask import Flask, render_template

from app.pages.base import pages_bp
from app.api.base import api_bp

import sentry_sdk


def create_app():
    sentry_sdk.init(
        dsn=environ.get('SENTRY_DSN'),
        traces_sample_rate=1.0,
        _experiments={
            "continuous_profiling_auto_start": True,
        },
    )

    app = Flask(__name__, static_url_path="")

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
