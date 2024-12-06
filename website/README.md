# Parking Lot Monitor System - Website

*WIP*

# Requirements

- Python
  - Flask
    - Flask-SqlAlchemy
    - Flask-Mqtt
    - Flask-Minify
- PostgreSQL Database
- Mosquitto MQTT Broker

# Development and Deployment

```bash
if [[ "$1" == "--prod" ]]; then
    gunicorn 'server:create_app()'
else
    flask --app server run --no-reload
fi
```

# Considerations

- Flask-MQTT is only recommended for single worker implementation. This way cause problems when
needing to scale the server application. Potential solution is to extract the MQTT service to its
own backend server since the client would never need access to it and only requires interaction
between the LoRa sensors and the database.
- Move tailwindcss and other frontend utilities into its own folder?
