"use client";

import { Workspace } from "@/types/workspace";
import { Board } from "@/types/board";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Pen, UserPlus } from "lucide-react";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [sortBy, setSortBy] = useState("recent");
  const [filterBy, setFilterBy] = useState("all");
  const [search, setSearch] = useState("");

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

        <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col lg:flex-row items-center space-x-0 lg:space-x-2 space-y-4 lg:space-y-0 w-full lg:w-fit">
            <div className="flex flex-col space-y-2 w-full">
              <Label htmlFor="sortby">Sort by</Label>

              <Select defaultValue={sortBy} onValueChange={(e) => setSortBy(e)}>
                <SelectTrigger className="w-full lg:w-[250px]">
                  <SelectValue placeholder="Most recently active" id="sortby" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="recent">Most recently active</SelectItem>

                    <SelectItem value="oldest">
                      Least recently active
                    </SelectItem>

                    <SelectItem value="az">Alphabetically A-Z</SelectItem>
                    <SelectItem value="za">Alphabetically Z-A</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col space-y-2 w-full">
              <Label htmlFor="filter">Filter</Label>

              <Select
                defaultValue={filterBy}
                onValueChange={(e) => setFilterBy(e)}
              >
                <SelectTrigger className="w-full lg:w-[250px]">
                  <SelectValue placeholder="All boards" id="filter" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All boards</SelectItem>
                    <SelectItem value="active">Active boards</SelectItem>
                    <SelectItem value="archived">Archived boards</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col space-y-2 w-full lg:w-fit">
            <Label htmlFor="search">Search</Label>

            <Input
              id="search"
              type="text"
              placeholder="Search boards"
              className="w-full lg:w-72"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {boards
            .filter(() => {
              // if (filterBy === "active") {
              //   return board.active;
              // }

              // if (filterBy === "archived") {
              //   return !board.active;
              // }

              return true;
            })
            .filter((board) => {
              if (search) {
                return board.name.toLowerCase().includes(search.toLowerCase());
              }

              return true;
            })
            .sort((a, b) => {
              if (sortBy === "recent") {
                return b.last_updated - a.last_updated;
              }

              if (sortBy === "oldest") {
                return a.last_updated - b.last_updated;
              }

              if (sortBy === "az") {
                return a.name.localeCompare(b.name);
              }

              if (sortBy === "za") {
                return b.name.localeCompare(a.name);
              }

              return 0;
            })
            .map((board) => (
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
