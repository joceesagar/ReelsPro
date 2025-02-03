import mongoose from "mongoose";

// DATABASE CONNECTION SCENARIOS:
// 1. If there is an existing connection, return it.
// 2. If there is a pending promise, wait for it to resolve.
// 3. If neither exists, create a new connection.

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
}

// CHECK IF A DATABASE CONNECTION ALREADY EXISTS
// - NODE.JS PROVIDES A GLOBAL OBJECT WHICH PERSISTS ACROSS MODULE IMPORTS.
// - WE USE `global.mongoose` TO STORE THE CONNECTION INSTANCE.
// - SINCE TYPESCRIPT DOES NOT RECOGNIZE `global.mongoose`, WE NEED TO DEFINE ITS TYPE IN `types.d.ts`.
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }; // IF `cached` DOES NOT EXIST, INITIALIZE IT WITH NULL VALUES.
}

// FUNCTION TO CONNECT TO THE DATABASE
// - TYPESCRIPT REQUIRES US TO DEFINE THE TYPE OF `cached` BEFORE USING IT.
export async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn; // IF A CONNECTION ALREADY EXISTS, RETURN IT.
    }

    if (!cached.promise) { // IF THERE IS NO EXISTING PROMISE, CREATE ONE.
        const opts = {
            bufferCommands: true, // ALLOWS MONGOOSE COMMANDS TO BE BUFFERED(TEMPORARILY STORING IN QUEUE) UNTIL CONNECTION IS ESTABLISHED AND THEN EXECTUING.
            maxPoolSize: 10, // MAXIMUM NUMBER OF SIMULTANEOUS CONNECTIONS IN THE CONNECTION POOL.
        };
        cached.promise = mongoose // CREATE A CONNECTION PROMISE.
            .connect(MONGODB_URI, opts)
            .then(() => mongoose.connection); // RETURNS A PROMISE THAT RESOLVES TO THE DATABASE CONNECTION.
    }

    try {
        cached.conn = await cached.promise; // AWAIT THE PROMISE; IF RESOLVED, ASSIGN CONNECTION TO `cached.conn`.
    } catch (error) {
        cached.promise = null; // IF CONNECTION FAILS, RESET THE PROMISE AND THROW ERROR.
        throw error;
    }

    return cached.conn; // RETURN THE ESTABLISHED DATABASE CONNECTION.
}