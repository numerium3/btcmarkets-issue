const fs = require('fs');

class Orders {
  
  constructor(fn) {
    this.orders = new Map();
    this.fn = fn;
  }

  set(price, amount) {
    if (amount !== 0) {
      this.orders.set(price, amount);
    } else {
      this.orders.delete(price);
    }
  }

  toArray() {
    return Array.from(this.orders).sort((a, b) => this.fn(a[0], b[0]));
  }
}

class OrderBook {
  constructor() {
    this.bids = new Orders((a, b) => b - a);
    this.asks = new Orders((a, b) => a - b);
  }
}

const log = fs.readFileSync('log.txt', 'utf8');
const lines = log.split('\n');

const orderBook = new OrderBook();

for (const line of lines) {
  const timestamp = new Date(line.substr(0, 30));
  const message = line.substr(31);
  const json = JSON.parse(message);
  
  if (json.marketId === 'BTC-AUD') {
    console.log(timestamp, message);
    for (const order of json.bids) {
      orderBook.bids.set(parseFloat(order[0]), parseFloat(order[1]));
    }
    for (const order of json.asks) {
      orderBook.asks.set(parseFloat(order[0]), parseFloat(order[1]));
    }
  }
}

console.log({
  bids: orderBook.bids.toArray(),
  asks: orderBook.asks.toArray(),
});
