import React from 'react'
import {Sidebar} from "../components/Sidebar"
import { Chat } from '../components/Chat'
export const Home = () => {
   const isMobile = window.matchMedia("(max-width: 768px)").matches;
  return (
    
    <div className='home'>
      <div className="container">
        <Sidebar/>
      
    {!isMobile&&<Chat/>}
      </div>
    </div>
  )
}
