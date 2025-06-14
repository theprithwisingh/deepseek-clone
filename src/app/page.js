'use client'
import { useEffect, useRef, useState } from "react";
import { assets } from "../../assets/assets";
import Image from "next/image";
import Sidebar from "../../components/Sidebar";
import PrompBox from "../../components/PrompBox";
import Message from "../../components/Message";
import { useAppContext } from "../../context/AppContext";
export default function Home() {

  const[expand , setExpand]=useState(false);
  const[messages , setMessages]=useState([]);
  const[isLoading , setIsLoading]=useState(false);
  const{selectedChat} = useAppContext()
  const containerRef = useRef(null)

  useEffect(()=>{
    if (selectedChat){
      setMessages(selectedChat.messages)
    }
  },[selectedChat])

  useEffect(()=>{
    if(containerRef.current){
      containerRef.current.scrollTo({
        top:containerRef.current.scrollHeight,
        behavior:"smooth"
      })
    }
  },[messages])

  return (
   <div className=" flex h-screen bg-amber-100">
    <Sidebar expand={expand}  setExpand={setExpand}/>
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8 bg-[#292a2b] text-white relative">
       <div className="md:hidden absolute px-4 top-6 flex items-center justify-between w-full">
        <Image onClick={()=>(expand?setExpand(false):setExpand(true))} className="rotete-180" src={assets.menu_icon} alt="" />
        <Image className="rotete-180" src={assets.chat_icon} alt="" />
       </div>
       {messages.length === 0 ? (
         <>
         <div>
         <Image src={assets.logo_icon} className="h-16" alt=""/>
         <p className=" flex text-6xl font-medium "> Hi, i'm codingai</p>
         </div>
         <p className="text-lg mt-2 ">How can I help you today?</p>
         </>
       ):(
        <div ref={containerRef}
        className="relative flex flex-col items-center justify-start w-full mt-20 max-h-screen overflow-y-auto"
        >
          <p className='fixed top-8 border-trasparent hover:border-gray-500/50 py-1 px-2 rounded-lg font-semibold mb-6'>{selectedChat}</p>
          {messages.map((msg, index)=>{
            <Message key={index} role={msg.role} content={msg.content}/>
          })}

          isLoading && (
            <div className="flex gap-4 max-w-3xl w-full py-3">
             <image className="h-9 w-9 p-1 border border-white/15 rounded-full" src={assets.logo_icon} alt="logo"/>
             <div className="loader flex justify-center items-center gap-1">
               <div className="w-1 h-1 rounded-full bg-white animate-bounce"></div>
               <div className="w-1 h-1 rounded-full bg-white animate-bounce"></div>
               <div className="w-1 h-1 rounded-full bg-white animate-bounce"></div>
               <div className="w-1 h-1 rounded-full bg-white animate-bounce"></div>
               
             </div>
            </div>
          )
         
        </div>
       )
       }
          <PrompBox isLoading={isLoading} setIsLoading={setIsLoading}/>
         <p className="text-xs absolute bottom-1 text-gray-500">AI- generated</p> 
      </div>
      
   </div>
  );
}
