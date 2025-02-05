import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    //whenever this function is invoked it will simple forward the request because all the checks are already done in callbacks
    function middleware() {
        return NextResponse.next();
    },
    {
        callbacks: {
            //the middleware function will only run or invoked if the authorized is true. That means it will only allow to go forward if authorized is true (otherwise it will redirect to register or login)
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl

                //if these are the pathname then authorized user to go forward because they are trying to register or login
                if (
                    pathname.startsWith("/api/auth") ||
                    pathname === "/login" ||
                    pathname === "/register"
                ) {
                    return true
                }

                //public
                if (pathname === "/" || pathname.startsWith("/api/videos")) {
                    return true
                }

                return !!token //!!retuns value in boolean, if token it is true otherwise false
            }
        }
    }
)

//in which paths the middleware should run
export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"]
}