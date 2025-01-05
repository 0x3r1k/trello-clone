"use server";

import { neon } from "@neondatabase/serverless";

import { Workspace } from "@/types/workspace";
import { Board } from "@/types/board";
import { User } from "@/types/user";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const sql = neon(process.env.DATABASE_URL as string);

export async function getWorkspaces(userId: string) {
  const response =
    await sql`SELECT w.*, wm.role FROM workspace w INNER JOIN workspace_members wm ON w.id = wm.workspace_id WHERE wm.user_id = ${userId}`;

  return response as Workspace[];
}

export async function getWorkspace(id: string) {
  const response = await sql`SELECT * FROM workspace WHERE id = ${id} LIMIT 1`;

  return response[0] as Workspace;
}

export async function getBoards(id: string) {
  const response = await sql`SELECT * FROM board WHERE workspace_id = ${id}`;

  return response as Board[];
}

export async function getMembersFromWorkspace(id: string) {
  const response =
    await sql`SELECT u.*, wm.role, wm.workspace_id as workspace FROM public.user u INNER JOIN workspace_members wm ON u.id = wm.user_id WHERE wm.workspace_id = ${id}`;

  return response as User[];
}

export async function removeMemberFromWorkspace(
  workspaceId: string,
  userId: string,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("User not authenticated");
  }

  const userData =
    await sql`SELECT role FROM workspace_members WHERE workspace_id = ${workspaceId} AND user_id = ${session.user.id} LIMIT 1`;

  if (userData[0].role === "member")
    return {
      success: false,
      message: "You don't have permission to remove a member",
    };

  await sql`DELETE FROM workspace_members WHERE workspace_id = ${workspaceId} AND user_id = ${userId}`;

  return {
    success: true,
    message: "Member removed",
  };
}

export async function addMemberToWorkspace(
  workspaceId: string,
  userId: string,
  role: string,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("User not authenticated");
  }

  const userData =
    await sql`SELECT role FROM workspace_members WHERE workspace_id = ${workspaceId} AND user_id = ${session.user.id} LIMIT 1`;

  if (userData[0].role === "member")
    return {
      success: false,
      message: "You don't have permission to add a member",
    };

  await sql`INSERT INTO workspace_members (workspace_id, user_id, role) VALUES (${workspaceId}, ${userId}, ${role})`;

  return {
    success: true,
    message: "Member added",
  };
}

export async function updateMemberRoleInWorkspace(
  workspaceId: string,
  userId: string,
  role: string,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("User not authenticated");
  }

  const userData =
    await sql`SELECT role FROM workspace_members WHERE workspace_id = ${workspaceId} AND user_id = ${session.user.id} LIMIT 1`;

  if (userData[0].role === "member")
    return {
      success: false,
      message: "You don't have permission to update a member role",
    };

  await sql`UPDATE workspace_members SET role = ${role} WHERE workspace_id = ${workspaceId} AND user_id = ${userId}`;

  return {
    success: true,
    message: "Member role updated",
  };
}
