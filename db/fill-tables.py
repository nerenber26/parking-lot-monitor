import psycopg2
import random
from datetime import datetime, timedelta

# Establish a connection to the PostgreSQL database
conn = psycopg2.connect(
    dbname="parking_system",  # replace with your database name
    user="brycekwon",         # replace with your username
    password="Seldom-CYarve-Ahoy-Truth-Ma2hxogany-Paramedic", # replace with your password
    host="86.38.203.105",         # replace with your host if not localhost
    port="80"               # default port for PostgreSQL
)

cur = conn.cursor()

# 1. Clear Existing Data
cur.execute("TRUNCATE TABLE OccupancyEvents CASCADE;")
cur.execute("TRUNCATE TABLE ParkingSpaces CASCADE;")
cur.execute("TRUNCATE TABLE Sensors CASCADE;")
cur.execute("TRUNCATE TABLE ParkingLots CASCADE;")
conn.commit()

# 2. Insert Parking Lots
lot_names = [
    'Shiley Parking Lot', 'Library Parking Lot', 
    'Bauccio Commons Parking Lot', 'Waldschmit Parking Lot'
]
sections = ['A', 'B', 'C', 'D']

# Insert parking lots and collect lot_id for later use
lot_ids = {}
for lot_name in lot_names:
    for section in sections:
        cur.execute("""
            INSERT INTO ParkingLots (name, section, total_spaces) 
            VALUES (%s, %s, 100) RETURNING lot_id;
        """, (f"{lot_name} - {section}", section))
        lot_id = cur.fetchone()[0]  # Fetch the lot_id for this insertion
        lot_ids[(lot_name, section)] = lot_id  # Store lot_id by (lot_name, section)
conn.commit()

# 3. Insert Sensors
# Insert 400 sensors (one for each parking space)
sensor_ids = []
for i in range(1, 401):  # For 400 sensors
    sensor_secret = f"sensor_secret_{random.randint(1000, 9999)}"
    cur.execute("""
        INSERT INTO Sensors (secret) 
        VALUES (%s) RETURNING sensor_id;
    """, (sensor_secret,))
    sensor_id = cur.fetchone()[0]
    sensor_ids.append(sensor_id)
conn.commit()

# 4. Insert Parking Spaces
sensor_index = 0  # Sensor ID will start from 1 and increment
for (lot_name, section), lot_id in lot_ids.items():
    for space_id in range(1, 26):  # 25 spaces per section
        status = random.choice([True, False])  # Randomly occupied or unoccupied
        last_updated = datetime.now() - timedelta(days=random.randint(1, 30))  # Random last update within the last 30 days
        sensor_id = sensor_ids[sensor_index]  # Get the current sensor ID
        sensor_index += 1  # Move to the next sensor
        cur.execute("""
            INSERT INTO ParkingSpaces (lot_id, sensor_id, status, last_updated) 
            VALUES (%s, %s, %s, %s);
        """, (lot_id, sensor_id, status, last_updated))
conn.commit()

# 5. Insert Occupancy Events
# For each parking space, we will insert an occupancy event based on its current status and last_updated time
cur.execute("SELECT space_id, status, last_updated FROM ParkingSpaces")
spaces = cur.fetchall()

for space in spaces:
    space_id, status, last_updated = space
    cur.execute("""
        INSERT INTO OccupancyEvents (space_id, event_time, status) 
        VALUES (%s, %s, %s);
    """, (space_id, last_updated, status))
conn.commit()

# Close the connection
cur.close()
conn.close()

print("Data has been successfully inserted into the database!")
