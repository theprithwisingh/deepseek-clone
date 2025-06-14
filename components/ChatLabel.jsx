import React from 'react'
import { assets } from '../assets/assets'
import Image from 'next/image'
import { useAppContext } from '../context/AppContext'

const ChatLabel = ({openMenu ,setOpenMenu,id ,name}) => {
  
const {fetchUsersChats, chats, setSelectedChat} = useAppContext()
 const selectChat = ()=>{

 const chatData = chats.find(chat => chat._id === id)
 setSelectedChat (chatData)
 console.log(chatData)
 }

 const renameHandler = async () => {
  try {
    const newName = prompt('Enter new name');
    if (!newName) return;

    const { data } = await axios.post('/api/chat/rename', {
      chatId: id,
      name: newName,
    });

    if (data.success) {
      fetchUsersChats(); // Refresh chat list
      setOpenMenu({ id: 0, open: false }); // Close the menu
      toast.success(data.message); // Show success toast
    } else {
      toast.error(data.message); // Show error toast from backend
    }
  } catch (error) {
    console.error("Rename failed:", error);
    toast.error("Something went wrong while renaming.");
  }
};
  
 const deleteHandler = async () => {
  try {
    const confirmDelete = window.confirm('Are you sure you want to delete this chat?');
    if (!confirmDelete) return;

    const { data } = await axios.post('/api/chat/delete', { chatId: id });

    if (data.success) {
      fetchUsersChats(); // Refresh the chat list
      setOpenMenu({ id: 0, open: false }); // Close the menu
      toast.success(data.message); // Show success toast
    } else {
      toast.error(data.message); // Show error toast from backend
    }
  } catch (error) {
    console.error("Chat deletion failed:", error);
    toast.error("Something went wrong while deleting the chat.");
  }
};


  return (
    <div className='flex items-center justify-between p-2 text-white/80 hover:bg-white/10 rounded-lg text-sm group cursor-pointer'>
        <p className='group-hover:max-w-5/6 truncate'>Chat Name here</p>
        <div className='group relative flex items-center justify-center h-6 w-6
        aspect-square hover:bg-black/80 rounded-lg'>
        <Image src={assets.three_dots} alt='three_dots' className={`w-4 ${openMenu.open ? ' ':'hidden'} group-hover:block`}/>
        <div className={`absolute ${openMenu.open ? 'block':'hidden'}  -right-36 top-6 bg-gray-700 rounded-xl w-max p-2`}>
          <div className='flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg'>
                <Image src={assets.pencil_icon} alt='' className='w-4'/>
                <p>rename </p>
          </div>
          <div className='flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg'>
                <Image src={assets.delete_icon} alt='delete_icon' className='w-4'/>
                <p>Delete </p>
          </div>
        </div>
        </div>
    </div>
  )
}

export default ChatLabel