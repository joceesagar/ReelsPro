import { getToken } from "next-auth/jwt";
import withAuth from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export default withAuth(
    // Whenever this function is invoked, it will simply forward the request 
    // because all the checks are already done in callbacks.
    async function middleware(req: NextRequest) {
        const token = await getToken({ req }); // Get token from request
        const { pathname } = req.nextUrl;
        console.log(`TOKEN: ${token}`);
        console.log(`PATHNAME: ${pathname}`);

        // If logged-in users try to access login/register, redirect them
        // (first authorized returns true if pathname matches, then this middleware runs).
        if (token && (pathname === "/login" || pathname === "/register")) {
            return NextResponse.redirect(new URL("/", req.url)); // Redirect to home
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            // The middleware function will only run or be invoked if the authorized is true. 
            // That means it will only allow going forward if authorized is true 
            // (otherwise, it will redirect to register or login).
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl;

                // Allow public and authentication routes.
                if (
                    pathname.startsWith("/api/auth") ||
                    pathname === "/login" ||
                    pathname === "/register"
                ) {
                    return true;
                }

                // Uncomment the following block to allow other public paths.
                // public
                // if (pathname === "/" || pathname.startsWith("/api/videos")) {
                //     return true;
                // }

                return !!token; // !! returns a boolean value. If token exists, it's true; otherwise, false.
            }
        }
    }
);

// In which paths the middleware should run.
export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"]
};

// It runs on all paths except:
// _next/static/* → (Next.js static files like CSS, JS, etc.)
// _next/image/* → (Next.js optimized images)
// favicon.ico → (Website icon)
// public/ → (Static public assets)
