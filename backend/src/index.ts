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
const connections: { [key: string]: any } = {};

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsServer.on("request", function (request) {
  // ... (existing code)

  var connection = request.accept("echo-protocol", request.origin);
  console.log(
    new Date() + " Connection accepted with peer :" + connection.remoteAddress
  );

  connection.on("message", function (message) {
    if (message.type === "utf8") {
      console.log("Received Message: " + message.utf8Data);

      // Parse the message to extract recipient and content
      const parsedMessage = JSON.parse(message.utf8Data);
      if (parsedMessage.messageType === "USER_DATA") {
        connections[parsedMessage.users[0].id] = {
          connection,
          name: parsedMessage.users[0].name,
        };
        broadcast();
      } else if (parsedMessage.messageType === "MESSAGE") {
        const recipient = parsedMessage.recipient;
        const content = parsedMessage.content;

        // Send the message to the specified recipient
        console.log("debug ", parsedMessage);
        sendToOne(recipient, content);
      }
    } else if (message.type === "binary") {
      console.log(
        "Received Binary Message of " + message.binaryData.length + " bytes"
      );

      // Handle binary messages if needed
    }
  });

  connection.on("close", function (reasonCode, description) {
    console.log(
      new Date() + " Peer " + connection.remoteAddress + " disconnected."
    );

    // Remove the closed connection from the list
    delete connections[connection.remoteAddress];
  });
});

// Function to send a UTF-8 message to a specific connected client
function sendToOne(clientAddress: string, message: string) {
  const client = connections[clientAddress];
  if (client) {
    client.connection.sendUTF(
      JSON.stringify({ message: message, messageType: "MESSAGE" })
    );
  }
}

// Function to broadcast a UTF-8 message to all connected clients
function broadcast() {
  const allConnections = Object.keys(connections).map((ele) => {
    return { name: connections[ele].name, id: ele };
  });
  Object.keys(connections).forEach(function (client) {
    connections[client].connection.sendUTF(
      JSON.stringify({ users: allConnections, messageType: "USER_DATA" })
    );
  });
}

// Function to broadcast binary data to all connected clients
function broadcastBytes(data: Buffer) {
  connections.forEach(function (client) {
    client.sendBytes(data);
  });
}
