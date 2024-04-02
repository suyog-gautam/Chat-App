import React from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faVideo, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Messages } from "./Messages";
import { Input } from "./Input";
import { UseChat } from "../context/ChatContext";
library.add(faVideo, faInfoCircle);
export const Chat = () => {
  const { data } = UseChat();

  return (
    <div className="chat">
      <div className="chatInfo">
        <div className="chat-name">
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
    </div>
  );
};
