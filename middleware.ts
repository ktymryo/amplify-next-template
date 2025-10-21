import { NextRequest, NextResponse } from "next/server";
import { runWithAmplifyServerContext } from "@aws-amplify/adapter-nextjs";
import outputs from "@/amplify_outputs.json";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  await runWithAmplifyServerContext({
    nextServerContext: { request, response },
    operation: async (contextSpec) => {
      // This ensures Amplify can access cookies in Server Components
    },
  });

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
