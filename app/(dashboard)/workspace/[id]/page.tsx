"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import { getWorkspace, isWorkspaceAdmin } from "@/actions/workspace";
import { getBoards } from "@/actions/board";

import { WorkspaceClient, WorkspaceClientSkeleton } from "./client";
import { Suspense } from "react";

async function Workspace({ id }: { id: string }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const workspace = await getWorkspace(id);
  const boards = await getBoards(id);
  const isAdmin = await isWorkspaceAdmin(id, session!.user.id);

  return (
    <WorkspaceClient workspace={workspace} boards={boards} isAdmin={isAdmin} />
  );
}

export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<WorkspaceClientSkeleton />}>
      <Workspace id={id} />
    </Suspense>
  );
}
