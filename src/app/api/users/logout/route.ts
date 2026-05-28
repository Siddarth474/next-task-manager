import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        const response = NextResponse.json({
        message: "Logged out successfully",
        success: true,
        });

        response.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date(0),
            path: "/", 
        });

        return response;

    } catch (error) {
        return NextResponse.json(
            { error: "Failed to logout", success: false },
            { status: 500 }
        );
    }
};
