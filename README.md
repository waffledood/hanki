# `Hanki`

## What is `Hanki`?

`Hanki` is a simplified Anki card deck creator

## Technologies used for `Hanki`

Frontend: `React`

Mockups were created using [Readdy.ai](https://readdy.ai/)

Backend: `Spring Boot`

ORM: `Hibernate`

Database: `PostgreSQL`

## Running Hanki with Docker Compose

To start the entire Hanki application (backend, frontend, and database) using Docker Compose:

1. **Build the backend JAR**  
   First, build the Spring Boot backend JAR file. From the `hanki-backend` directory, run:

   ```sh
   ./gradlew build
   ```

   This will generate a JAR file in `hanki-backend/build/libs/`.

2. **Update the Dockerfile (if needed)**  
   Ensure the backend Dockerfile copies the correct JAR file name (e.g., `hanki-backend-0.1.jar`).  
   Edit [`hanki-backend/Dockerfile`](hanki-backend/Dockerfile) if your JAR name is different.

3. **Start all services**  
   From the root project directory (where `docker-compose.yaml` is located), run:

   ```sh
   docker-compose up --build
   ```

   This will build and start the database, backend, and frontend containers.

4. **Access the app**

   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:8080/hanki](http://localhost:8080/hanki)

5. **Stopping the app**  
   Press `Ctrl+C` in the terminal, then run:
   ```sh
   docker-compose down
   ```

**Note:**

- The first build may take a few minutes as Docker downloads dependencies.
- Make sure ports 3000 and 8080 are free on your machine.
- Any changes to the backend code require rebuilding the JAR and restarting the containers.

For troubleshooting, see the comments in [`docker-compose.yaml`](docker-compose.yaml).
