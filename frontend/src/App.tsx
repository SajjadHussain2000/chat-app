import { useEffect, useState } from "react";
import "./App.css";
import MainPage from "./components/MainPage";

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
    <MainPage/>
  );
};

export default App;
