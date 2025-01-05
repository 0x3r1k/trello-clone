"use client";

import { Workspace } from "@/types/workspace";
import { Board } from "@/types/board";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Pen, UserPlus } from "lucide-react";

export default function WorkspaceClient({
  workspace,
  boards,
}: {
  workspace: Workspace;
  boards: Board[];
}) {
  return (
    <div className="flex flex-col items-center space-y-4 container">
      <div className="w-3/4 flex flex-row items-center justify-between py-4 space-x-2">
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

              <Button variant="ghost" className="px-2">
                <Pen className="h-6 w-6" />
              </Button>
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
    </div>
  );
}
