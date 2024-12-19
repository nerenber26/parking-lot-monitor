-- add UUID generation extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ParkingLots Table
CREATE TABLE IF NOT EXISTS ParkingLots (
    id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(), -- UUID primary key
    lot_name VARCHAR(100) NOT NULL UNIQUE,          -- Name of the parking lot, must be unique
    max_spots INTEGER NOT NULL CHECK (max_spots > 0) -- Maximum spots in the parking lot
);

-- LoRaSensors Table
CREATE TABLE IF NOT EXISTS LoRaSensors (
    id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(), -- UUID primary key
    lot_id UUID REFERENCES ParkingLots(id) ON DELETE CASCADE, -- Foreign key referencing ParkingLots
    secret VARCHAR(100) NOT NULL UNIQUE             -- Unique secret for the sensor
);

-- EventLog Table
CREATE TABLE IF NOT EXISTS EventLog (
    id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(), -- UUID primary key
    sensor_id UUID REFERENCES LoRaSensors(id) ON DELETE CASCADE, -- Foreign key referencing LoRaSensors
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP -- Timestamp of the event
);

-- Index on timestamp in EventLog for performance improvement on queries filtering by timestamp
CREATE INDEX idx_eventlog_timestamp ON EventLog(timestamp);


