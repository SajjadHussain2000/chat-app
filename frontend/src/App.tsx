import { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  useEffect(() => {
    const webSocketService = new WebSocket(
      "ws://localhost:8080/",
      "echo-protocol"
    );

    webSocketService.addEventListener("open", () => {
      console.log("connected");
    });

    webSocketService.addEventListener("message", (event) => {
      console.log(event);
      // setMessages((prev)=>([...prev,event.data]));
    });

    webSocketService.addEventListener("close", () => {
      console.log("closed");
    });

    setSocket(webSocketService);

    return () => {
      webSocketService.close();
    };
  }, []);

  const sendMessage = () => {
    if (socket) {
      socket.send(newMessage);
      setNewMessage("");
    }
  };

  return (
    <main className="chats-wrapper">
      <div className="chats">
        <ul>
          <li>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore
            sapiente voluptates, nihil itaque iusto quidem quia consequatur,
            velit quas, error harum perspiciatis cupiditate dolores vel officia
            quod maiores expedita fuga.
          </li>
        </ul>
      </div>
      <div className="chat-input-wrapper">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </main>
  );
};

export default App;
