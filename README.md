# SSE Middleware for Express

## Introduction

This SSE (Server-Sent Events) Middleware for Express provides a robust and efficient way to implement real-time, server-to-client communication in your Node.js applications. It offers a simple API for managing SSE connections, sending targeted events to specific clients, and broadcasting messages to all connected clients.

## Features

- Easy integration with Express.js applications
- Client management with unique identifiers
- Optional Time-To-Live (TTL) for connections
- Efficient broadcasting to all connected clients
- Automatic handling of client disconnections
- Configurable check interval for expired clients

## Installation

To install the SSE Middleware, run the following command in your project directory:

```bash
npm install sse-express-middleware
```

## Usage

### Basic Setup

First, import the SSE Manager and create an instance:

```javascript
const express = require('express');
const SSEManager = require('sse-express-middleware');

const app = express();
const sseManager = new SSEManager();

// Your routes and other middleware
```

### Adding Clients

To add a new SSE client connection, use the following route:

```javascript
app.get('/sse', (req, res) => {
  const clientId = req.query.clientId;
  const ttl = req.query.ttl ? parseInt(req.query.ttl) : null;
  sseManager.addClient(clientId, res, ttl);
});
```

### Sending Events

To send an event to a specific client:

```javascript
sseManager.sendEvent(clientId, 'eventName', { key: 'value' });
```

### Broadcasting Events

To send an event to all connected clients:

```javascript
sseManager.broadcast('eventName', { key: 'value' });
```

### Handling Client Disconnection

The middleware automatically handles client disconnections. However, you should properly close the SSE Manager when shutting down your application:

```javascript
process.on('SIGINT', () => {
  sseManager.close();
  process.exit(0);
});
```

## API Reference

### `SSEManager`

#### Constructor

```javascript
new SSEManager((checkInterval = 30000));
```

- `checkInterval`: The interval (in milliseconds) to check for expired clients. Default is 30000 (30 seconds).

#### Methods

- `addClient(key: string, res: express.Response, ttl?: number): void`
  Adds a new client connection.

  - `key`: A unique identifier for the client.
  - `res`: The Express response object.
  - `ttl`: (Optional) Time-to-live in seconds for the connection.

- `removeClient(key: string): void`
  Removes a client connection.

  - `key`: The unique identifier of the client to remove.

- `sendEvent(key: string, event: string, data: any): void`
  Sends an event to a specific client.

  - `key`: The unique identifier of the target client.
  - `event`: The name of the event.
  - `data`: The data to send with the event.

- `broadcast(event: string, data: any): void`
  Sends an event to all connected clients.

  - `event`: The name of the event.
  - `data`: The data to send with the event.

- `close(): void`
  Closes all client connections and stops the interval timer.

## Configuration

The SSE Manager can be configured by adjusting the `checkInterval` parameter when creating an instance. This determines how frequently the manager checks for expired clients:

```javascript
const sseManager = new SSEManager(60000); // Check every 60 seconds
```

## Best Practices

1. Generate unique client IDs on the server-side to prevent conflicts.
2. Implement proper error handling for SSE connections on both server and client sides.
3. Use TTL for connections that should not persist indefinitely.
4. Regularly monitor the number of active connections to ensure optimal performance.

## Performance Considerations

- The SSE Manager uses a single interval timer to check all clients, which is more efficient than creating individual timers for each client.
- Consider the frequency of broadcasts and the number of connected clients to avoid overwhelming the server or clients.
- For high-traffic applications, consider implementing load balancing and scaling strategies.

## Security Considerations

1. Validate and sanitize client IDs and any data received from clients.
2. Implement authentication and authorization mechanisms to control access to SSE endpoints.
3. Use HTTPS to encrypt SSE connections and prevent eavesdropping.
4. Be cautious about the data sent through SSE to avoid exposing sensitive information.

## Troubleshooting

Common issues and their solutions:

1. **Clients not receiving events:**

   - Ensure CORS is properly configured if the client is on a different domain.
   - Check if the client is correctly parsing the received events.

2. **High server load:**

   - Increase the `checkInterval` to reduce the frequency of expired client checks.
   - Optimize the data sent through events to reduce payload size.

3. **Memory leaks:**
   - Ensure that `removeClient` is called when a client disconnects unexpectedly.
   - Monitor the number of connected clients and implement connection limits if necessary.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

---

For more information or support, please open an issue in the GitHub repository.
