import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useReducer,
} from "react";
import { UseAuth } from "./AuthContext";
import { createRoutesFromElements } from "react-router-dom";
const ChatContext = createContext();
export const ChatContextProvider = ({ children }) => {
  const { currentUser } = UseAuth();
  
  const INITIAL_STATE = {
    chatId: "null",
    user: {},
  };

  const chatReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_USER":
        return {
          user: action.payload,
          chatId:
            currentUser.uid > action.payload.uid
              ? currentUser.uid + action.payload.uid
              : action.payload.uid + currentUser.uid,
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  useEffect(() => {
    if (currentUser) {
      dispatch({ type: "CHANGE_USER", payload: currentUser });
    }
  }, [currentUser]);

  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
export const UseChat = () => {
  const context = useContext(ChatContext);
  const { data: state, dispatch } = context;
  return { data: state, dispatch };
};
