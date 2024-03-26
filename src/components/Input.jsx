import React from "react";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
library.add(faPaperclip);
export const Input = () => {
  return (
    <div className="input">
      <div className="link-icon">
        
        <input type="file" hidden id="file-input" />
        <label htmlFor="file-input">
          <FontAwesomeIcon icon={faPaperclip} className="icon"/>
        </label>
      </div>
      <input className="message-box" placeholder="Type Your Message Here..." />
      <span>Send Message</span>
    </div>
  );
};
