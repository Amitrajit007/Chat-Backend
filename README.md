# chat backend


## Model:

1. Fundamental structure

```mathematica
Socket.IO Client (User A)  ─┐
                            ├─>  Your Backend  ──>  Socket.IO Client (User B)
Socket.IO Client (User C)  ─┘
```

2. Working structure 

```mathematica
Client A
  └─ emit("chat-message")  → Backend
                               └─ io.emit("chat-message") → Client A + Client B
                                                                  └─ on("chat-message") logs it
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
Online :  [ 'Dummy-1' ]

Dummy-1 is connected in romm : dm:Dummy-1_Dummy-2

Online :  [ 'Dummy-1', 'Dummy-2' ]

Dummy-2 is connected in romm : dm:Dummy-1_Dummy-2
Client disconnect with id:  z9WzkUGusKb34sPoAAAB

Online :  [ 'Dummy-2' ]

Client disconnect with id:  nC_ruxh2t6tDAIWrAAAD

No one is Online
```
## Dummy-1 console:
```bash
online: [ 'Dummy-1' ]

You : Hello World! from Dummy-1  

online: [ 'Dummy-1', 'Dummy-2' ]

Dummy-2 : hello from Dummy-2

online: [ 'Dummy-1']

Disconnected.
```
## Dummy-2 console:
```bash
online: [ 'Dummy-1', 'Dummy-2' ]

You : Message is not accepted

Disconnected.
```


## N.B.

1. socket.id is a temporary identifier assigned per connection, used here only for debugging/logging.

## File structure
```
.
├── README.md
├── client
└── server
    ├── controller
    ├── package-lock.json
    ├── package.json
    ├── routes
    ├── src
    │   ├── index.ts
    │   └── types
    │       └── socket.ts
    ├── test
    │   ├── client-test-1.ts
    │   └── client-test-2.ts
    ├── tsconfig.json
    └── update
        └── update.md
```

## DataBase schema: example 

```json
{
  "roomId": "Dummy-3,Dummy-4",
  "id": "jxKCSoWK6t4p8vojAAAD",
  "from": "Dummy-4",
  "text": "I believe in peace! from Dummy-4",
  "to": "Dummy-3",
  "time": "28/12/2025, 2:45:46 am",
  "__v": 0
}
```
