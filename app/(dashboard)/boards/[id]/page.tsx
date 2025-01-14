"use server";

import { Suspense } from "react";
import { BoardClient, BoardClientSkeleton } from "./client";
import { getBoard, getBoardLists, getBoardCards } from "@/actions/board";

async function BoardServerPage({ id }: { id: string }) {
  const boardInfo = await getBoard(id);
  const boardLists = await getBoardLists(id);
  const boardCards = await getBoardCards(id);

  return (
    <div>
      <BoardClient
        board={boardInfo}
        initialLists={boardLists}
        initialCards={boardCards}
      />
    </div>
  );
}

export default async function BoardIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<BoardClientSkeleton />}>
      <BoardServerPage id={id} />
    </Suspense>
  );
}
