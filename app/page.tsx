'use client'
import LeftSidebar from "@/components/LeftSidebar";
import Live from "@/components/Live";
import Navbar from "@/components/Navbar";
import RightSidebar from "@/components/RightSidebar";
import { useEffect, useRef } from "react";
import {fabric} from "fabric"
import { handleCanvasMouseDown, handleResize, initializeFabric } from "@/lib/canvas";

export default function Page() {
  const canvasRef=useRef<HTMLCanvasElement>(null)
  const fabricRef=useRef<fabric.Canvas | null>(null)
  const isDrawing=useRef(false)
  const shapeRef=useRef<fabric.Object | null >(null)
  const selectedShapeRef=useRef<string | null >("rectangle")
  useEffect(()=>{
    const canvas=initializeFabric({canvasRef,fabricRef})

    // it is a fabric canvas return from initializeFabric function
    canvas.on("mouse:down",(options)=>{
      console.log("canvas options",options)
      handleCanvasMouseDown({
        options,
        canvas,
        isDrawing,
        selectedShapeRef,
        shapeRef
      })
    })
   

    //resize canvas on resize the window
    
    const handleWindowResize=()=>{
      handleResize({fabricRef})
    }
    window.addEventListener("resize",handleWindowResize)

    return ()=>{
      window.removeEventListener("resize",handleWindowResize)
    }
  },[])
  return (
      <main className="h-screen overflow-hidden">

        <Navbar/>

        {/* Liveblocks cursors and other their elements */}
        <section className="flex h-full flex-row">
          <LeftSidebar />

           {/*  live Cursor with chat and reaction */}
            <Live canvasRef={canvasRef}/>  

          <RightSidebar />
        </section>
      </main>
  );
}