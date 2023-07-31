# DISTRIBUTED ORDER BOOKS

## ARCHITECTURE
This is comprised by a set of order books and a NameServer which provides all node names.

### NODES
Each node is comprised of two parts:
 - The order book: Which manages al user orders and maches orders coming from other users
 - And the comunicaton layer wich provides the hability to comunicate to other nodes. There are three communication procedures:
    - Place: To place an orden to the user address book
    - Order: To receive comunication from other nodes that a new order has been placed. This requires to check in the local order book for a macht
    - Match: Used to receive messages from matching orders. When an order matches to an other order in a user orther book, it is sent to the node that has this order to change the order book accordingly

### NAME SERVER
This name server has the name of all nodes. When any node is staring, it requres the list of all nodes to the name server. THe node will use this list to locate the resto of the nodes

## COMMANDS

**Package installation**
```
$ npm install
```

**Grape servers**
```
$ grape --dp 20001 --aph 30001 --bn '127.0.0.1:20002'
$ grape --dp 20002 --aph 40001 --bn '127.0.0.1:20001'
```

**NAME SERVER NODE**
```
$ node .\NServer.js user01 user02
```
**Parameters:** List of node names

**NODES**
```
$ node .\server.js user01 3000
$ node .\server.js user02 2000
```
**Parameters:**
- Server name
- Base port (it will use port, port+1 and port+2)

**EXAMPLE CLIENT**
```
$ node .\client.js
```
## TESTS
This has not been full tested as it requires much effort to validate comunications, sychronization and keeping consistency among nodes.
However, there exist a basic test for Order Book:
```
$ mocha .\OrderBook\index-test.js
```


## KNOWN LIMITATIONS
- Code has not been fully tested, this is far to be prepared for production. 
- Code would need to be refactored so it will be more maintainable
- Loging: Used traditional console.log statement. Better loging procedures must be put in place
- Error handling must be improved
- Edge cases have not been addresses (what happens if the same order is matched in two different servers). This issues are very complex and need to be analysed in depth.