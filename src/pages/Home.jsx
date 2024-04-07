import React, {useState, useEffect} from 'react'
import {Sidebar} from "../components/Sidebar"
import { Chat } from '../components/Chat'
export const Home = () => {
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
  return (
    
    <div className='home'>
      <div className="container">
        <Sidebar/>
      
    {!isMobile&&<Chat/>}
      </div>
    </div>
  )
}
