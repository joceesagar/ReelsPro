"use client"
import { signIn } from 'next-auth/react'
import { errorToJSON } from 'next/dist/server/render'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

function Login() {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError("") // Reset previous error
        setLoading(true)

        // Email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setError("Invalid email format");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            setLoading(false);
            return;
        }

        try {
            const response = await signIn("credentials", {
                email,
                password,
                redirect: false

            })

            if (response?.error) {
                setError(response.error)
                setLoading(false)
                return // ✅ Stop execution
            }
            toast.success("Login Successfully")
            router.push("/") // ✅ Navigate only on success

        } catch (error) {
            setError(`Something went wrong: ${error}`)
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className='flex items-center justify-center h-full'>
            <div className='p-10 bg-slate-500 flex flex-col gap-5 rounded-md w-[25%] shadow-lg shadow-black'>
                <div>
                    <h2 className="text-3xl font-bold text-center ">Welcome to ReelsPro</h2>
                    <h2 className="text-2xl font-bold text-center text-slate-800 ">SIGN IN</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    {/* Email Field */}
                    <div className='flex flex-col gap-5'>
                        <label className="input input-bordered flex items-center gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="h-4 w-4 opacity-70">
                                <path
                                    d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                                <path
                                    d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                            </svg>
                            <input type="text" className="grow" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </label>

                        {/* Password Field */}
                        <label className="input input-bordered flex items-center gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="h-4 w-4 opacity-70">
                                <path
                                    fillRule="evenodd"
                                    d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                                    clipRule="evenodd" />
                            </svg>
                            <input type="password" className="grow" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </label>

                        {/* Submit Button */}
                        <div className='w-full text-center'>
                            <button className="btn btn-wide" disabled={loading}>Log In</button>
                        </div>
                        <div className='w-full flex items-center justify-center gap-2'>
                            <span>Don't have an account?</span>
                            <Link href='/register' className='font-extrabold'>Sign Up</Link>
                        </div>
                        {error && <p className="text-red-500 text-center font-bold">{error}</p>}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login