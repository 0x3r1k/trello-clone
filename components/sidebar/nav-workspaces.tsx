"use server";

import { Suspense } from "react";
import {
  WorkspacesClient,
  WorkspacesClientSkeleton,
} from "@/components/sidebar/workspaces-client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Workspace } from "@/types/workspace";
import { getWorkspaces } from "@/actions/workspace";

export async function NavWorkspaces() {
  const session = await auth.api.getSession({ headers: await headers() });
  const workspaces = await getWorkspaces(session!.user.id);

  return (
    <Suspense fallback={<WorkspacesClientSkeleton />}>
      <WorkspacesClient workspaces={workspaces} />
    </Suspense>
  );
}
