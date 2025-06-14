import React, { useState } from 'react'
import { assets } from '../assets/assets'
import Image from "next/image";
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import axios from 'axios';

const PrompBox = ({isLoading , setIsLoading}) => {
    const [prompt, setPrompt]=useState('')

    const {
        user,
        chats,
        setChats,
        seletedChat,
        setSeletedChat,} = useAppContext();

    const handleKeyDown =(e)=>{
        if (e.key==="Enter" && !e.shiftKey){
          e.preventDefault();
          sendPrompt(e);
        }
    }

    const sendPrompt = async(e)=>{
      const promptCopy = prompt;

      try{
        e.preventDefault();
        if (!user) return toast.error('Login to send message');
        if(isLoading) return toast.error('Wait for the previous prompt response');

        setIsLoading(true)
        setPrompt("")

        const userPrompt={
          role:"user",
          content:prompt,
          timestamp:Date.now()
        }

        //saving user prompt in chats array
        setChats((prevChats)=>prevChats.map((chat)=>chat._id===seletedChat._id ?
        {
         ...chat,
         messages:[...chat.messages,userPrompt]
        }:chat
      ))
      //saving user prompt in selected chat
      setSeletedChat((prev)=>({
        ...prev,
        messages:[...prev.messages,userPrompt]
      }))
       
      const {data} = await axios.post('/api/chat/ai',{
        chatId:seletedChat._id,
        prompt
      })
      if (data.success){
        setChats((prevChats)=>prevChats.map((chat)=>chat._id===seletedChat._id ? {
          ...chat, messages:[...chat.messages,data.data]
        }:chat
      ))

     const message = data.data.content;
     const messageTokens = message.split(" ");
     let assistantMessage = {
         role:'assistant',
         content:'',
         timestamp:Date.now(),
     }
     setSeletedChat((prev)=>({
      ...prev,
      messages:[...prev.messages,assistantMessage],
     }))
     
    for (let index = 0; index < messageTokens.length; index++) {
      setTimeout(()=>{
       assistantMessage.content = messageTokens.slice(0,i+1).join(" ");
       setSeletedChat((prev)=>{
        const updatedMessages = [
          ...prev.messages.slice(0,-1),
          assistantMessage
        ]
        return {...prev,messages:updatedMessages}
       })
      },i*100)
      
    }

      }else{
        toast.error(data.message);
        setPrompt(promptCopy);
      }
        
      }catch(error){
       toast.error(error.message);
        setPrompt(promptCopy);
      }finally{
        setIsLoading(false)
      }
    }

  return (
    <form
    onSubmit={sendPrompt}
    className={`w-full ${ seletedChat?.messages.length > 0 ? "max-w-3xl":"max-w-2xl"} bg-[#404045] p-4 rounded-3xl mt-4 transition-all`}>
      <textarea
      onKeyDown={handleKeyDown}
      className='outline-none w-full resize-none overflow-hidden break-words bg-transparent'
      placeholder='Message DeepSeek' required
      onChange={(e)=>setPrompt(e.target.value)} value={prompt}
      />

      <div className='flex items-center justify-between text-sm'>
         <div className='flex items-center gap-2'>
            <p className='flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition'>
              <Image className='h-5' src={assets.deepthink_icon} alt="deepthink_icon"/>
              DeepThink(R1)
            </p>
            

            <p className='flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition'>
              <Image className='h-5' src={assets.deepthink_icon} alt="deepthink_icon"/>
              Search
            </p>
         </div>

         <div className='flex items-center gap-2'>
            <Image className="w-4 cursor-pointer" src={assets.pin_icon} alt="pin_icon"/>
            <button className={`${prompt ? "bg-primary p-2 rounded-2xl":"bg-[#71717a] p-2 rounded-2xl"}`}>
               <Image className="w-3.5 aspect-square" src={prompt?assets.arrow_icon:assets.arrow_icon_dull} alt="pin_icon"/>
            </button>
         </div>
      </div>
    </form>
  )
}

export default PrompBox