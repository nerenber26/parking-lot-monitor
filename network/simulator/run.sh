#!/usr/env/bin bash

make build

echo "Helo WOrld"

./build/chirpstack-simulator -c moist.toml