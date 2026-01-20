# Node.js Express with CORS and MongoDB in Docker

A Node.js Express server with CORS enabled and MongoDB, fully containerized with Docker.

## Features

- **Express.js**: Lightweight web framework
- **CORS**: Cross-Origin Resource Sharing enabled
- **MongoDB**: NoSQL database with Mongoose ODM
- **Docker**: Containerized deployment

## Project Structure

```
.
├── src/
│   └── index.js           # Express server with CORS, MongoDB, and routes
├── Dockerfile             # Docker image definition
├── docker-compose.yml     # Multi-container setup (Node.js + MongoDB)
├── package.json           # Dependencies
├── .env                   # Environment variables
└── README.md              # This file
```

## Setup

### Using Docker Compose

```bash
# Build and start the container
docker-compose up --build

# Stop the container
docker-compose down
```

### Local Development

```bash
# Install dependencies
npm install

# Start the server
npm start
```

## API Endpoints

### Users

- `GET /users` - Get all users
- `POST /users` - Create a user
- `GET /users/:id` - Get user by ID

### Posts

- `GET /posts` - Get all posts
- `POST /posts` - Create a post

### Health

- `GET /health` - Health check

## Environment Variables

```env
MONGO_URI=mongodb://admin:password@localhost:27017/nodedb?authSource=admin
NODE_ENV=production
PORT=3000
```

## Docker Commands

```bash
# Build image
docker build -t node-prisma-app .

# Run container
docker run -p 3000:3000 node-prisma-app

# View logs
docker-compose logs -f app

# Access Prisma Studio (in docker)
docker-compose exec app npx prisma studio
```

## Database Management

```bash
# Create migration
npm run prisma:migrate

# View database UI
npm run prisma:studio

# Generate Prisma Client
npm run prisma:generate
```

## Notes

- PostgreSQL runs in a Docker container accessible at `postgres:5432`
- Application auto-restarts on file changes in dev mode
- Database data persists in Docker volume `postgres_data`
