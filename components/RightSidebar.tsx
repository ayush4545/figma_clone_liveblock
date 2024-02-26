import React, { useCallback, useRef } from 'react'
import Dimensions from './settings/Dimensions'
import Text from './settings/Text'
import Color from './settings/Color'
import Export from './settings/Export'
import { RightSidebarProps } from '@/types/type'
import { modifyShape } from '@/lib/shapes'

const RightSidebar = (props:RightSidebarProps) => {
  const {elementAttributes,setElementAttributes,fabricRef,isEditingRef,syncShapeInStorage,activeObjectRef}=props

  const colorInputRef=useRef(null)
  const strokeInputRef=useRef(null)

  const handleInputChange=useCallback((property:string, value:string)=>{
    if(!isEditingRef.current){
      isEditingRef.current=true
    }
    
    //setting individual properties
    setElementAttributes((prev)=>({
      ...prev, [property]:value
    }))
     
    // modify shape from canvas
    modifyShape({
      canvas: fabricRef.current as fabric.Canvas,
      property,
      value,
      activeObjectRef,
      syncShapeInStorage
    })
  },[])
  console.log(elementAttributes)
  return (
    <div className='flex flex-col border-t border-primary-grey-200 bg-primary-black text-primary-grey-300 min-2-[227px] sticky  h-full max-sm:hidden select-none'>
        <h3 className='px-5 pt-4 text-xs uppercase'>Design</h3>
        <span className='text-xs text-primary-grey-300 mt-3 px-5 border-b border-primary-gray-200 pb-4'>
          Make changes to canvas as you like
        </span>
        <Dimensions 
        width={elementAttributes.width}
        height={elementAttributes.height}
        handleInputChange={handleInputChange}
        isEditingRef={isEditingRef}
        />

        <Text 
        fontFamily={elementAttributes.fontFamily}
        fontSize={elementAttributes.fontSize}
        fontWeight={elementAttributes.fontWeight}
        handleInputChange={handleInputChange}
        />

        <Color 
        inputRef={colorInputRef}
        attribute={elementAttributes.fill}
        placeholder='color'
        handleInputChange={handleInputChange}
        attributeType='fill'
        />

        <Color 
        inputRef={strokeInputRef}
        attribute={elementAttributes.stroke}
        placeholder='stroke'
        handleInputChange={handleInputChange}
        attributeType='stroke'
        />
        <Export />
    </div>
  )
}

export default RightSidebar