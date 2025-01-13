"use client";

import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
  useOthers,
  useUpdateMyPresence,
} from "@liveblocks/react/suspense";

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
import { Board } from "@/types/board";

export default function BoardClient({ board }: { board: Board }) {
  return (
    <LiveblocksProvider
      publicApiKey={
        "pk_prod_OiIgwg5Ntsx2cX_7g3hPv9zNtDwIrAMAokIfwowfN2INJU1nGyRdpAi7yT_qE7bX"
      }
    >
      <RoomProvider id={`board-${board.id}`}>
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

  return (
    <div className="container">
      <WhoIsHere />

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
