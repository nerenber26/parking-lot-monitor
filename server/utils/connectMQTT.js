import mqtt from 'mqtt';


/**
 * Connects to an MQTT broker and sets up event listeners for connection, errors, and messages.
 *
 * @param {string} BROKER_HOST host of the MQTT broker
 * @param {number} BROKER_PORT port number of the MQTT broker
 * 
 * @returns {import('mqtt').MqttClient} The MQTT client instance that was connected to the broker.
 * 
 * @example
 * const client = connectClient('mqtt.example.com', 1883);
 * publishToTopic(client, 'my/topic', 'Hello, MQTT!');
 * subscribeToTopic(client, 'my/topic');
 */
export const connectClient = (BROKER_HOST, BROKER_PORT) => {
    const client = mqtt.connect(`mqtt://${BROKER_HOST}:${BROKER_PORT}`);

    client.on('connect', () => {
        console.log(`Connected to MQTT Broker: mqtt://${BROKER_HOST}:${BROKER_PORT}`);
    });

    client.on('error', (error) => {
        console.log('Error occurred:', error);
    });

    client.on('message', (topic, message) => {
        console.log(`MQTT client received message on topic ${topic}: ${message.toString()}`);
    });

    return client;
}

/**
 * Publishes a message to a specified MQTT topic.
 * 
 * @param {import('mqtt').MqttClient} client MQTT client instance
 * @param {string} topic MQTT topic to which the message will be published.
 * @param {string|Buffer} message message to be published. Can be a string or a Buffer.
 * @returns {void}
 */
export const publishToTopic = (client, topic, message) => {
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
 * @param {import('mqtt').MqttClient} client MQTT client instance
 * @param {string} topic MQTT topic to subscribe to.
 * @returns {void}
 */
export const subscribeToTopic = (client, topic) => {
    client.subscribe(topic, (err) => {
        if (err) {
            console.error(err);
        }
        console.log(`MQTT client subscribed to topic: ${topic}`);
    });
}