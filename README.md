# chat backend


## Model:

```mathematica
Socket.IO Client (User A)  ─┐
                            ├─>  Your Backend  ──>  Socket.IO Client (User B)
Socket.IO Client (User C)  ─┘
```

## Work Flow: 

 1. Client-side (browser):
 ```ts
 socket.on('chat message', function(msg) {
   console.log('New message:', msg);
 });
```

2. Server-side (Node.js):

```ts
io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    console.log('Received:', msg);
    socket.Broadcast.emit('chat message', msg); // Broadcast to all clients
  });
});

```

## Backend console:
```bash
Listening at 5000

a user connected:  3gUsuPqzb6o63WudAAAB
message recieved:  Hello World! from dummy 1 

a user connected:  N53Z4u-jdDrcADl0AAAD
message recieved:  Hello World! from dummy 1 

a user connected:  hBpYBRyp8zYVt5gSAAAF
message recieved:  Hello World! from dummy 1 

Client disconnect with id:  N53Z4u-jdDrcADl0AAAD
```

## N.B.

1. socket.id is a temporary identifier assigned per connection, used here only for debugging/logging.

## File structure
```
├── README.md
├── client
└── server
    ├── controller
    ├── node_modules
    ├── package-lock.json
    ├── package.json
    ├── routes
    ├── src
    │   ├── client-test.ts
    │   └── index.ts
    ├── tsconfig.json
    └── update
```
