#!/usr/bin/env bash

if [[ "$1" == "--prod" ]]; then
    gunicorn 'server:create_app()'
else
    flask --app server run --no-reload
fi
