"use client";

import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
  useOthers,
  useUpdateMyPresence,
} from "@liveblocks/react/suspense";
import { LiveList } from "@liveblocks/client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Board, List, Card } from "@/types/board";
import { useMutation, useStorage } from "@liveblocks/react";
import { Separator } from "@/components/ui/separator";

export default function BoardClient({
  board,
}: {
  board: Board;
  lists: List[];
  cards: Card[];
}) {
  return (
    <LiveblocksProvider
      publicApiKey={
        "pk_prod_OiIgwg5Ntsx2cX_7g3hPv9zNtDwIrAMAokIfwowfN2INJU1nGyRdpAi7yT_qE7bX"
      }
    >
      <RoomProvider
        id={`board-${board.id}`}
        initialStorage={{
          // @ts-expect-error - We're not using the full board object
          lists: new LiveList([
            {
              id: "Hda21",
              name: "To do",
              position: 1,
              board_id: board.id,
            },
          ]),
          // @ts-expect-error - We're not using the full cards object
          cards: new LiveList([
            {
              id: "Hda21",
              name: "To do",
              position: 1,
              list_id: "Hda21",
            },
          ]),
        }}
      >
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          <TodoList />
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}

function WhoIsHere() {
  const userCount = useOthers((others) => others.length);

  return (
    <div className="who_is_here">There are {userCount} other users online</div>
  );
}

function TodoList() {
  const updateMyPresence = useUpdateMyPresence();

  const lists = useStorage((root) => root.lists);
  const cards = useStorage((root) => root.cards);

  const addList = useMutation(
    ({ storage }, { id, title, position, board_id }) => {
      storage.get("lists").push({ id, title, position, board_id });
    },
    []
  );

  return (
    <div className="container">
      <WhoIsHere />

      {JSON.stringify(lists)}
      <Separator />
      {JSON.stringify(cards)}

      <Button
        onClick={() =>
          addList({
            id: "2k1nX",
            title: "Test",
            position: 1,
            board_id: "2k1nX",
          })
        }
      >
        Test
      </Button>

      <Dialog
        onOpenChange={(isOpen) =>
          updateMyPresence({
            boardId: isOpen ? "2k1nX" : undefined,
            listId: isOpen ? "Hda21" : undefined,
          })
        }
      >
        <DialogTrigger asChild>
          <Button variant="outline">Edit Profile</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>

          <span>prueba</span>

          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
