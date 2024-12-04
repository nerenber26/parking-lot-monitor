from flask_mqtt import Mqtt

mqtt = Mqtt()

@mqtt.on_connect()
def handle_connect(client, userdata, flags, rc):
    mqtt.subscribe("lorawan")
    print(f"Connected with result code {rc}")

@mqtt.on_message()
def handle_mqtt_message(client, userdata, message):
    print(f"Received message: {message.payload.decode()} on topic {message.topic}")
