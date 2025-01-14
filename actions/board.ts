"use server";

import { neon } from "@neondatabase/serverless";
import { generateId } from "better-auth";

import { Board, Card, List } from "@/types/board";

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

export async function getBoardLists(id: string) {
  const response = await sql`SELECT * FROM board_lists WHERE board_id = ${id}`;

  return response as List[];
}

export async function getBoardCards(id: string) {
  const response = await sql`SELECT * FROM board_cards WHERE board_id = ${id}`;

  return response as Card[];
}

export async function addCard({
  title,
  position,
  list_id,
  board_id,
}: {
  title: string;
  position: number;
  list_id: string;
  board_id: string;
}) {
  const cardId = generateId(6);
  await sql`INSERT INTO board_cards (id, title, position, list_id, board_id) VALUES (${cardId}, ${title}, ${position}, ${list_id}, ${board_id})`;

  return {
    success: true,
    message: "Card added",
    id: cardId,
  };
}

export async function addList({
  title,
  position,
  board_id,
}: {
  title: string;
  position: number;
  board_id: string;
}) {
  const listId = generateId(6);
  await sql`INSERT INTO board_lists (id, title, position, board_id) VALUES (${listId}, ${title}, ${position}, ${board_id})`;

  return {
    success: true,
    message: "List added",
    id: listId,
  };
}
