const EventEmitter = require('events');

class SSEManager extends EventEmitter {
  constructor(checkInterval = 5000) {
    // 5초마다 TTL 체크
    super();
    this.clients = new Map();
    this.checkInterval = checkInterval;
    this.intervalId = setInterval(
      () => this.checkExpiredClients(),
      this.checkInterval
    );
  }

  addClient(key, res, ttl = null) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    const expiresAt = ttl ? Date.now() + ttl * 1000 : null;
    const client = { res, lastEventId: 0, expiresAt };
    this.clients.set(key, client);

    res.on('close', () => {
      this.removeClient(key);
    });
  }

  removeClient(key) {
    const client = this.clients.get(key);
    if (client) {
      client.res.end();
      this.clients.delete(key);
    }
  }

  sendEvent(key, event, data) {
    const client = this.clients.get(key);
    if (client) {
      client.lastEventId++;
      const eventString = `id: ${
        client.lastEventId
      }\nevent: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
      console.log(eventString);
      client.res.write(eventString);
    }
  }

  broadcast(event, data) {
    for (const [key, client] of this.clients) {
      this.sendEvent(key, event, data);
    }
  }

  checkExpiredClients() {
    const now = Date.now();
    for (const [key, client] of this.clients) {
      if (client.expiresAt && client.expiresAt <= now) {
        this.removeClient(key);
      }
    }
  }

  close() {
    clearInterval(this.intervalId);
    for (const [key, client] of this.clients) {
      this.removeClient(key);
    }
  }
}

module.exports = SSEManager;
