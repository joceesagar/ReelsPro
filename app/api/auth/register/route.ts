//WE WRITE OUR BACKEND AND API.THE BACKEND SHOULD BE WRITTEN IN API FOLDER INSIDE APP FOLDER. ALL THE BACKEND SHOULD BE WRITTEN THERE.ANYTHING OUTSIDE THAT WILL BE TREATED AS FRONTED.
//NOW THE API ENDPOINT FOR THIS REGISTER API WILL BE HTTPS://LOCALHOST:3000/API/AUTH/REGISTER

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";

//function to handle POST request. the function name must be POST to handle post request.
export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            )
        }

        await connectToDatabase()

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            )
        }

        await User.create({
            email,
            password
        })

        return NextResponse.json(
            { message: "User register successfully" },
            { status: 201 }
        )
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to Register User" },
            { status: 500 }
        )
    }

}



//EXAMPLE OF HOW REQUEST IS SEND TO THIS ROUTE THROUGH FRONTEND
// const res = fetch("/api/auth/register", {
//     method: "POST",
//     headers: {"Content-type": "application/json"},
//     body: JSON.stringify({email, password})
// })

// res.json()

