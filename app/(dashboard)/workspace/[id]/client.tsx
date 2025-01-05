"use client";

import { Workspace } from "@/types/workspace";
import { Board } from "@/types/board";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Pen, UserPlus } from "lucide-react";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";

export default function WorkspaceClient({
  workspace,
  boards,
  isAdmin,
}: {
  workspace: Workspace;
  boards: Board[];
  isAdmin: boolean;
}) {
  const [editMode, setEditMode] = useState(false);

  return (
    <div className="flex flex-col items-center space-y-4 container">
      <div className="w-3/4 flex flex-col lg:flex-row items-center justify-between py-4 space-y-4 lg:space-y-0 lg:space-x-2">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16 rounded-lg">
            <AvatarImage
              src={workspace.image ?? undefined}
              alt={workspace.name}
            />

            <AvatarFallback className="rounded-lg bg-sidebar-foreground/10 text-sidebar-foreground text-2xl">
              {workspace.name[0]}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold">{workspace.name}</span>

              {isAdmin && (
                <Button
                  variant="ghost"
                  className="px-2"
                  onClick={() => setEditMode(!editMode)}
                >
                  <Pen className="h-6 w-6" />
                </Button>
              )}
            </div>

            <span className="text-sm text-sidebar-foreground/60 capitalize">
              {workspace.visibility}
            </span>
          </div>
        </div>

        <Button className="bg-blue-500 hover:bg-blue-400">
          <UserPlus className="h-6 w-6" /> Invite Workspace members
        </Button>
      </div>

      <Separator />

      <div className="w-full flex flex-col space-y-4">
        <span className="text-lg font-semibold">Boards</span>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {boards.map((board) => (
            <div
              key={board.id}
              className="flex flex-col p-4 rounded-lg bg-sidebar-foreground/10"
            >
              <span className="text-lg font-semibold">{board.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
