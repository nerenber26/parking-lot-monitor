import argparse
import psycopg2
import random
import string
from getpass import getpass
from datetime import datetime, timedelta


lot_names = [
    'Main Lot',
    'Commons Lot',
    'Waldschmidt Lot',
    'Shiley Lot',
    'Christie Lot',
    'Kenna Lot',
    'Postmouth',
]

def generate_random_secret(length=100):
    characters = string.ascii_letters + string.digits + string.punctuation.replace("'", "")  # Letters, digits, and symbols excluding single quotes
    return ''.join(random.choice(characters) for _ in range(length))


# Generate a random timestamp within the past 2 years
def generate_random_timestamp():
    end_date = datetime.now()
    start_date = end_date - timedelta(days=365*2)  # 2 years ago
    random_timestamp = start_date + (end_date - start_date) * random.random()
    return random_timestamp


def populate_parking_data(db_params):
    try:
        conn = psycopg2.connect(**db_params)
        conn.autocommit = True
        cur = conn.cursor()

        for lot_name in lot_names:
            cur.execute("""
                INSERT INTO ParkingLots (name, total_spaces)
                VALUES (%s, %s);
            """, (lot_name, random.randint(50, 200)))

        cur.execute("SELECT id, total_spaces FROM ParkingLots;")
        parking_lots = cur.fetchall()

        # For each parking lot, insert LoRaSensors equal to total_spaces
        for total_spaces in parking_lots:
            for _ in range(total_spaces[1]):  # Insert one sensor for each parking space
                secret = generate_random_secret(100)  # Generate a random secret of 100 characters
                cur.execute("""
                    INSERT INTO LoRaSensors (secret)
                    VALUES (%s);
                """, (secret,))
        
        cur.execute("SELECT id FROM LoRaSensors;")
        sensors = cur.fetchall()

        sensor_idx = 0
        for lot_id, total_spaces in parking_lots:
            for _ in range(total_spaces):  # For each parking space in this lot
                sensor_id = sensors[sensor_idx][0]
                occupied = random.choice([True, False])  # Randomly set occupied status
                last_updated = generate_random_timestamp()  # Generate random last_updated timestamp
                cur.execute("""
                    INSERT INTO ParkingSpaces (lot_id, sensor_id, occupied, last_updated)
                    VALUES (%s, %s, %s, %s);
                """, (lot_id, sensor_id, occupied, last_updated))

                sensor_idx += 1  # Move to the next sensor

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
