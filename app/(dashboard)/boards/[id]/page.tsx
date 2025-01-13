"use server";

import BoardClient from "./client";
import { getBoard } from "@/actions/board";

export default async function BoardIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const boardInfo = await getBoard(id);

  return (
    <div>
      <BoardClient board={boardInfo} lists={[]} cards={[]} />
    </div>
  );
}
