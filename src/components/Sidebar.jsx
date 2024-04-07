import React, { useEffect, useState } from "react";
import { UseAuth } from "../context/AuthContext";
import { auth, db } from "../../.idx/gc/firebase";
import { Searchbar } from "./searchbar";
import { doc, onSnapshot } from "firebase/firestore";
import { UseChat } from "../context/ChatContext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export const Sidebar = () => {
  const { darkMode, setDarkMode } = useTheme();
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

        <div className="toggle-button">
          <label className="toggle" htmlFor="switch">
            <input
              id="switch"
              className="inputs"
              type="checkbox"
              onChange={() => setDarkMode((prevValue) => !prevValue)}
              checked={!darkMode}
            />
            <div className="icons icon--moon">
              <svg
                height="32"
                width="32"
                fill="black"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"></path>
              </svg>
            </div>

            <div className="icons icon--sun">
              <svg
                height="32"
                width="32"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
                  fillRule="evenodd"
                ></path>
              </svg>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};
