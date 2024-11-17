import mqtt from 'mqtt';

const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL;
const MQTT_BROKER_PORT = process.env.MQTT_BROKER_PORT || 1883;

const client = mqtt.connect(`mqtt://${MQTT_BROKER_URL}:${MQTT_BROKER_PORT}`);

client.on('connect', () => {
    console.log(`Connected to MQTT Broker: mqtt://${MQTT_BROKER_URL}:${MQTT_BROKER_PORT}`);
});

client.on('error', (error) => {
    console.log('Error occurred:', error);
});

client.on('message', (topic, message) => {
    console.log(`MQTT client received message on topic ${topic}: ${message.toString()}`);
});

/**
 * Publishes a message to a specified MQTT topic.
 * 
 * @param {string} topic MQTT topic to which the message will be published.
 * @param {string|Buffer} message message to be published. Can be a string or a Buffer.
 * @returns {void}
 */
export const publishToTopic = (topic, message) => {
    client.publish(topic, message, (err) => {
        if (err) {
            console.error(err);
        }
        console.log(`MQTT client published to topic: ${topic}`);
    });
}


/**
 * Subscribes to a specified MQTT topic.
 * 
 * @param {string} topic MQTT topic to subscribe to.
 * @returns {void}
 */
export const subscribeToTopic = (topic) => {
    client.subscribe(topic, (err) => {
        if (err) {
            console.error(err);
        }
        console.log(`MQTT client subscribed to topic: ${topic}`);
    });
}