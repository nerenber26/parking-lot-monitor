from flask_mqtt import Mqtt

mqtt = Mqtt()

@mqtt.on_connect()
def handle_connect(client, userdata, flags, rc):
    mqtt.subscribe(mqtt.app.config.get("MQTT_TOPIC"))
    print(f"Connected to MQTT broker with result code {rc}")

@mqtt.on_message()
def handle_mqtt_message(client, userdata, message):
    print(f"Received message: {message.payload.decode()}")
