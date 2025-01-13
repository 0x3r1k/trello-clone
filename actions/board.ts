"use server";

import { neon } from "@neondatabase/serverless";
import { generateId } from "better-auth";

import { Board } from "@/types/board";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import { getUserFromWorkspace } from "./user";

const sql = neon(process.env.DATABASE_URL as string);

export async function createBoard({
  workspaceId,
  name,
  visibility,
  background = "blue",
}: {
  workspaceId: string;
  name: string;
  visibility: "public" | "private";
  background?: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("User not authenticated");
  }

  const user = await getUserFromWorkspace(workspaceId, session.user.id);

  if (user.role === "member")
    return {
      success: false,
      message: "You don't have permission to create a board",
    };

  const boardId = generateId(6);

  await sql`INSERT INTO board (id, name, visibility, background, workspace_id) VALUES (${boardId}, ${name}, ${visibility}, ${background}, ${workspaceId})`;

  return {
    success: true,
    message: "Board created",
  };
}

export async function getBoards(id: string) {
  const response = await sql`SELECT * FROM board WHERE workspace_id = ${id}`;

  return response as Board[];
}

export async function getBoard(id: string) {
  const response = await sql`SELECT * FROM board WHERE id = ${id} LIMIT 1`;

  return response[0] as Board;
}
