CREATE TABLE ParkingLots (
    lot_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    section CHAR(1),
    total_spaces SMALLINT
);

CREATE TABLE Sensors (
    sensor_id SERIAL PRIMARY KEY,
    secret CHAR(100)
);

CREATE TABLE ParkingSpaces (
    space_id SERIAL PRIMARY KEY,
    lot_id INT REFERENCES ParkingLots(lot_id),
    sensor_id INT REFERENCES Sensors(sensor_id),
    occupied BOOLEAN DEFAULT FALSE,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE OccupancyEvents (
    event_id SERIAL PRIMARY KEY,
    space_id INT REFERENCES ParkingSpaces(space_id),
    occupied BOOLEAN,
    event_time TIMESTAMP
);

CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR,
    password VARCHAR
);
