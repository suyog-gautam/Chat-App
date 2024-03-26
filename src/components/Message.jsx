import React from 'react'

export const Message = () => {
  return (
    <div className='message owner'>
        <div className="message-info">
            <img src='https://images.unsplash.com/photo-1553736026-ff14d158d222?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHBldHxlbnwwfHwwfHx8MA%3D%3D'/>

        </div>
        <div className="message-content">
          {/* <img src='https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBldHxlbnwwfHwwfHx8MA%3D%3D'/> */}
          <p>Hello how u doin </p> <span className='message-time'>9:12</span></div>
    </div>
    
  )
}
