import CursorSVG from '@/public/assets/CursorSVG'
import React from 'react'

type Props={
    color:string,
    x: number,
    y:number,
    message: string
}
const Cursor = (props:Props) => {
    const {color,x,y,message}=props
  return (
    <div className="pointer-events-none absolute top-0 left-0" style={{transform: `translate(${x}px, ${y}px)`}}>
      {/* Cursor Image of other users */}
      <CursorSVG color={color}/>  
       {/* message type by other users */}
      {message && (
        <div className="absolute left-2 top-5 rounded-3xl px-4 py-2" style={{background:color}}>
          <p className='text-white whitespace-nowrap text-sm leading-relaxed'>
          {message}
          </p>
        </div>
      )}
    </div>
  )
}

export default Cursor