"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const pg_1 = require("pg");
const amqplib_1 = require("amqplib");
const ioredis_1 = __importDefault(require("ioredis"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const env = {
    POSTGRES_URL: process.env.POSTGRES_URL,
    RABBITMQ_URL: process.env.RABBITMQ_URL,
    REDIS_URL: process.env.REDIS_URL,
};
const app = (0, express_1.default)();
// Parse JSON request bodies
app.use(body_parser_1.default.json());
// Enable CORS requests
app.use((0, cors_1.default)());
// Create a PostgreSQL connection pool
const pool = new pg_1.Pool({
    connectionString: env.POSTGRES_URL,
});
// Create a RabbitMQ connection and channel
let channel;
(0, amqplib_1.connect)(env.RABBITMQ_URL)
    .then((connection) => {
    return connection.createChannel();
})
    .then((ch) => {
    channel = ch;
})
    .catch((err) => {
    console.error("Failed to create RabbitMQ channel:", err);
});
// Create a Redis client
const redis = new ioredis_1.default(env.REDIS_URL);
// Define an endpoint to retrieve data from PostgreSQL
app.get("/data", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get a client from the connection pool
        const client = yield pool.connect();
        // Query the database
        const result = yield client.query("SELECT * FROM my_table");
        // Release the client back to the connection pool
        client.release();
        // Send the results back as a JSON response
        res.json(result.rows);
    }
    catch (err) {
        console.error("Failed to retrieve data from PostgreSQL:", err);
        res.sendStatus(500);
    }
}));
// Define an endpoint to publish a message to RabbitMQ
app.post("/message", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Publish the message to RabbitMQ
        yield channel.assertQueue("my_queue");
        yield channel.sendToQueue("my_queue", Buffer.from(req.body.message));
        // Send a success response
        res.sendStatus(200);
    }
    catch (err) {
        console.error("Failed to publish message to RabbitMQ:", err);
        res.sendStatus(500);
    }
}));
// Define an endpoint to cache data in Redis
app.post("/cache", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Set the value in Redis
        yield redis.set(req.body.key, req.body.value);
        // Send a success response
        res.sendStatus(200);
    }
    catch (err) {
        console.error("Failed to cache data in Redis:", err);
        res.sendStatus(500);
    }
}));
// Start the server
app.listen(3000, () => {
    console.log("Server listening on port 3000");
});
//# sourceMappingURL=index.js.map