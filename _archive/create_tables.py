import psycopg2
import argparse
import getpass


def create_database(db_params, sql_file_path):
    try:
        conn = psycopg2.connect(**db_params)
        conn.autocommit = True
        cursor = conn.cursor()

        with open(sql_file_path, 'r') as file:
            init_sql = file.read()

        cursor.execute(init_sql)
        print("Database tables created successfully.")

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Database connection parameters.')
    parser.add_argument('--db', required=True, help='Database name')
    parser.add_argument('--user', required=True, help='Database username')
    parser.add_argument('--host', default='localhost', help='Database host (default: localhost)')
    parser.add_argument('--port', default='5432', help='Database port (default: 5432)')
    parser.add_argument('--sqlfile', required=True, help='Path to the SQL file to execute')

    args = parser.parse_args()

    password = getpass.getpass(prompt='Enter your database password: ')

    db_params = {
        'dbname': args.dbname,
        'user': args.user,
        'password': password,
        'host': args.host,
        'port': args.port
    }

    create_database(db_params, args.sqlfile)
