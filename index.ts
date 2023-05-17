import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { Pool } from "pg";
import { Channel, connect, Connection } from "amqplib";
import Redis from "ioredis";
import * as dotenv from "dotenv";

// Define interface for environment variables
interface EnvVars {
    POSTGRES_URL: string;
    RABBITMQ_URL: string;
    REDIS_URL: string;
  }

dotenv.config();

const env = {
    POSTGRES_URL: process.env.POSTGRES_URL as string,
    RABBITMQ_URL: process.env.RABBITMQ_URL as string,
    REDIS_URL: process.env.REDIS_URL as string,
  };

const app = express();

// Parse JSON request bodies
app.use(bodyParser.json());

// Enable CORS requests
app.use(cors());

// Create a PostgreSQL connection pool
const pool = new Pool({
    connectionString: env.POSTGRES_URL,
});

// Create a RabbitMQ connection and channel
let channel: Channel;
connect(env.RABBITMQ_URL)
    .then((connection: Connection) => {
        return connection.createChannel();
    })
    .then((ch: Channel) => {
        channel = ch;
    })
    .catch((err: Error) => {
        console.error("Failed to create RabbitMQ channel:", err);
    });

// Create a Redis client
const redis = new Redis(env.REDIS_URL);

// Define an endpoint to retrieve data from PostgreSQL
app.get("/data", async (req, res) => {
    try {
        // Get a client from the connection pool
        const client = await pool.connect();

        // Query the database
        const result = await client.query("SELECT * FROM my_table");

        // Release the client back to the connection pool
        client.release();

        // Send the results back as a JSON response
        res.json(result.rows);
    } catch (err) {
        console.error("Failed to retrieve data from PostgreSQL:", err);
        res.sendStatus(500);
    }
});

// Define an endpoint to publish a message to RabbitMQ
app.post("/message", async (req, res) => {
    try {
        // Publish the message to RabbitMQ
        await channel.assertQueue("my_queue");
        await channel.sendToQueue("my_queue", Buffer.from(req.body.message));

        // Send a success response
        res.sendStatus(200);
    } catch (err) {
        console.error("Failed to publish message to RabbitMQ:", err);
        res.sendStatus(500);
    }
});

// Define an endpoint to cache data in Redis
app.post("/cache", async (req, res) => {
    try {
        // Set the value in Redis
        await redis.set(req.body.key, req.body.value);

        // Send a success response
        res.sendStatus(200);
    } catch (err) {
        console.error("Failed to cache data in Redis:", err);
        res.sendStatus(500);
    }
});

// Start the server
app.listen(3000, () => {
    console.log("Server listening on port 3000");
});