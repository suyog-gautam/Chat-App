import React, { useEffect, useState } from "react";
import { UseAuth } from "../context/AuthContext";
import { auth, db } from "../../.idx/gc/firebase";
import { Searchbar } from "./searchbar";
import { doc, onSnapshot } from "firebase/firestore";
import { UseChat } from "../context/ChatContext";
import { useNavigate } from "react-router-dom";

export const Sidebar = () => {
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
  const navigate = useNavigate();
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
    {
      isMobile && navigate("/chat");
    }
  };
  let chatArray = Object.values(chats);

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
        {chatArray
          .sort((a, b) => b.date - a.date)
          .map((chatData) => {
            return (
              <div
                className="single-container"
                key={chatData.date}
                onClick={() => handleSelect(chatData.userInfo)}
              >
                <div className="chat-info">
                  <div className="left">
                    <img
                      src={chatData.userInfo?.photoURL}
                      alt={chatData.userInfo?.displayName}
                    />
                  </div>
                  <div className="right">
                    <p className="name">{chatData.userInfo?.displayName}</p>
                    <p className="recent-message">
                      {chatData?.lastmessage?.text}
                    </p>
                  </div>
                </div>
                <p className="message-time">
                  {chatData?.date?.toDate()?.toLocaleTimeString()}{" "}
                </p>
              </div>
            );
          })}
      </div>
    </div>
  );
};
