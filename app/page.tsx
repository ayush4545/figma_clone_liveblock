'use client'
import LeftSidebar from "@/components/LeftSidebar";
import Live from "@/components/Live";
import Navbar from "@/components/Navbar";
import RightSidebar from "@/components/RightSidebar";
import { useEffect, useRef, useState } from "react";
import {fabric} from "fabric"
import { handleCanvasMouseDown, handleCanvasMouseUp, handleCanvasObjectModified, handleCanvaseMouseMove, handleResize, initializeFabric, renderCanvas } from "@/lib/canvas";
import { ActiveElement } from "@/types/type";
import { useMutation, useStorage } from "@/liveblocks.config";
import { defaultNavElement } from "@/constants";
import { handleDelete } from "@/lib/key-events";

export default function Page() {
  const canvasRef=useRef<HTMLCanvasElement>(null)
  const fabricRef=useRef<fabric.Canvas | null>(null)
  const isDrawing=useRef(false)
  const shapeRef=useRef<fabric.Object | null >(null)
  const selectedShapeRef=useRef<string | null >(null)
  const activeObjectRef=useRef<fabric.Object | null>(null)
  // this hook help to store data in liveblock storage
  const canvasObjects=useStorage((root)=>root.canvasObjects)
  console.log(canvasObjects)
  
  //useMutation hook come from liveblock that let you mutate liveblock state
  const syncShapeInStorage=useMutation(({storage},object)=>{
     if(!object) return

     const {objectId} = object

     const shapeData= object.toJSON() // convert fabric canvas to key value pair json
     shapeData.objectId= objectId

     const canvasObjects=storage.get("canvasObjects")
    
     // objectId is key and shapeData json data value
     canvasObjects.set(objectId,shapeData)
  },[])

  const [activeElement,setActiveElement]=useState<ActiveElement>(defaultNavElement)


  const deleteAllShapes=useMutation(({storage})=>{
     const canvasObjects=storage.get("canvasObjects")

     if(!canvasObjects || canvasObjects.size ===0) return true

     for(const [key,value] of canvasObjects.entries()){
      canvasObjects.delete(key)
     }
    
     return canvasObjects.size === 0
  },[])

  const deleteShapeFromStorage=useMutation(({storage},objectId)=>{
    const canvasObjects=storage.get("canvasObjects")

    canvasObjects.delete(objectId)
  },[])

  const handleActiveElement=(elem:ActiveElement)=>{
    setActiveElement(elem);

    switch(elem?.value){
      case 'reset':{
        deleteAllShapes();
        fabricRef.current.clear();
        setActiveElement(defaultNavElement)
        break
      }
      case 'delete' :{
        handleDelete(fabricRef.current as any, deleteShapeFromStorage)
        setActiveElement(defaultNavElement)
        break
      }
      default:{

      }
    }

    selectedShapeRef.current=elem?.value as string
  }


  useEffect(()=>{
    const canvas=initializeFabric({canvasRef,fabricRef})

    // it is a fabric canvas return from initializeFabric function
    canvas.on("mouse:down",(options)=>{
      handleCanvasMouseDown({
        options,
        canvas,
        isDrawing,
        selectedShapeRef,
        shapeRef
      })
    })

    canvas.on("mouse:move",(options)=>{
      handleCanvaseMouseMove({
        options,
        canvas,
        isDrawing,
        selectedShapeRef,
        shapeRef,
        syncShapeInStorage
      })
    })

    canvas.on("mouse:up",()=>{
      handleCanvasMouseUp({
        canvas,
        isDrawing,
        selectedShapeRef,
        shapeRef,
        syncShapeInStorage,
        setActiveElement,
        activeObjectRef
      })
    })
   
    canvas.on("object:modified",(options)=>{
      handleCanvasObjectModified({
        options,
        syncShapeInStorage
      })
    })

    //resize canvas on resize the window
    
    const handleWindowResize=()=>{
      handleResize({fabricRef})
    }
    window.addEventListener("resize",handleWindowResize)

    return ()=>{
      canvas.dispose()
      window.removeEventListener("resize",handleWindowResize)
    }
  },[])

  useEffect(()=>{
    renderCanvas({
      fabricRef,
      canvasObjects,
      activeObjectRef
    })
  },[canvasObjects])
  return (
      <main className="h-screen overflow-hidden">

        <Navbar activeElement={activeElement} handleActiveElement={handleActiveElement}/>

        {/* Liveblocks cursors and other their elements */}
        <section className="flex h-full flex-row">
          <LeftSidebar allShapes={Array.from(canvasObjects)}/>

           {/*  live Cursor with chat and reaction */}
            <Live canvasRef={canvasRef}/>  

          <RightSidebar />
        </section>
      </main>
  );
}