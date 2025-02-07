import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        await connectToDatabase()
        const videos = await Video.find({}).sort({ createdAt: -1 }).lean()
        if (!videos || videos.length === 0) {
            return NextResponse.json([], { status: 200 })
        }

        return NextResponse.json(videos)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch videos" }, { status: 200 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions) //next-auth gives session to verify whether user is authenticated or not
        console.log(`SESSION: ${session}`)
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 })
        }
        await connectToDatabase()
        const body: IVideo = await request.json()
        console.log(`API BODY: ${body}`)

        if (
            !body.title ||
            !body.description ||
            !body.videoUrl
        ) {
            return NextResponse.json(
                { error: "Missing require field" },
                { status: 400 }
            )

        }

        const videoData = {
            ...body,
            controls: body.controls ?? true,
            transformation: {
                height: 1920,
                width: 1080,
                quality: body.transformation?.quality ?? 100
            }
        }
        const newVideo = await Video.create(videoData)
        return NextResponse.json(newVideo)
    } catch (error) {
        return NextResponse.json({ error: "Failed to create a videos" }, { status: 200 })
    }

}