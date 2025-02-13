# Parking Lot Monitor

## Setup Instructions

### 1. Clone the Repository
```sh
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY/website-j
```

### 2. Install Dependencies
#### Backend
```sh
cd backend
npm install
```

#### Frontend
```sh
cd ../frontend
npm install
```

### 3. Environment Variables
Create a `.env` file inside the `backend/` directory with:
```
DB_USER=your_user
DB_PASS=your_password
DB_HOST=your_host
DB_NAME=your_database
```

### 4. Run with Docker
Ensure Docker is running, then execute:
```sh
docker-compose up --build
```

### 5. Open in Browser
Visit `http://localhost:5173` to see the frontend.

The backend runs on `http://localhost:5000`.

---
## Project Structure
```
website-j/
│── backend/                 # Node.js API
│   ├── index.js             # Main server file
│   ├── db.js                # Database connection
│   ├── Dockerfile           # Backend Docker setup
│   ├── package.json         # Dependencies
│── frontend/                # React Frontend
│   ├── src/
│   │   ├── pages/           # Home and About pages
│   │   ├── components/      # Reusable components
│   ├── package.json         # Dependencies
│   ├── vite.config.js       # Vite configuration
│   ├── Dockerfile           # Frontend Docker setup
│── docker-compose.yml       # Runs frontend & backend
│── README.md                # Setup guide
│── .gitignore               # Ignore unnecessary files
```

### Notes
- The backend provides an endpoint: `GET /blocks` to fetch block data from PostgreSQL.
- The frontend retrieves this data and displays it on the Home page.
- The About page has smooth scrolling animations using Framer Motion.
- The website is mobile-friendly.

---

### Future Enhancements
- Implement database setup
- Improve UI with additional features

