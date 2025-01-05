"use server";

import { neon } from "@neondatabase/serverless";
import {
  WorkspacesClient,
  WorkspacesClientSkeleton,
} from "@/components/sidebar/workspaces-client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Workspace } from "@/types/workspace";
import { Suspense } from "react";

async function getWorkspaces(userId: string) {
  const sql = neon(process.env.DATABASE_URL as string);
  const response =
    await sql`SELECT w.* FROM workspace w INNER JOIN workspace_members wm ON w.id = wm.workspace_id WHERE wm.user_id = ${userId}`;

  return response as Workspace[];
}

export async function NavWorkspaces() {
  const session = await auth.api.getSession({ headers: await headers() });
  const workspaces = await getWorkspaces(session!.user.id);

  console.log(workspaces);

  return (
    <Suspense fallback={<WorkspacesClientSkeleton />}>
      <WorkspacesClient workspaces={workspaces} />
    </Suspense>
  );
}
