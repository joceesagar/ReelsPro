"use client"
import { apiClient } from "@/lib/api-client";
import { IVideo } from "@/models/Video";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [videos, setVideos] = useState<IVideo[]>([])
  const session = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.replace('/register')
    }
    else {
      const fetchVideo = async () => {
        try {
          const data = await apiClient.getVideos()
          setVideos(data)
        } catch (error) {
          console.error("Error Fetching videos", error)
        }
      }
      fetchVideo()
    }
  }, [])

  console.log(session)
  return (
    <div className="h-full">
      {
        session.status === "authenticated"
          ?
          (
            <div>"Hello"</div>
          )
          :
          (
            <div className="flex justify-center items-center h-full flex-col">
              <p>Welcome to reel pro. Please sign in first to continue</p>
              <Link href="/register">Go to register</Link>
            </div>
          )
      }
    </div>

  );
}
