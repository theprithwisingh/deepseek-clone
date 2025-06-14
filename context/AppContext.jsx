"use client"

import { useAuth, useUser } from "@clerk/nextjs";

import { useEffect, useState } from "react";
import {createContext, useContext } from "react"
import toast from "react-hot-toast";
export const AppContext = createContext();

export const useAppContext=()=>{
    return useContext(AppContext)
}

export const AppContextProvider=({children})=>{
    const {user} = useUser ();
    const {getToken} = useAuth();
    
    const[chats,setChats]=useState([]);
    const[selectedChat,setSelectedChat]=useState(null);

    const createNewChat = async()=>{
        try {
         if (!user) return null;
         const token = await getToken();

         await axios.post('/api/chat/create', {} , {
            headers:{
                Authorization:`Bearer ${token}`
            }})
            fetchUsersChats();

        } catch (error) {
          toast.error(error.message)
        }
    }

    const fetchUsersChats = async()=>{
        try {
         const token = await getToken(); // Get user's auth token
         const { data } = await axios.get('/api/chat/get', {
         headers: {
         Authorization: `Bearer ${token}`,
      },
    });
    if (data.success) {
        console.log(data.data);
        setChats(data.data); // Set the chat state with received data

        //if the user has no chats, create one
        if (data.data.length===0) {
            await createNewChat();
            return fetchUsersChats();
        }else{
          //sort chats by updated date
          data.data.sort((a,b)=>new Date(b.updateAt)-new Date(a.updateAt));

          //set recentaly updated chat as selected chat
          setSeletedChat(data.data[0]);
          console.log(data.data[0]);
        }
    }
    else{
        toast.error(data.message)
    }
        } catch (error) {
        toast.error(error.message)
        }
    }
    useEffect(()=>{
        if(user){ 
            fetchUsersChats();
        }
    },[user])
    const value = {
        user,
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        fetchUsersChats,
        createNewChat
    }

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}