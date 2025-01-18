# Parking Lot Monitor

This project is a **proof-of-concept** system for real-time monitoring of parking space
availability, designed to be low-cost, low-maintenance, and scalable. It leverages custom-built
IoT sensors and a lightweight data processing pipeline to periodically obtain live occupancy
status of individual spaces and display them through an interactive website. Historical data
is saved and can be used for statistical displays or internal analysis for parking management.

# Setup and Deployment

> [!Note]
> This is a monorepo of multiple independent components required to setup the system. Please read
> the documentation of each specific service for proper setup and deployment.

- [LoRaWAN End-Devices](./devices/README.md)
- [LoRaWAN Gateway](./gateway/README.md)
- [LoRaWAN Network Server](./server/README.md)
- [Web Application](./website/README.md)

# Project Architecture

![Project Architecture Overview Diagram](./_assets/ProjectArchitecture.svg)

## LoRaWAN End-Devices

Each parking space will be fitted with an **end-device** that includes a **time-of-flight sensor**
and **magnetic-field sensor** for event monitoring (e.g. vehicle moving over the spot). These
sensors are connected to an **ESP32 microcontroller**, which handles the frequency and pings and
transmission of data through the modulation technique **Chirp Spread Spectrum (CSS)**. It is
powered by a small built-in battery designed to last over 1+ years.

## LoRaWAN Gateway

> [!Note]
> Specification of the LoRaWAN gateway for this project is still being determined.

**Chirp signals** broadcasted by the **end-devices** will be monitored by the **LoRaWAN gateway**
on on **915 Hz** *(for the United Stated)*. This non-IP protocol cannot be processed or
transmitted by traditional web servers directly, requiring a gateway to decode and forward packets
to a central server for storage and further processing.

## LoRaWAN Network Server

The **LoRaWAN network server** is responsible for decoding the data sent by the **end-devices**
and processing it accordingly. It serves as the central hub for managing the entire LoRaWAN
network, where configurations for gateways, devices, and rules for handling incoming data are
defined. This includes tasks such as validating device data, ensuring security, and routing the
data to the appropriate application servers for further use.

## Web Application

The **web application** serves as a forward-facing platform that allows users to view data
collected and processed by the LoRaWAN network. It displays real-time and historical sensor
data in an easy-to-understand format, providing insights into the information gathered by
end-devices.

# Attribution

## Citations

- https://github.com/chirpstack
- https://github.com/TheThingsNetwork

## Contributors