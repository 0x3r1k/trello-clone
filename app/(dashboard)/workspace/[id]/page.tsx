"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import { getWorkspace, getBoards, isWorkspaceAdmin } from "@/actions/workspace";
import WorkspaceClient from "./client";

export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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
