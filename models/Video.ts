import mongoose, { Schema, model, models } from "mongoose";

//only allows reels to be created so we explixitly define its dimensions
export const VIDEO_DIMENSIONS = {
    width: 1080,
    height: 1920,
} as const  //it is treated as const everywhere

export interface IVideo {
    _id?: mongoose.Types.ObjectId,
    title: string,
    description: string,
    videoUrl: string,
    thumbnailUrl: string,
    controls?: string, //playing , sharing , downloading
    transformation?: {
        height: number
        width: number
        quality?: number
    }
    createdAt?: Date,
    updatedAt?: Date,

}

const videoSchema = new Schema<IVideo>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        videoUrl: { type: String, required: true },
        thumbnailUrl: { type: String, required: true },
        controls: { type: Boolean, default: true },
        transformation: {
            height: { type: Number, default: VIDEO_DIMENSIONS.height }, //can use hardcoded value e.g. 1080 instead of creating VIDEO_DIMENTIONS at the top
            width: { type: Number, default: VIDEO_DIMENSIONS.width },
            quality: { type: Number, min: 1, max: 100 }
        }
    },
    {
        timestamps: true
    }
)

const Video = models?.Video || model<IVideo>("Video", videoSchema);
export default Video; //exporting the model