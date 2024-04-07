import React,{useState,useEffect} from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faVideo,
  faInfoCircle,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Messages } from "./Messages";
import { Input } from "./Input";
import { UseChat } from "../context/ChatContext";
import { useNavigate } from "react-router-dom";
library.add(faVideo, faInfoCircle, faArrowLeft);
export const Chat = () => {
   const [isMobile, setIsMobile] = useState(
     window.matchMedia("(max-width: 768px)").matches
   );
   useEffect(() => {
     const handleResize = () => {
       setIsMobile(window.matchMedia("(max-width: 768px)").matches);
     };

     window.addEventListener("resize", handleResize);

     return () => {
       window.removeEventListener("resize", handleResize);
     };
   }, []);
  const { data } = UseChat();

  const navigate = useNavigate();
  const handleClick = ()=>{
    navigate("/")
  }
  return (
    <div className="chat">
      {data.chatId != "null" ? (
        <React.Fragment>
          <div className="chatInfo">
            <div className="chat-name">
              <FontAwesomeIcon
                icon={faArrowLeft}
                className="chat-icons mobile"
                onClick={() => navigate("/")}
              />
              <img src={data.user?.photoURL} />
              <span>{data.user?.displayName}</span>
            </div>
            <div className="chat-icons">
              <FontAwesomeIcon icon={faVideo} />
              <FontAwesomeIcon icon={faInfoCircle} />
            </div>
          </div>
          <Messages />
          <Input />
        </React.Fragment>
      ) : (
        <>
          <h1 className="no-conversation">No Conversation Selected</h1>
          {isMobile ? <button className="back-btn" onClick={handleClick}> Go Back</button> : ""}
        </>
      )}
    </div>
  );
};
