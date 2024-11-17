-- add UUID generation extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS LoRaSensors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    secret CHAR(100) NOT NULL,
    CONSTRAINT unique_sensor_secret UNIQUE (secret) DEFERRABLE INITIALLY DEFERRED
);

CREATE TABLE IF NOT EXISTS ParkingLots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    total_spaces INT NOT NULL CHECK (total_spaces > 0),
    CONSTRAINT unique_parkinglot_name UNIQUE (name) DEFERRABLE INITIALLY DEFERRED
);

CREATE TABLE IF NOT EXISTS ParkingSpaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lot_id UUID REFERENCES ParkingLots(id) ON DELETE CASCADE ON UPDATE CASCADE,
    sensor_id UUID REFERENCES LoRaSensors(id) ON DELETE SET NULL ON UPDATE CASCADE,
    occupied BOOLEAN DEFAULT FALSE,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS OccupancyEvents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    space_id UUID REFERENCES ParkingSpaces(id),
    occupied BOOLEAN,
    event_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);