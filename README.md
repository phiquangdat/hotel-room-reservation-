### Fastest way to run this project:

```bash
docker compose up --build
```

```bash
make db/reset
```

---
## Demo

[![Watch the Demo](https://img.youtube.com/vi/eylVeSUtsbs/0.jpg)](https://youtu.be/eylVeSUtsbs)

> Click the image above to watch the walkthrough on YouTube.
---

## Overview

- **Hotel Room Reservation System**: A comprehensive web application designed for managing and booking hotel room reservations. This project features a modern, responsive frontend and a secure, scalable backend, orchestrated with DevOps best practices.

- **Tech Stack**: Spring Boot, Next.js, PostgreSQL, Docker, Jenkins, Makefile, TailwindCSS, Zustand, Lombok

## Features

- **User Authentication**: Secure login and registration using JWT.
- **Room Management**: Browse available rooms with detailed information.
- **Reservation System**: Book rooms for specific dates.
- **Roles Functionality**: Admin and User roles with different permissions.

## Prerequisites

- [Docker](https://www.docker.com/) installed and running.
- [Make](https://www.gnu.org/software/make/) (optional, for easy command execution).

## Installation & Running

1. **Clone the repository:**

   ```bash
   git clone https://github.com/phiquangdat/hotel-room-reservation.git
   cd hotel-room-reservation
   ```

2. **Start the application with Docker Compose:**

   ```bash
   docker compose up --build
   ```

   This will start the Backend (port 8080), Frontend (port 3000), and Database.

3. **Access the Application:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:8080](http://localhost:8080)

## Makefile Commands

This project includes a `Makefile` to simplify database management and other tasks.

```bash
make help        # Show available commands
make db/reset    # Full Reset: Wipes local DB, creates fresh one, and seeds it with mock data
make db/snapshot # Create a snapshot of the remote database (requires configuration)
make db/restore  # Restore the snapshot to the local database
```

## Project Structure

- `backend/`: Spring Boot application source code.
- `frontend/`: Next.js application source code.
- `db-data/`: Persisted database data (mounted volume).
- `Jenkinsfile`: CI/CD configuration.
- `docker-compose.yml`: Service orchestration.

```

```
