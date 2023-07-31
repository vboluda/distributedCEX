const chai = require('chai');
const assert = chai.assert;
const OrderBook = require('./');

describe('OrderBook', function () {
  let orderBook;

  beforeEach(function () {
    orderBook = new OrderBook();
  });

  it('Add bid order to order book', function () {
    orderBook.addOrder({ type: 'bid', price: 50000, volume: 1 });

    assert.equal(orderBook.bids.length, 1);
    assert.deepEqual(orderBook.bids[0], { type: 'bid', price: 50000, volume: 1 });
  });

  it('add ask order to book', function () {
    orderBook.addOrder({ type: 'ask', price: 52000, volume: 2 });

    assert.equal(orderBook.asks.length, 1);
    assert.deepEqual(orderBook.asks[0], { type: 'ask', price: 52000, volume: 2 });
  });

  it('Order with a higher ask order', function () {
    orderBook.addOrder({ type: 'bid', price: 50000, volume: 1 });
    orderBook.addOrder({ type: 'ask', price: 52000, volume: 2 });

     orderBook.matchOrder({ type: 'bid', price: 52000, volume: 1 });

    assert.equal(orderBook.bids.length, 1);
    assert.equal(orderBook.asks.length, 1);
    assert.equal(orderBook.bids[0].volume, 1);
    assert.equal(orderBook.asks[0].volume, 1);
  });

  it('order with a lower bid ordr', function () {
    orderBook.addOrder({ type: 'ask', price: 52000, volume: 2 });
    orderBook.addOrder({ type: 'bid', price: 50000, volume: 1 });

    let changed = orderBook.matchOrder({ type: 'ask', price: 50000, volume: 1 });

    assert.equal(changed, true);
    assert.equal(orderBook.bids.length, 0);
    assert.equal(orderBook.asks.length, 1);
    //assert.equal(orderBook.bids[0].volume, 1);
    assert.equal(orderBook.asks[0].volume, 2);
  });

  it('Ask order with a lower bid order but not completelly', function () {
    orderBook.addOrder({ type: 'ask', price: 52000, volume: 2 });
    orderBook.addOrder({ type: 'bid', price: 50000, volume: 2 });

    let changed = orderBook.matchOrder({ type: 'ask', price: 40000, volume: 1 });

    assert.equal(changed, true);
    assert.equal(orderBook.bids.length, 1);
    assert.equal(orderBook.asks.length, 1);
    //assert.equal(orderBook.bids[0].volume, 1);
    assert.equal(orderBook.asks[0].volume, 2);
  });

  it('Ask order not fullfiled', function () {
    orderBook.addOrder({ type: 'ask', price: 52000, volume: 2 });
    orderBook.addOrder({ type: 'bid', price: 50000, volume: 2 });

    let changed = orderBook.matchOrder({ type: 'ask', price: 100000, volume: 1 });

    assert.equal(changed, false);
  });

  it('remove', function () {
    orderBook.addOrder({ type: 'ask', price: 52000, volume: 2, uuid: "id1" });
    orderBook.addOrder({ type: 'bid', price: 50000, volume: 2, uuid: "id2"  });

    orderBook.remove("id2");

    assert.equal(orderBook.bids.length, 0);
    assert.equal(orderBook.asks.length, 1);
  });



});
