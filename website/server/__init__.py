from flask import Flask, render_template

from config import configs
from server.routes import pages_bp, api_bp
from server.extensions import db, mqtt, minify


def create_app(config_name="development"):
    app = Flask(__name__, static_url_path="")
    app.config.from_object(configs[config_name])

    minify.init_app(app)

    db.init_app(app)

    mqtt.init_app(app)

    app.register_blueprint(pages_bp, url_prefix="/")
    app.register_blueprint(api_bp, url_prefix="/api/v1")

    @app.errorhandler(404)
    def page_not_found(error):
        app.logger.debug(error)
        return render_template(
            "error.html",
            page_title="404",
            error_message="Page not found",
        ), 404

    @app.errorhandler(500)
    def internal_server_error(error):
        app.logger.debug(error)
        return render_template(
            "error.html",
            page_title="500",
            error_message="Internal server error",
        ), 500

    return app
