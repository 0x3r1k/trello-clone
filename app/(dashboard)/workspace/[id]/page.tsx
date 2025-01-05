"use server";

import { getWorkspace, getBoards } from "@/actions/workspace";
import WorkspaceClient from "./client";

export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const workspace = await getWorkspace(id);
  const boards = await getBoards(id);

  return <WorkspaceClient workspace={workspace} boards={boards} />;
}
