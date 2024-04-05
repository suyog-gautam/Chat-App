import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  serverTimestamp,
  getDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "../../.idx/gc/firebase";
import { UseAuth } from "../context/AuthContext";
import { UseChat } from "../context/ChatContext";
import { useNavigate } from "react-router-dom";
export const Searchbar = () => {
  let isMobile = window.matchMedia("(max-width: 768px)").matches;
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const { dispatch } = UseChat();
  const { currentUser } = UseAuth();

  const [searchResults, setSearchResults] = useState([]);
  const [err, setErr] = useState("");
  useEffect(() => {
    const timerId = setTimeout(() => {
      handleSearch();
    }, 300);
    return () => {
      clearTimeout(timerId);
    };
  }, [username]);
  const handleSearch = async (e) => {
    const input = username.trim().toLowerCase();
    //  const input = e.target.value.trim();
    // To activatate Case Sensitive Search

    if (!input) {
      setSearchResults([]); // Reset search results if input is empty

      return;
    }
    //To activate case sensitive search
    // const start = input;
    // const end = input + "\uf8ff"; // Unicode character used for range queries

    // const q = query(
    //   collection(db, "users"),
    //   where("displayName", ">=", start),
    //   where("displayName", "<", end)
    // );
    // try {
    //   const querySnapshot = await getDocs(q);
    //   const results = [];
    //   querySnapshot.forEach((doc) => {
    //     results.push({ id: doc.id, data: doc.data() });
    //   });
    try {
      const q = query(collection(db, "users"));
      const querySnapshot = await getDocs(q);
      const results = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Perform case-insensitive search on displayName
        if (data.displayName.toLowerCase().includes(input)) {
          results.push({ id: doc.id, data: doc.data() });
        }
      });
      setSearchResults(results);
      setErr(""); // Clear error message
    } catch (error) {
      setSearchResults([]);
      setErr(error.message); // Set error message
    }
  };
  const handleSelect = async (selectedUser) => {
    
    const combinedId =
      currentUser.uid > selectedUser.uid
        ? currentUser.uid + selectedUser.uid
        : selectedUser.uid + currentUser.uid;

    try {
      const response = await getDoc(doc(db, "chats", combinedId));
      if (!response.exists()) {
        await setDoc(doc(db, "chats", combinedId), { messages: [] });
        await updateDoc(doc(db, "user-chats", currentUser.uid), {
          [combinedId]: {
            // Use combinedId directly as the key
            userInfo: {
              uid: selectedUser.uid,
              displayName: selectedUser.displayName,
              photoURL: selectedUser.photoURL,
            },
            date: serverTimestamp(), // Set the date directly under combinedId
          },
        });
      }
      dispatch({ type: "CHANGE_USER", payload: selectedUser });
      isMobile && navigate("/chat");
      setUsername("");
    } catch (error) {
      console.error("Error updating user-chats document:", error);
    }
  };
  return (
    <div className="searchbar-container">
      <div className="searchbar">
        <div className="searchbar-wrapper">
          <div className="searchbar-left">
            <div className="search-icon-wrapper">
              <span className="search-icon searchbar-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
                </svg>
              </span>
            </div>
          </div>

          <div className="searchbar-center">
            <div className="searchbar-input-spacer"></div>

            <input
              type="text"
              className="searchbar-input"
              maxLength="2048"
              name="q"
              value={username}
              autoCapitalize="off"
              autoComplete="off"
              title="Search"
              role="combobox"
              placeholder="Search"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </div>
        </div>
      </div>
      {/* Display search results or error message */}
      <div className="search-results">
        {searchResults.length > 0 && (
          <div className="bottom-container search">
            {searchResults.map((result) => (
              <div
                className="search-user"
                key={result.id}
                onClick={() => handleSelect(result.data)}
                
              >
                <img src={result.data.photoURL} alt={result.data.displayName} />

                <p className="search-name">{result.data.displayName}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
