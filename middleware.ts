import { betterFetch } from "@better-fetch/fetch";
import { NextResponse, type NextRequest } from "next/server";
import { neon } from "@neondatabase/serverless";
import type { Session } from "@/lib/auth";

const authRoutes = ["/auth/login", "/auth/register"];
const passwordRoutes = ["/auth/change-password", "/auth/reset-password"];

export default async function authMiddleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname;
  const isAuthRoute = authRoutes.includes(pathName);
  const isPasswordRoute = passwordRoutes.includes(pathName);

  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    },
  );

  if (!session) {
    if (isAuthRoute || isPasswordRoute) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/auth/login", request.nextUrl));
  }

  if (isAuthRoute || isPasswordRoute)
    return NextResponse.redirect(new URL("/", request.nextUrl));

  if (pathName === "/")
    return NextResponse.redirect(new URL("/boards", request.nextUrl));

  // Comprobar si esta en una ruta de "workspace" (/workspace/:id)
  // Si esta en la ruta, comprobar si el workspace es publico y en caso contrario comprobar si el usuario esta como miembro en el workspace
  // Si no es miembro, redirigir a la pagina de inicio
  if (pathName.startsWith("/workspace/")) {
    const sql = neon(process.env.DATABASE_URL as string);
    const workspaceId = pathName.split("/")[2];
    const result =
      await sql`SELECT * FROM workspace WHERE id = ${workspaceId} LIMIT 1`;

    if (!result[0]) {
      return NextResponse.redirect(new URL("/boards", request.nextUrl));
    }

    if (result[0].visibility === "private") {
      const user =
        await sql`SELECT * FROM workspace_members WHERE workspace_id = ${workspaceId} AND user_id = ${session.user.id} LIMIT 1`;

      if (!user[0]) {
        return NextResponse.redirect(new URL("/", request.nextUrl));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
