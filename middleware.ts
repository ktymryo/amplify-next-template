import { NextRequest, NextResponse } from "next/server";
import { fetchAuthSession } from "aws-amplify/auth/server";
import { runWithAmplifyServerContext } from "aws-amplify/adapter-nextjs";
import outputs from "@/amplify_outputs.json";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  await runWithAmplifyServerContext({
    nextServerContext: { request, response },
    operation: async (contextSpec) => {
      try {
        await fetchAuthSession(contextSpec);
      } catch (error) {
        // User is not authenticated
      }
    },
  });

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
