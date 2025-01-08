import { betterFetch } from "@better-fetch/fetch";
import { NextResponse, type NextRequest } from "next/server";
import type { Session } from "@/lib/auth";

import { getUserFromWorkspace } from "@/actions/user";
import { getWorkspace } from "@/actions/workspace";

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
    }
  );

  if (!session || !session.user) {
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
    const workspaceId = pathName.split("/")[2];
    const workspace = await getWorkspace(workspaceId);

    if (!workspace) {
      return NextResponse.redirect(new URL("/boards", request.nextUrl));
    }

    if (workspace.visibility === "private") {
      const user = await getUserFromWorkspace(workspaceId, session.user.id);

      if (!user) {
        return NextResponse.redirect(new URL("/", request.nextUrl));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
