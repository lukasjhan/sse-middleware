// server.js
const express = require('express');
const cors = require('cors');
const SSEManager = require('../sse/index');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const sseManager = new SSEManager();

// SSE 연결을 위한 엔드포인트
app.get('/sse', (req, res) => {
  const clientId = req.query.clientId;
  const ttl = req.query.ttl ? parseInt(req.query.ttl) : null;
  sseManager.addClient(clientId, res, ttl);
});

// 주식 가격 업데이트 시뮬레이션
const stocks = ['AAPL', 'GOOGL', 'MSFT', 'AMZN'];
function updateStockPrices() {
  stocks.forEach((stock) => {
    const price = (Math.random() * 1000).toFixed(2);
    sseManager.broadcast('stockUpdate', { stock, price });
  });
}

// 5초마다 주식 가격 업데이트
setInterval(() => {
  updateStockPrices();
  console.log('stocks updated');
}, 5000);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// 애플리케이션 종료 시 정리
process.on('SIGINT', () => {
  sseManager.close();
  process.exit(0);
});
