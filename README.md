## About This Project

This Docker project was completed as part of a Docker Bootcamp to improve my understanding of containerization and DevOps practices. The bootcamp was based on a publicly available training series published on YouTube.

📺 YouTube Training Series: [Docker practical course by Tresmerge](https://youtu.be/tHP5IWfqPKk?si=SxOaRohRoFouyyJ5)





# Dockerized Node.js Application



## Table of Contents
1. [Problem to Solve with Docker](#problem-to-solve-with-docker)
2. [Node.js Application & Dockerization](#nodejs-application--dockerization)
3. [Local Development & Environment Management](#local-development--environment-management)
4. [Multi-Container Setup & Communication](#multi-container-setup--communication)
5. [Conclusions & Recommendations](#conclusions--recommendations)

---

## Problem to Solve with Docker

One common scenario:  
*A new developer joins a company and needs to deploy the application in a consistent environment across different machines.*

**Docker** addresses this issue by allowing us to:
- Package the application with its dependencies.
- Ensure consistent environments during development, testing, and deployment.
- Facilitate onboarding by avoiding the "works on my machine" problem.

---

## Node.js Application & Dockerization

### Development Tools

- **Nodemon**: Watches for file changes and automatically restarts the server.  
  `--save-dev` ensures it's only installed for development environments and not in production.

### Dockerizing the Application

#### Dockerfile

The `Dockerfile` contains a set of instructions to build the application image.  
Note:
- `EXPOSE 4000`: This serves as documentation indicating the app runs on port 4000, but **port forwarding must still be configured** when running the container.

#### Running the Container

```bash
docker run --name express-node-app -d -p 4000:4000 express-node-app
docker exec -it express-node-app bash
```

#### Definitions

- **Image**: A snapshot/template to create one or more containers.
- **Container**: An isolated environment (lightweight virtual machine) based on the image.

### Scripts in `package.json`

Using custom `scripts` allows us to simplify complex commands.  
However, you **must use `npm run <script>`** to invoke them correctly.

---

## Local Development & Environment Management

### Hot Reloading with Docker

In local development, hot reload allows code changes to reflect immediately without restarting the container.  
However, running `nodemon` inside Docker without a volume **won’t reflect changes**.

#### Solution: Bind Mount

```bash
docker run -v $(pwd):/app -p 4000:4000 express-node-app
```

This enables automatic syncing between the host and container directories.

### Bind Mount Pitfalls

- Changes made inside the container (e.g. deleting files) also affect the host.
- To protect host files from being affected:
  - Use read-only mode: `-v $(pwd):/app:ro`.

### Volumes

- **Anonymous Volumes**: Persist container data even if files are deleted from the host.
- Helps **decouple** container data from host files.

### When to Use Docker Compose?

If you're using **only one service**, a single container is enough.  
However, for **multi-service applications** (e.g., app + DB + Redis), use **`docker-compose.yml`** for orchestration.

---

## Docker Environments

In real-world projects, we handle multiple environments:
- Development
- Testing
- Production

### Passing Environment Variables

You can:
- Use `ENV` in the `Dockerfile`.
- Or pass them via command line using `--env`.

### Managing Multiple Environments

#### Two Approaches:

1. **Multiple Compose Files**:
   - `docker-compose.dev.yml`
   - `docker-compose.prod.yml`

2. **Shared Base File with Overrides**:
   - `docker-compose.yml` (common)
   - Extended by env-specific files.

### Dependency Optimization (Production)

Avoid including `nodemon` in production:

```dockerfile
RUN if [ "$NODE_ENV" = "production" ]; then       npm install --only=production;     else       npm install;     fi
```

Or use **multi-stage builds** with separate stages for development and production.

---

## Multi-Container Setup & Communication

When multiple containers are used (e.g., app + MongoDB), communication between containers is essential.

### Docker + MongoDB

- One container for the Node.js app.
- One for MongoDB.
- Mongo credentials and volumes are defined in `docker-compose.yml`.
- App connects via `mongodb://mongo:27017`.

⚠️ If you stop the container, **data is lost** unless persisted using volumes.

### Docker with Other Services

- **Redis**: For caching and pub/sub mechanisms.
- **Nginx**: For reverse proxy/load balancing.
- **Laravel**: Containerized PHP development framework.

### Dependency Order

Docker Compose does **not guarantee container startup order**.  
Use `depends_on` in `docker-compose.yml` to manage service dependencies:

```yaml
depends_on:
  - mongo
```

---

## Conclusions & Recommendations

- Docker simplifies development, deployment, and team collaboration.
- Use bind mounts and volumes wisely for data syncing and persistence.
- Apply environment-specific configuration through multi-stage builds or separate Compose files.
- Orchestrate services effectively with Docker Compose and ensure dependency management.
