import { neon } from "@neondatabase/serverless";
import { Workspace } from "@/types/workspace";
import { User } from "@/types/user";

export async function getWorkspaces(userId: string) {
  const sql = neon(process.env.DATABASE_URL as string);
  const response =
    await sql`SELECT w.*, wm.role FROM workspace w INNER JOIN workspace_members wm ON w.id = wm.workspace_id WHERE wm.user_id = ${userId}`;

  return response as Workspace[];
}

export async function getWorkspace(id: string) {
  const sql = neon(process.env.DATABASE_URL as string);
  const response = await sql`SELECT * FROM workspace WHERE id = ${id} LIMIT 1`;

  return response[0] as Workspace;
}

export async function getMembersFromWorkspace(id: string) {
  const sql = neon(process.env.DATABASE_URL as string);
  const response =
    await sql`SELECT u.*, wm.role FROM public.user u INNER JOIN workspace_members wm ON u.id = wm.user_id WHERE wm.workspace_id = ${id}`;

  return response as User[];
}
