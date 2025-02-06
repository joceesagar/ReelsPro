//Second step in next-auth is NextAuthOptions. File can have any name here it is inside lib and its name is auth.ts

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./db";
import User from "@/models/User";
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
    // Configure one or more authentication providers
    providers: [
        // can have many providers like github, google. credentials providers is our manual provider we have to define it if used
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // Add logic here to validate the credentials
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing ")
                }

                try {
                    await connectToDatabase()
                    const user = await User.findOne({ email: credentials.email })
                    if (!user) {
                        throw new Error("User not found")
                    }

                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
                    if (!isPasswordValid) {
                        throw new Error("Invalid password")
                    }

                    return {
                        // Any object returned will be saved in `user` property of the JWT
                        id: user._id.toString(),
                        email: user.email
                    }
                } catch (error) {
                    throw error
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id //storing the user id in the token
            }
            return token
        },
        //session will get session by default but when strategy is jwt it will get jwt token too
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
            }
            return session
        }
    },
    pages: {
        signIn: "/login",
        error: "/login"
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,

}

//By default next-auth works on session but it depends how it works. For that we have session strategy which has two options 
//databse - storing session to databse
//jwt - storing session in jwt token
//if saved to databse it will purely act session which is default
//when changed strategy to jwt, session will now get tokens in callback otherwise it will only get session. What things will be stored in tokens is determined
//jwt callback just above session callback. we will add userid or other info in token in jwt callback and return token and that token will be available in session callback.

// Authentication Flow:
// User visits /login (a custom page you created).
// User submits the login form.
// You send a request to await SignIn("credentials", {your credentials}). this SignIn function is given by next-auth/react. we don't have to fetch request here.
// If successful, NextAuth will log the user in and redirect them to the appropriate page.