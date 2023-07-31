'use strict';

const { PeerRPCServer,PeerRPCClient }  = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link')
const { v4: uuidv4 } = require('uuid');

const OrderBook = require('./OrderBook');


if(process.argv.length != 4){
    console.error("Wrong argunments expects 4");
    console.error(" <name> <port>");
    process.exit(1);
}
const name = process.argv[2];
const basePort = +process.argv[3];
console.log("***************************");
console.info("NODE NAME: "+name);
console.info("BASE PORT: "+basePort);
console.log("***************************");

console.log("Create Link");
const link = new Link({
    grape: 'http://127.0.0.1:30001'
});
link.start();

const peerClient = new PeerRPCClient(link, {});
peerClient.init();

/**
 * GET ALL NAMES FORM NAMESERVER
 * @returns all names stored in nameserver
 */

async function getNames(){
    return new Promise((resolve,reject) =>{

        peerClient.request('ns', {}, { timeout: 10000 }, (err, data) => {
            if (err) {
                console.error(err)
                reject(err);
            }
            console.log(data);
            resolve(data.names);
        });
    })
}

async function transmitOrder(name,order){
    return new Promise((resolve,reject) =>{
        const sentTo = name+'.order';
        console.log("Tansmit to: "+sentTo)
        peerClient.request(sentTo, order, { timeout: 10000 }, (err, data) => {
            if (err) {
                console.error(err)
                reject(err);
            }
            console.log(data);
            resolve(data);
        });
    })
}

async function matchOrder(name,order){
    return new Promise((resolve,reject) =>{
        const sentTo = name+'.match';
        console.log("Match to: "+sentTo)
        peerClient.request(sentTo, order, { timeout: 10000 }, (err, data) => {
            if (err) {
                console.error(err)
                reject(err);
            }
            console.log(data);
            resolve(data);
        });
    })
}

console.log("Init peer");
const peer = new PeerRPCServer(link, {
    timeout: 300000
});
peer.init();

const serviceOrder = peer.transport('server');
serviceOrder.listen(basePort);
console.log("Created service for Order at port "+serviceOrder.port);

const serviceMatch = peer.transport('server');
serviceMatch.listen(basePort+1);
console.log("Created service for Match at port "+serviceMatch.port);

const servicePlace = peer.transport('server');
servicePlace.listen(basePort+2);
console.log("Created service for Place at port "+servicePlace.port);



(async ()=>{
    // Initialize local order book
    let orderBook = new OrderBook();
    //Get all names from name server
    let names = await getNames();

    // Anunces order and match
    const anonunceOrder = name+".order";
    const anonunceMatch = name+".match";
    const anonuncePlace = name+".place";
    console.log("Annunce: " + anonunceOrder);
    console.log("Annunce: " + anonunceMatch);
    console.log("Annunce: " + anonuncePlace);

    setInterval(function () {
        link.announce(anonunceOrder, serviceOrder.port, {});
        link.announce(anonunceMatch, serviceMatch.port, {});
        link.announce(anonuncePlace, servicePlace.port, {});

    }, 1000)

    serviceOrder.on('request', (rid, key, order, handler) => {
        console.log("Received at "+ anonunceOrder+":"+JSON.stringify(order));
        let changed = orderBook.matchOrder(order);
        console.log("Changed "+changed);
        console.log(JSON.stringify(orderBook));
        if(changed){ // MAtch or partial match
            console.log("MATCH!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            console.log(`At ${name} order: ${JSON.stringify(order)}`);
            matchOrder(order.origin,order);
        }
        handler.reply(null, { result: 'OK',order });
    });

    serviceMatch.on('request', (rid, key, order, handler) => {
        console.log("Received at "+ anonunceMatch+":"+JSON.stringify(order));
        orderBook.remove(order.uuid);
        handler.reply(null, { result: 'OK',order });
    });

    servicePlace.on('request', (rid, key, order, handler) => {
        console.log("Received at "+ anonuncePlace+":"+JSON.stringify(order));
        // include uuid for reference and the name of the user/server
        order["uuid"] = uuidv4();
        order["origin"] = name;

        orderBook.addOrder(order);
        //Send this order to all nodes except myself
        for(let i=0,sz=names.length;i<sz;i++){
            const serverName = names[i];
            if(serverName != name){
                console.log("Transmit to "+serverName);
                transmitOrder(serverName,order);
            }
        }

        handler.reply(null, { result: 'OK',order });
    });



})();





  

