import mqtt from 'mqtt';


const client = mqtt.connect(`mqtt://${process.env.MQTT_BROKER_HOST}:${process.env.MQTT_BROKER_PORT}`);

client.on('connect', () => {
    console.log(`Connected to MQTT Broker: mqtt://${process.env.MQTT_BROKER_HOST}:${process.env.MQTT_BROKER_PORT}`);
});

client.on('error', (error) => {
    console.log('Error occurred:', error);
});

client.on('message', (topic, message) => {
    console.log(`MQTT client received message on topic ${topic}: ${message.toString()}`);
});

client.subscribe(process.env.MQTT_TOPIC, (err) => {
    if (err) {
        console.error(err);
    }
    console.log(`MQTT client subscribed to topic: ${process.env.MQTT_TOPIC}`);
});