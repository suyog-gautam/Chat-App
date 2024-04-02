import React, { useEffect, useState } from "react";
import { UseAuth } from "../context/AuthContext";
import { auth, db } from "../../.idx/gc/firebase";
import { Searchbar } from "./searchbar";
import { doc, onSnapshot } from "firebase/firestore";
import { UseChat } from "../context/ChatContext";
export const Sidebar = () => {
  const { currentUser, logout } = UseAuth();
  const { dispatch } = UseChat();
  const [chats, setChats] = useState([]);
  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(
        doc(db, "user-chats", currentUser.uid),
        (doc) => {
          setChats(doc.data());
        }
      );

      return () => {
        unsub();
      };
    };
    currentUser.uid && getChats();
  }, [currentUser.uid]);
  const handleSelect = (user) => {
    dispatch({ type: "CHANGE_USER", payload: user });
  };
  return (
    <div className="sidebar">
      <div className="top">
        <div className="sidebar-nav">
          <h1 className="header">Messages</h1>
          <div className="user-info">
            <img src={currentUser.photoURL} className="user-pp" />
            <p className="user-name">{currentUser.displayName}</p>
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </div>
        </div>

        <Searchbar />
      </div>
      <div className="bottom-container">
        {Object.entries(chats)
          ?.sort((a, b) => a.date - b.date)
          .map(([chatId, chatData]) => (
            <div
              className="single-container"
              key={chatId}
              onClick={() => handleSelect(chatData.userInfo)}
            >
              <div className="chat-info">
                <div className="left">
                  <img
                    src={chatData.userInfo.photoURL}
                    alt={chatData.userInfo.displayName}
                  />
                </div>
                <div className="right">
                  <p className="name">{chatData.userInfo.displayName}</p>
                  <p className="recent-message">
                    {chatData?.lastmessage?.text}
                  </p>
                </div>
              </div>
              <p className="message-time">
                {/* {chatData.date.toDate().toLocaleTimeString()} */}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};
