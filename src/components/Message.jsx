import React, { useEffect, useRef } from "react";
import { UseAuth } from "../context/AuthContext";
import { UseChat } from "../context/ChatContext";
import { formatDistanceToNow } from "date-fns";

export const Message = ({ message }) => {
  const { currentUser } = UseAuth();
  const { data } = UseChat();
  const isOwner = message.senderId === currentUser.uid;
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div className={`message ${isOwner ? "owner" : ""}`} ref={ref}>
      <div className="message-info">
        <img
          src={isOwner ? currentUser.photoURL : data.user.photoURL}
          alt="User"
        />
      </div>
      <div className="message-content">
        {message.img && <img src={message.img} alt="Message" />}
        {message.text && <p>{message.text}</p>}
        <span className="message-time">
          {formatDistanceToNow(message.date.toDate(), {
            addSuffix: true,
          })}
        </span>
      </div>
    </div>
  );
};
