import React from 'react'
import { library } from '@fortawesome/fontawesome-svg-core';
import { faVideo, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Messages}from "./Messages"
import { Input } from './Input';
library.add(faVideo, faInfoCircle);
export const Chat = () => {
  return (
    < div className='chat'>
        <div className="chatInfo"> 
        <div className='chat-name'> 
        <img src="https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=2588&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
        <span>John</span></div>
        <div className='chat-icons'>
            <FontAwesomeIcon icon={faVideo} />
            <FontAwesomeIcon icon={faInfoCircle} />
        
        </div>
       
        </div>
       <Messages/>
       <Input/>
    </div>
  )
}
