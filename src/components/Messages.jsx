import React, { useState, useEffect } from "react";
import { Message } from "./Message";
import { UseChat } from "../context/ChatContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../.idx/gc/firebase";
export const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = UseChat();

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists && setMessages(doc.data());
    });
    return () => {
      unsub();
    };
  }, [data.chatId]);
  console.log();
  return (
    <div className="messages">
      {messages && messages.messages ? (
        messages.messages.map((m) => <Message key={m.id} message={m} />)
      ) : ""}
    </div>
  );
};
