'use client'
import { useState } from "react";
import { assets } from "../../assets/assets";
import Image from "next/image";
import Sidebar from "../../components/Sidebar";
import PrompBox from "../../components/PrompBox";
import Message from "../../components/Message";
export default function Home() {

  const[expand , setExpand]=useState(false)
  const[messages , setMessages]=useState([])
  const[isLoading , setIsLoading]=useState(false)

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
        <div>
          <Message role='user' content='What is next js'/>
        </div>
       )
       }
          <PrompBox isLoading={isLoading} setIsLoading={setIsLoading}/>
         <p className="text-xs absolute bottom-1 text-gray-500">AI- generated</p> 
      </div>
      
   </div>
  );
}
