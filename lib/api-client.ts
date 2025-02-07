//It is the centralized place for calling api. Instead of calling api in every file we write all logic here and just pass url of the api to the object of this class.

import { IVideo } from "@/models/Video"

export type VideoFormData = Omit<IVideo, "_id"> //omit menas remove _id from IVideo keepind all same

type FetchOptions = {
    method?: "GET" | "POST" | "PUT" | "CREATE",
    body?: any,
    headers?: Record<string, string>
}

class ApiClient {
    private async fetch<T>(
        endpoint: string,
        options: FetchOptions = {}
    ): Promise<T> {
        const { method = "GET", body, headers = {} } = options
        const defaultHeaders = {
            "Content-Type": "application/json",
            ...headers
        }
        console.log(`BODY: ${body}`)
        const response = await fetch(`/api${endpoint}`, { //we are not using this here because this will give above function fetch not the JS fetch
            method,
            headers: defaultHeaders,
            body: body ? JSON.stringify(body) : undefined
        })

        console.log(`RESPONSE ERROR ${response.status}`)

        if (!response.ok) {
            throw new Error(await response.text())
        }
        return response.json()
    }

    async getVideos() {
        return this.fetch<IVideo[]>("/videos") // this will give the context of this file means every function every variable in this file is available through this
    }

    async getAVideo(id: string) {
        return this.fetch<IVideo>(`/videos/${id}`)
    }

    async createVideo(videoData: VideoFormData) {
        return this.fetch("/videos", {
            method: "POST",
            body: JSON.stringify(videoData)
        })
    }
}

export const apiClient = new ApiClient() //exporting just object not the whole class 