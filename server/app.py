from flask import Flask, render_template
# from flask_minify import Minify

from utils.connectMQTT import mqtt
from utils.connectDB import db
from views import views
from api import api


app = Flask(
    __name__,
    template_folder="templates",
    static_folder="static",
    static_url_path="",
)
app.config.from_prefixed_env()

# Minify(app=app, html=True, js=True, cssless=True)

db.init_app(app)
mqtt.init_app(app)

app.register_blueprint(views, url_prefix="/")
app.register_blueprint(api, url_prefix="/api")

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


if __name__ == "__main__":
    if app.config.get("APP_ENV") != "production":
        app.run(
            host=app.config.get("APP_HOST", "127.0.0.1"),
            port=app.config.get("APP_PORT", 5000),
            debug=True,
        )
    else:
        app.run(
            host=app.config.get("APP_HOST", "127.0.0.1"),
            port=app.config.get("APP_PORT", 5000),
        )
