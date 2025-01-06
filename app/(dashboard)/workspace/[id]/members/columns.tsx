"use client";

import { User } from "@/types/user";
import { ColumnDef } from "@tanstack/react-table";

import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";

import {
  removeMemberFromWorkspace,
  updateMemberRoleInWorkspace,
} from "@/actions/workspace";

interface TUser extends User {
  workspace: string;
}

export const columns: ColumnDef<TUser>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "emailVerified",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email Verified
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getValue("emailVerified")}
        disabled
        aria-label="Email verified"
      />
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Role
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue("role")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Change role</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  onClick={async () => {
                    const { success, message } =
                      await updateMemberRoleInWorkspace(
                        row.original.workspace,
                        row.original.id,
                        "admin",
                      );

                    if (success) {
                      toast({
                        title: "Success",
                        description: message,
                        className: "bg-green-500",
                      });

                      window.location.reload();
                    } else {
                      toast({
                        title: "Error",
                        description: message,
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  Admin
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={async () => {
                    const { success, message } =
                      await updateMemberRoleInWorkspace(
                        row.original.workspace,
                        row.original.id,
                        "member",
                      );

                    if (success) {
                      toast({
                        title: "Success",
                        description: message,
                        className: "bg-green-500",
                      });

                      window.location.reload();
                    } else {
                      toast({
                        title: "Error",
                        description: message,
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  Member
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={async () => {
              const { success, message } = await removeMemberFromWorkspace(
                row.original.workspace,
                row.original.id,
              );

              if (success) {
                toast({
                  title: "Success",
                  description: message,
                  className: "bg-green-500",
                });

                window.location.reload();
              } else {
                toast({
                  title: "Error",
                  description: message,
                  variant: "destructive",
                });
              }
            }}
          >
            Remove from workspace
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
