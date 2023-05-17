# Dockerized-Template

Github Repo URL: https://github.com/emin-eren-erdem/dockerized-template.git

#### Redis, PostgreSQL, RabbitMQ, Express.js, TypeScript API implementations in a single app bundle, fully dockerized.

Regarding the software architecture, the code follows a basic three-tier architecture pattern where the application is divided into three separate layers: presentation, business, and data access. The presentation layer is represented by the Express.js web framework, which handles incoming HTTP requests and sends responses. The business logic layer includes the code that retrieves data from PostgreSQL, publishes messages to RabbitMQ, and caches data in Redis. The data access layer is abstracted away by the pg PostgreSQL client library, the amqplib RabbitMQ client library, and the ioredis Redis client library.

This is just a basic example and there are certainly more complex and sophisticated architectures that can be used for larger, more complex applications.

#### Dependencies

    amqplib: A Node.js client for RabbitMQ.
    redis: A Node.js client for Redis.
    pg: A Node.js client for PostgreSQL.
    pg-pool: A connection pool for PostgreSQL.
    express: A Node.js web framework.
    body-parser: A middleware for parsing HTTP request bodies.
    cors: A middleware for handling Cross-Origin Resource Sharing (CORS) requests.

# Usage

    npm install
    tsc build
    npm run start

If you want to use Docker:

Build the Docker image using the Dockerfile:

    docker build -t your-image-name 

Run the application using 
    docker-compose up

## .env

    POSTGRES_URL: The URL for the PostgreSQL database. For example: postgresql://username:password@localhost:5432/mydatabase.
    RABBITMQ_URL: The URL for the RabbitMQ server. For example: amqp://username:password@localhost:5672.
    REDIS_URL: The URL for the Redis server. For example: redis://localhost:6379.

#### Default .env variables:

    POSTGRES_HOST=db
    POSTGRES_PORT=5432
    POSTGRES_DB=postgres
    POSTGRES_USER=postgres
    POSTGRES_PASSWORD=examplepassword

    REDIS_HOST=redis
    REDIS_PORT=6379

    RABBITMQ_HOST=rabbitmq
    RABBITMQ_PORT=5672
    RABBITMQ_USER=guest
    RABBITMQ_PASSWORD=guest

    PORT=3000