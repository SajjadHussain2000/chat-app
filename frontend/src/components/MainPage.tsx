import React, { useEffect, useState } from "react";
import "./MainPage.css";

const MainPage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [txt, setTxt] = useState("");
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

  const sendMessage = (e: any) => {
    e.preventDefault();
      if (socket && txt) {
      socket.send(newMessage);
      const msgEle = document.getElementById("message-section");
      const newMessageText = document.createElement("p");
      newMessageText.innerHTML = newMessage;
      msgEle?.appendChild(newMessageText);
      setTxt("");
      setNewMessage("");
    }
  };

  return (
    <main className="chat-section-wapper">
      <section className="section1">
        <div className="profileSection">
          <img
            src="/profile-pic.avif"
            alt="profile pic"
            className="profile-pic-img"
          />
          <p className="user-name">User 1</p>
        </div>
        <div className="profileSection">
          <img
            src="/profile-pic.avif"
            alt="profile pic"
            className="profile-pic-img"
          />
          <p className="user-name">User 2kvjgkuvutkuc</p>
        </div>
      </section>
      <section className="section2">
        <div className="messageSection" id="message-section">
          <p className="message">Hello! How are you?</p>
        </div>
        <div className="inputMessageSection">
          <input
            type="text"
            id="input-text-area"
            onChange={(event) => {
              setNewMessage(event.target.value);
              setTxt(event.target.value);
            }}
            value={txt}
          />
          <button className="send-btn" onClick={(e) => sendMessage(e)}>
            Send
          </button>
        </div>
      </section>
    </main>
  );
};

export default MainPage;
