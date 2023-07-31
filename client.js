'use strict'

const { PeerRPCClient }  = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link')

const link = new Link({
  grape: 'http://127.0.0.1:30001'
})
link.start()

const peer = new PeerRPCClient(link, {})
peer.init()

async function send(to,order){
    console.log("Sending to "+to);
    return new Promise((resolve,reject) =>{
        peer.request(to+".place",order, { timeout: 10000 }, (err, data) => {
            if (err) {
              console.error(err)
              reject(e);
            }
            resolve(data);
          })
    });
}

(async ()=>{
    await send("user01",{ type: 'bid', price: 52000, volume: 2 });
    await send("user01",{ type: 'bid', price: 40000, volume: 4 });
    await send("user02",{ type: 'ask', price: 40000, volume: 4 });
})();

