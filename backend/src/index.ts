import { server as WebSocketServer } from "websocket";
import http from "http";

var server = http.createServer(function (request: any, response: any) {
  console.log(new Date() + " Received request for " + request.url);
  response.writeHead(404);
  response.end();
});

server.listen(8080, function () {
  console.log(new Date() + " Server is listening on port 8080");
});

const wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false,
});

// Keep track of connected clients
const connections: any[] = [];

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsServer.on("request", function (request) {
  if (!originIsAllowed(request.origin)) {
    // Make sure we only accept requests from an allowed origin
    request.reject();
    console.log(
      new Date() + " Connection from origin " + request.origin + " rejected."
    );
    return;
  }

  var connection = request.accept("echo-protocol", request.origin);
  console.log(
    new Date() + " Connection accepted with peer :" + connection.remoteAddress
  );

  // Add the new connection to the list
  connections.push(connection);

  connection.on("message", function (message) {
    if (message.type === "utf8") {
      console.log("Received Message: " + message.utf8Data);

      // Broadcast the message to all connected clients
      broadcast(message.utf8Data);
    } else if (message.type === "binary") {
      console.log(
        "Received Binary Message of " + message.binaryData.length + " bytes"
      );

      // Broadcast the binary message to all connected clients
      broadcastBytes(message.binaryData);
    }
  });

  connection.on("close", function (reasonCode, description) {
    console.log(
      new Date() + " Peer " + connection.remoteAddress + " disconnected."
    );

    // Remove the closed connection from the list
    const index = connections.indexOf(connection);
    if (index !== -1) {
      connections.splice(index, 1);
    }
  });
});

// Function to broadcast a UTF-8 message to all connected clients
function broadcast(message: string) {
  connections.forEach(function (client) {
    client.sendUTF(message);
  });
}

// Function to broadcast binary data to all connected clients
function broadcastBytes(data: Buffer) {
  connections.forEach(function (client) {
    client.sendBytes(data);
  });
}
