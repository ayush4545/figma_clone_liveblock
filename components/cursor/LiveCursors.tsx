import { LiveCursorProps } from '@/types/type'
import React from 'react'
import Cursor from './Cursor';
import { COLORS } from '@/constants';
import { useOthers } from '@/liveblocks.config';

const LiveCursors = () => {
  const others =useOthers()
    //connectionId  is the unique identifier for each user connected to the room. It will be used as key in map
    // presence  of others is checked in parent component, so we can assume that if there are no others then this
 return others.map(({connectionId,presence})=>{

   if(!presence?.cursor) return null;

   return (
    <Cursor
     key={connectionId}
     color={COLORS[Number(connectionId) % COLORS.length]}
     x={presence.cursor.x}
     y={presence.cursor.y}
     message={presence.message || ''}

    />
   )
 })
}

export default LiveCursors