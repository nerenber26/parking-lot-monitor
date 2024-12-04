class DevelopmentConfig:
    APP_HOST = "127.0.0.1"
    APP_PORT = 5000
    MQTT_BROKER_URL = "localhost"
    MQTT_BROKER_PORT = 3000
    MQTT_TOPIC = "lorawan"
    SQLALCHEMY_DATABASE_URI = 'postgresql+psycopg2://mmm:xxx@localhost:5432/parking'
    SQLALCHEMY_TRACK_MODIFICATIONS = False


configs = {
    "development": DevelopmentConfig,
}
