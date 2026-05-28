import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/dbConfig";
import { User } from "@/models/userModel";

export const POST = async (request: NextRequest) => {
    try {
        await connectDB();
        const {username, email, password} = await request.json();
    
        if(!username || !email || !password) {
            return NextResponse.json({error: 'All fields are required', success: false}, {status: 400});
        }
    
        const existingUser = await User.findOne({
            $or: [{username}, {email}]
        });

        if(existingUser) {
            return NextResponse.json({error: 'User already exist', success: false}, {status: 400});
        }

        const newUser = new User({
            username,
            email,
            password
        });
    
        await newUser.save();
        
    
        return NextResponse.json({
            message: 'User signed up successfully',
            newUser,
            success: true,
        }, {status: 201});
        
    } catch (error: any) {
        console.error('Something went wrong while signup: ', error);
        return NextResponse.json({error: error.message, success: false}, {status: 500});
    }
}