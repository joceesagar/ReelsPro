"use client"

import { signOut, useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"


function NavBar() {
    const [currentSession, setCurrentSession] = useState<boolean>(false)
    const session = useSession()

    useEffect(() => {
        if (session.status === "unauthenticated" || session.status === "loading") {
            setCurrentSession(false)
        } else {
            setCurrentSession(true)
        }
    }, [session])
    console.log(session)

    const handleLogout = () => {
        signOut()

    }
    return (
        <div className="navbar bg-base-100 px-[100px]">
            <div className="flex-1">
                <Link className="btn btn-ghost text-2xl font-extrabold text-white" href="/">ReelsPro</Link>
            </div>
            {currentSession && <div className="flex-none gap-2">
                <div className="form-control">
                    <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
                </div>
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <Image
                                width={50}
                                height={50}
                                alt="Tailwind CSS Navbar component"
                                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                        </div>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                        <li>
                            <a className="justify-between">
                                Profile
                                <span className="badge">New</span>
                            </a>
                        </li>
                        <li><a>Settings</a></li>
                        <li><Link onClick={handleLogout} href={"/login"}>Logout</Link></li>
                    </ul>
                </div>
            </div>}
        </div>
    )
}

export default NavBar