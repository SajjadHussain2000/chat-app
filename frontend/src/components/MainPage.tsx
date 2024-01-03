import React, { useEffect, useState } from "react";
import users from '../Data/dummyUser.json'
import "./MainPage.css";

const MainPage = () => {
  const [userList, setUserList] = useState<{id:string,name:string}[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [txt, setTxt] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | number | null>(null);
  const [messageList, setMessageList] = useState<{message:string}[]>([]);
  useEffect(() => {
    const webSocketService = new WebSocket(
      "ws://localhost:8080/",
      "echo-protocol"
    );
    
    webSocketService.addEventListener("open", () => {
      webSocketService.send(JSON.stringify(users));
      console.log("connected ");
    });

    webSocketService.addEventListener("message", (event): any => {
      console.log(event);
      
      const parsedData = JSON.parse(event.data);
      if (parsedData.messageType === 'USER_DATA')
        setUserList(parsedData.users);
      else if(parsedData.messageType === 'MESSAGE')
        setMessageList((prev)=>[...prev,{ message:parsedData.message }]);
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
        socket.send(JSON.stringify({ content:newMessage,recipient:selectedUserId,messageType:'MESSAGE'}));
      const msgEle = document.getElementById("message-section");
      const newMessageText = document.createElement("p");
      newMessageText.innerHTML = newMessage;
      msgEle?.appendChild(newMessageText);
      setTxt("");
      setNewMessage("");
    }
  };
  
  const onUserSelectHandler = (id: number | string | null) => {
    setMessageList([]);
    setSelectedUserId(id);
  }

  return (
    <main className="chat-section-wapper">
      <section className="section1">
        {
          userList.map((ele) => {
            return (<div className="profileSection" key={ele.id} onClick={()=>onUserSelectHandler(ele.id)}>
              <img
                src="/profile-pic.avif"
                alt="profile pic"
                className="profile-pic-img"
              />
              <p className="user-name">{ele.name}</p>
            </div>);
          })
        }
      </section>
      <section className="section2">
        <div className="messageSection" id="message-section">
          {
            messageList.map(ele => {
              return  <p className="message">ele.message</p>
            })
          }
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
