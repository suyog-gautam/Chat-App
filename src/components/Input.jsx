import React, { useState } from "react";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UseAuth } from "../context/AuthContext";
import { UseChat } from "../context/ChatContext";
import {
  Timestamp,
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../.idx/gc/firebase";
import { nanoid } from "nanoid";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

library.add(faPaperclip);
export const Input = () => {
  let isMobile = window.matchMedia("(max-width: 768px)").matches;
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [err, setErr] = useState(false);
  const { currentUser } = UseAuth();
  const { data } = UseChat();
  const [sending, setSending] = useState(false);
  const handleSend = async () => {
    if (sending || (!text.trim() && !img)) {
      return;
    }

    setSending(true); // Set sending state to true

    try {
      if (img) {
        const storageRef = ref(storage, nanoid());
        const uploadTask = uploadBytesResumable(storageRef, img);

        uploadTask.on(
          "state_changed",
          (snapshot) => {},
          (error) => {
            setErr(true);
            setSending(false); // Reset sending state on error
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: nanoid(),
                text,
                img: downloadURL,
                senderId: currentUser.uid,
                date: Timestamp.now(),
              }),
            });
            setSending(false); // Reset sending state on success
          }
        );
      } else {
        await updateDoc(doc(db, "chats", data.chatId), {
          messages: arrayUnion({
            id: nanoid(),
            text,
            senderId: currentUser.uid,
            date: Timestamp.now(),
          }),
        });
        setSending(false); // Reset sending state on success
      }

      // Update user chats
      await updateDoc(doc(db, "user-chats", currentUser.uid), {
        [data.chatId + ".lastmessage"]: {
          text:
            text && img
              ? `You: ${text}`
              : text
              ? `You: ${text}`
              : "You sent a photo",
        },
        [data.chatId + ".date"]: serverTimestamp(),
        [data.chatId + ".userInfo"]: {
          uid: data.user.uid,
          displayName: data.user.displayName,
          photoURL: data.user.photoURL,
        },
      });
      await updateDoc(doc(db, "user-chats", data.user.uid), {
        [data.chatId + ".lastmessage"]: {
          text:
            text && img
              ? `${text}`
              : text
              ? `${text}`
              : `${currentUser.displayName} sent a photo`,
        },
        [data.chatId + ".date"]: serverTimestamp(),
        [data.chatId + ".userInfo"]: {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
        },
      });

      setText("");
      setImg(null);
    } catch (error) {
      console.error("Error sending message:", error);
      setSending(false); // Reset sending state on error
    }
  };

  return (
    <div className="input">
      <div className="link-icon">
        <input
          type="file"
          hidden
          accept="image/*"
          id="file-input"
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor="file-input">
          <FontAwesomeIcon icon={faPaperclip} className="icon" />
        </label>
      </div>
      <input
        className="message-box"
        placeholder="Type Your Message Here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSend();
          }
        }}
      />
      <span onClick={handleSend}>{isMobile ? "Send" : "Send Message"}</span>
    </div>
  );
};
