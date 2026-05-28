import { getDataFromToken } from "@/helpers/getDataFromToken";
import { connectDB } from "@/config/dbConfig";
import { Task } from "@/models/taskModel";
import { User } from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
    try {
        await connectDB()
        const {title, description, status, dueDate} = await request.json();
        
        if([title, description, dueDate].some((field) => field.trim() === "")) {
            return NextResponse.json({
                error: "All fields are required",
                success: false
            }, {status: 400});
        }
    
        const userId = await getDataFromToken(request);
        const user = await User.findById(userId);
        if(!user) {
            return NextResponse.json({
                error: "Invalid user ID",
                success: false
            }, {status: 400});
        }
    
        const newTask = await Task.create({ 
            title,
            description,
            status,
            dueDate,
            owner: userId.toString()
        });
    
        return NextResponse.json({
            message: 'Task created successfully',
            newTask,
            success: true
        }, {status: 201});
    
    } catch (error: any) {
        console.log('Something went wrong during task! ', error);
        return NextResponse.json(
            {error: error.message}, 
            {status: 500}
        )
    }
}

export const GET = async (request: NextRequest) => {
    try {
        await connectDB();

        const userId = await getDataFromToken(request);
        if (!userId) {
        return NextResponse.json(
            { error: "Unauthorized: User not logged in", success: false },
            { status: 401 }
        );
        }

        const tasks = await Task.find({ owner: userId }).sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            count: tasks.length,
            tasks,
        });

    } catch (error: any) {
        console.error("Error fetching tasks:", error);
        return NextResponse.json(
            { error: error.message, success: false },
            { status: 500 }
        );
    }
};