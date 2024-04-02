import React, { useEffect, useState, useRef } from "react";
import { UseAuth } from "../context/AuthContext";
import { UseChat } from "../context/ChatContext";

export const Message = (message) => {
  const { currentUser } = UseAuth();
  const { data } = UseChat();
 const ref= useRef()
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const [owner, setOwner] = useState(false);
  useEffect(() => {
    const unsub = () => {
      message.message.senderId === currentUser.uid
        ? setOwner(true)
        : setOwner(false);
    };

    return () => {
      unsub();
    };
  }, []);

  return (
    <div className={`message ${owner ? "owner" : ""}`}>
      <div className="message-info">
        <img src={owner ? currentUser.photoURL : data.user.photoURL} />
      </div>
      <div className="message-content">
        {message.message.img ? <img src={message.message.img} /> : null}
        <p>{message.message.text} </p>{" "}
        <span className="message-time">9:12</span>
      </div>
    </div>
  );
};
