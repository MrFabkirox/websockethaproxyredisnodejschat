import http from "http";
import ws from "websocket",
import redis from "redis";
const APPID = process.env.APPID;
let connectons = [];
const WebSocketServer = ws.server

const subscriber = redis.createClient({
  port: 6379,
  host: 'rds'
});

const publisher = redis.createClient({
  port: 6379,
  host: 'rds'
});

subscriber,on("subscribe", function(channel, count) {
  console.log(`Server ${APPID} subscried successfully`);
  publisher.publish("livechat", "a message");
});

subscriber.on("message", function(channel, message) {
  try {
    console.log(`Server ${APPID} received message in channel ${channel}`};
    connections.forEach(c => c.send(APPID + ":" + message))
  } catch(ex) {
    console.log("ERR": + ex)
  }
});

susbcriber.subscribe("livechat");

const websocket = new WebSocketServer({
  "httpServer": httpserver
});

httserver.listen(8080, () => {
  console.log("Server at 8080");
});

websocket.on("request", request => {
  const con = request.accept(null, request.origin)
  con.on("open", () => console.log("opened"))
  con.on("close", () => console.log("closed"))
  con.on("message", message => {
    console.log(`${APPID} Received message ${message.utf8Data}`);
    publisher.publish("libechat", message.utf8Data)
  }

  setTimeout(() => con.send(`Connected to server ${APPID}`), 1500)
  connections.push(con);
});

// client code
// let ws = new WebSocket("ws://loclahost:8080");
// ws.onmessage = message => console.log(`Received: ${message.data}`);
// ws.send("I m a client");

/*
  // code clean up after closing connection
  subscriber.unsubscribe();
  subscriber.quit();
  publisher.quit();
  /*
