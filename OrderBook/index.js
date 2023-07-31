// This class will manage all bid and ask orders
class OrderBook {
    constructor() {
      this.bids = []; // Array of buy orders
      this.asks = []; // Array of sell orders
    }
  
    // Add a new order to the order book
    addOrder(order) {
      if (order.type === 'bid') {
        this.addBid(order);
      } else if (order.type === 'ask') {
        this.addAsk(order);
      } else {
        throw new Error('Invalid order type. Use "bid" or "ask".');
      }
    }
  
    // Add a new bid (buy) order to the order book
    addBid(bidOrder) {
      this.bids.push(bidOrder);
      this.bids.sort((a, b) => b.price - a.price); // Sort bids in descending order
    }
  
    // Add a new ask (sell) order to the order book
    addAsk(askOrder) {
      this.asks.push(askOrder);
      this.asks.sort((a, b) => a.price - b.price); // Sort asks in ascending order
    }
  
    // Match a given order against the current order book
    matchOrder(order) {
    console.log("match order");
      if (order.type === 'bid') {
        return this.matchBid(order);
      } else if (order.type === 'ask') {
        return this.matchAsk(order);
      } else {
        throw new Error('Invalid order type. Use "bid" or "ask".');
      }
    }
  
    // Match a bid (buy) order against the current order book
    matchBid(bidOrder) {
        let changed=false;
        if( this.asks.length ==0) return changed;
        while (bidOrder.volume > 0 && this.asks.length > 0) {
            const lowestAsk = this.asks[0];

            if (bidOrder.price >= lowestAsk.price) {
            changed=true;
            // A trade can be executed
            const tradePrice = lowestAsk.price;
            const tradeVolume = Math.min(bidOrder.volume, lowestAsk.volume);
    
            // Update the volumes of the matching bid and ask orders
            bidOrder.volume -= tradeVolume;
            lowestAsk.volume -= tradeVolume;
    
            // Remove the ask order with zero volume from the order book
            if (lowestAsk.volume === 0) {
                this.asks.shift();
            }
    
            // The trade has been executed, you can process it further (e.g., record the trade).
            console.log(`Trade executed at price ${tradePrice}, volume ${tradeVolume}`);
            } else {
            // The bid order cannot be matched with the lowest ask, break the loo
            break;
            }
        }
  
        // If there's remaining volume in the bid order, add it to the order book
        if (bidOrder.volume > 0) {
            this.addBid(bidOrder);
        }
        return changed;
    }
  
    // Match an ask (sell) order against the current order book
    matchAsk(askOrder) {
        let changed=false;
        if( this.bids.length ==0) return changed;
        while (askOrder.volume > 0 && this.bids.length > 0) {
            const highestBid = this.bids[0];

            if (askOrder.price <= highestBid.price) {
                changed=true;
                console.log("Staus_ filed"+changed)+" order "+JSON.stringify(askOrder);
                // A trade can be executed
                const tradePrice = highestBid.price;
                const tradeVolume = Math.min(askOrder.volume, highestBid.volume);
        
                // Update the volumes of the matching bid and ask orders
                askOrder.volume -= tradeVolume;
                highestBid.volume -= tradeVolume;
        
                // Remove the bid order with zero volume from the order book
                if (highestBid.volume === 0) {
                    this.bids.shift();
                }
        
                // The trade has been executed, you can process it further (e.g., record the trade).
                console.log(`Trade executed at price ${tradePrice}, volume ${tradeVolume}`);
            } else {
            // The ask order cannot be matched with the highest bid, break the loop
                break;
            }
        }
    
        // If there's remaining volume in the ask order, add it to the order book
        if (askOrder.volume > 0) {
            this.addAsk(askOrder);
        }
        return changed;
    }

    remove(uuid){
        for(let i=0;i< this.bids.length;i++){
            let order = this.bids[i];
            if(order.uuid === uuid){
                this.bids.splice(i, 1);
                return;
            }
        }
        for(let i=0;i< this.asks.length;i++){
            let order = this.asks[i];
            if(order.uuid === uuid){
                this.asks.splice(i, 1);
                return;
            }
        }
    }

  }

  module.exports = OrderBook;
  