import React, { useState} from "react";

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
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [err, setErr] = useState(false);
  const { currentUser } = UseAuth();
  const { data } = UseChat();
  
  const handleSend = async () => {
    if (img) {
      const storageRef = ref(storage, nanoid());
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          setErr(true);
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
    }
    await updateDoc(doc(db, "user-chats", currentUser.uid), {
      [data.chatId + ".lastmessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });
    setText("");
    setImg(null);
  };
  return (
    <div className="input">
      <div className="link-icon">
        <input
          type="file"
          hidden
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
      />
      <span onClick={handleSend}>Send Message</span>
    </div>
  );
};
