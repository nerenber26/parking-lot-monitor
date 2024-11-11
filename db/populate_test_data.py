import argparse
import psycopg2
import random
from getpass import getpass
from datetime import datetime, timedelta


lot_names = [
    'Parking Lot #1',
    'Parking Lot #2',
    'Parking Lot #3',
    'Parking Lot #4',
]
sections = ['A', 'B', 'C', 'D']


def populate_parking_data(db_params):
    try:
        conn = psycopg2.connect(**db_params)
        conn.autocommit = True
        cur = conn.cursor()

        lot_ids = {}
        for lot_name in lot_names:
            for section in sections:
                total_spaces = random.randint(50, 200)
                cur.execute("""
                    INSERT INTO ParkingLots (name, section, total_spaces)
                    VALUES (%s, %s, %s) RETURNING lot_id;
                """, (f"{lot_name} - {section}", section, total_spaces))
                lot_id = cur.fetchone()[0]
                lot_ids[(lot_name, section)] = lot_id
        conn.commit()

        sensor_ids = []
        for i in range(1, 401):
            sensor_secret = f"sensor_secret_{random.randint(1000, 9999)}"
            cur.execute("""
                INSERT INTO Sensors (secret)
                VALUES (%s) RETURNING sensor_id;
            """, (sensor_secret,))
            sensor_id = cur.fetchone()[0]
            sensor_ids.append(sensor_id)
        conn.commit()

        sensor_index = 0
        for (lot_name, section), lot_id in lot_ids.items():
            for space_id in range(1, 26):
                status = random.choice([True, False])
                last_updated = datetime.now() - timedelta(days=random.randint(1, 30))
                sensor_id = sensor_ids[sensor_index]
                sensor_index += 1
                cur.execute("""
                    INSERT INTO ParkingSpaces (lot_id, sensor_id, occupied, last_updated)
                    VALUES (%s, %s, %s, %s);
                """, (lot_id, sensor_id, status, last_updated))
        conn.commit()

        cur.execute("SELECT space_id, occupied, last_updated FROM ParkingSpaces")
        spaces = cur.fetchall()

        for space in spaces:
            space_id, status, last_updated = space
            cur.execute("""
                INSERT INTO OccupancyEvents (space_id, event_time, occupied)
                VALUES (%s, %s, %s);
            """, (space_id, last_updated, status))
        conn.commit()

        print("Data populated successfully.")

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Database connection parameters.')
    parser.add_argument('--dbname', required=True, help='Database name')
    parser.add_argument('--user', required=True, help='Database username')
    parser.add_argument('--host', default='localhost', help='Database host (default: localhost)')
    parser.add_argument('--port', default='5432', help='Database port (default: 5432)')

    args = parser.parse_args()
    password = getpass(prompt='Enter your database password: ')

    db_params = {
        'dbname': args.dbname,
        'user': args.user,
        'password': password,
        'host': args.host,
        'port': args.port
    }

    populate_parking_data(db_params)
