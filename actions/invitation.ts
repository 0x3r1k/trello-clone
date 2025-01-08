"use server";

import { neon } from "@neondatabase/serverless";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import { sendEmail } from "./email";
import { getUserFromWorkspace } from "./user";
import { getWorkspace } from "./workspace";

const sql = neon(process.env.DATABASE_URL as string);

export async function resendInviteToWorkspace(
  workspaceId: string,
  inviteId: string
) {
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
      message: "You don't have permission to resend an invite",
    };

  const invite = await sql`
    SELECT wi.*, u.email FROM workspace_invites wi INNER JOIN public.user u ON wi.user_id = u.id WHERE wi.id = ${inviteId} LIMIT 1
  `;

  if (invite.length === 0) {
    return {
      success: false,
      message: "Invite not found",
    };
  }

  const workspace = await getWorkspace(workspaceId);

  if (!workspace) {
    return {
      success: false,
      message: "Workspace not found",
    };
  }

  await sendEmail({
    to: invite[0].email,
    subject: "You have been invited to a workspace",
    text: `You have been invited to join the workspace ${workspace.name}. Click on the link to accept the invite: ${process.env.DOMAIN}/workspace/${invite[0].workspace_id}/invite/${invite[0].id}`,
  });

  return {
    success: true,
    message: "Invite resent",
  };
}

export async function cancelInviteToWorkspace(
  workspaceId: string,
  inviteId: string
) {
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
      message: "You don't have permission to cancel an invite",
    };

  await sql`DELETE FROM workspace_invites WHERE id = ${inviteId}`;

  return {
    success: true,
    message: "Invite canceled",
  };
}
