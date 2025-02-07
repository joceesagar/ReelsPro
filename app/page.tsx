"use client"
import FileUpload from "@/components/FileUpload";
import { apiClient } from "@/lib/api-client";
import { IVideo } from "@/models/Video";
import { IKVideo, ImageKitProvider } from "imagekitio-next";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [videos, setVideos] = useState<IVideo[]>([])
  const [videoUrl, setVideoUrl] = useState("")
  const [height, setHeight] = useState<string>()
  const [width, setWidth] = useState<string>()

  // Fetch Videos from API
  const fetchVideos = async () => {
    try {
      const response = await fetch("/api/videos");
      const data = await response.json();
      setVideos((prevVideos) => [...prevVideos, ...data]);
    } catch (error) {
      console.error("Error Fetching videos", error);
    }
  };

  console.log(videos)
  // Fetch videos on mount
  useEffect(() => {
    fetchVideos()
  }, [])

  // Handle File Upload Success
  const handleSuccess = async (response: IKUploadResponse) => {
    console.log(`VIDEO UPLOAD RESPONSE: ${JSON.stringify(response)}`);

    // Since the video is already stored in the DB, just re-fetch
    fetchVideos();
  };


  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {
        videos.length > 0 ? (videos.map((video) => (
          <ImageKitProvider urlEndpoint={process.env.NEXT_PUBLIC_URL_ENDPOINT} key={video.title}>
            <IKVideo
              path={video.videoUrl}
              transformation={[{ height: video.transformation?.height?.toString(), width: video.transformation?.width?.toString() }]}
              controls={true}
            />
          </ImageKitProvider>)
        )) : (
          <FileUpload onSuccess={handleSuccess} fileType="video" />
        )
      }
    </div>

  );
}
