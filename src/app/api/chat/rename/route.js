import { getAuth } from "@clerk/nextjs/dist/types/server";
import { NextResponse } from "next/server";
import Chat from "../../../../../models/Chat";

export async function POST(req){
    try {
        const {userId}=getAuth(req);
        if (!userId) {
           return NextResponse.json({
             success:false,
             message:"User not authenticated"
        })
        }

        const {chatId, name}=await req.json();
        //connect to the database and update the chat name
        await connectDB
        await Chat.findByIdAndUpdate({_id:chatId,userId},{name});
        return NextResponse.json({success:true,message:"chat Renamed"})
    } catch (error) {
        return NextResponse.json({success:false, error:error.message})
    }
}