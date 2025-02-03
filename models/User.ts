import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs"

//defining an interface for user schema
export interface IUSER {
    email: string,
    password: string,
    _id?: mongoose.Types.ObjectId, //mongodb id
    createdAt?: Date,
    updatedAt?: Date
}

//defining the schema for user of type IUSER
const userSchema = new Schema<IUSER>(
    {
        email: {
            type: String, //typescript string and mongoose string are same but in type script s in lowercase
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true //timestamp true will give both createdAt and updatedAt
    }
)

//hashing the password before saving whenever it is updated(when saving for first time we have to hash manually and we will do it later)
userSchema.pre("save", async function (next) {  //now this is hook (but we can assume it as middleware) where pre determine before(that requires an event) and "save"(save is the event) determine before saving to db to the work in that async function
    if (this.isModified("password")) { //this gives the all the current context. In this case it gives the current document and all the variables that are in the document
        this.password = await bcrypt.hash(this.password, 10) //10 is the salt round
    }
    next() //hook completed now continue your saving process

})

const User = models?.User || model<IUSER>("User", userSchema) //creating a userModel with name "User" following the userSchema
//Now again this is the same nextjs edge case problem. There may be already a model and there maynot be
//models?.User - From all the models present if there is user model return it
//model<IUSER>("User", userSchema) - Otherwise create a new model with name "User" and schema userSchema

export default User; //exporting the user model