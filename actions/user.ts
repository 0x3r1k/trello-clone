"use server";

import { neon } from "@neondatabase/serverless";
import { User } from "@/types/user";

const sql = neon(process.env.DATABASE_URL as string);

export async function getUser(userId: string) {
  const user =
    await sql`SELECT * FROM public.user WHERE id = ${userId} LIMIT 1`;

  return user[0] as User;
}

export async function getUserByEmailOrUser(emailOrUser: string) {
  const user =
    await sql`SELECT * FROM public.user WHERE email = ${emailOrUser} OR user = ${emailOrUser} LIMIT 1`;

  return user[0] as User;
}

interface WorkspaceMember extends User {
  role: "admin" | "member";
}

export async function getUserFromWorkspace(
  workspaceId: string,
  userId: string
) {
  const user =
    await sql`SELECT u.*, wm.role FROM public.user u INNER JOIN workspace_members wm ON u.id = wm.user_id WHERE wm.workspace_id = ${workspaceId} AND u.id = ${userId} LIMIT 1`;

  return user[0] as WorkspaceMember;
}
