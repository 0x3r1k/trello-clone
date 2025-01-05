import { neon } from "@neondatabase/serverless";
import { Workspace } from "@/types/workspace";

export async function getWorkspaces(userId: string) {
  const sql = neon(process.env.DATABASE_URL as string);
  const response =
    await sql`SELECT w.* FROM workspace w INNER JOIN workspace_members wm ON w.id = wm.workspace_id WHERE wm.user_id = ${userId}`;

  return response as Workspace[];
}
