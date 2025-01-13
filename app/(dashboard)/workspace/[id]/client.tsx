"use client";

import { useState } from "react";

import { Workspace } from "@/types/workspace";
import { Board } from "@/types/board";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import LoadingButton from "@/components/loading-button";
import WorkspaceImageForm from "@/components/workspace/ImageForm";
import InviteMemberForm from "@/components/workspace/InviteMemberForm";

import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

import { Check, Pen, UserPlus, X, Star } from "lucide-react";

import { createBoard } from "@/actions/board";
import { updateWorkspaceName } from "@/actions/workspace";

import { motion } from "motion/react";
import { BACKGROUNDS } from "@/lib/backgrounds";

export default function WorkspaceClient({
  workspace,
  boards,
  isAdmin,
}: {
  workspace: Workspace;
  boards: Board[];
  isAdmin: boolean;
}) {
  const { toast } = useToast();
  const router = useRouter();

  const [editMode, setEditMode] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [hoverImg, setHoverImg] = useState(false);
  const [loading, setLoading] = useState(false);

  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  const [sortBy, setSortBy] = useState("recent");
  const [filterBy, setFilterBy] = useState("all");
  const [search, setSearch] = useState("");

  const [boardDialogOpen, setBoardDialogOpen] = useState(false);
  const [loadingBoard, setLoadingBoard] = useState(false);
  const [boardHover, setBoardHover] = useState<string>("");
  const [newBoardData, setNewBoardData] = useState({
    name: "",
    visibility: "private",
    background: "blue",
  });

  const saveWorkspace = async () => {
    if (workspace.name === workspaceName) return;
    setLoading(true);

    const { success, message } = await updateWorkspaceName(
      workspace.id,
      workspaceName
    );

    setEditMode(false);
    setLoading(false);

    if (success) {
      toast({ title: "Success", description: message });
    } else {
      toast({ title: "Error", description: message, variant: "destructive" });
    }

    router.refresh();
  };

  const handleCreateBoard = async () => {
    setLoadingBoard(true);

    const { success, message } = await createBoard({
      workspaceId: workspace.id,
      name: newBoardData.name,
      visibility: newBoardData.visibility as "public" | "private",
      background: newBoardData.background,
    });

    setLoadingBoard(false);
    setBoardDialogOpen(false);

    if (success) {
      toast({ title: "Success", description: message });
    } else {
      toast({ title: "Error", description: message, variant: "destructive" });
    }

    router.refresh();
  };

  return (
    <div className="flex flex-col items-center space-y-4 w-full">
      <div className="w-3/4 flex flex-col lg:flex-row items-center justify-between py-4 space-y-4 lg:space-y-0 lg:space-x-2">
        <div className="flex items-center space-x-4">
          <Avatar
            className={`h-16 w-16 rounded-lg ${isAdmin && "cursor-pointer"}`}
            onMouseEnter={() => setHoverImg(true)}
            onMouseLeave={() => setHoverImg(false)}
            onClick={() => isAdmin && setImageDialogOpen(true)}
          >
            <AvatarImage
              src={workspace.image ?? undefined}
              alt={workspace.name}
            />

            <AvatarFallback className="rounded-lg bg-sidebar-foreground/10 text-sidebar-foreground text-2xl">
              {workspace.name[0]}
            </AvatarFallback>

            {isAdmin && (
              <motion.div
                className="absolute bottom-1.5 right-1"
                animate={{ opacity: hoverImg ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <Pen className="w-3 h-3" />
              </motion.div>
            )}
          </Avatar>

          <WorkspaceImageForm
            workspace={workspace}
            dialogOpen={imageDialogOpen}
            setDialogOpen={setImageDialogOpen}
          />

          <InviteMemberForm
            workspace={workspace}
            dialogOpen={inviteDialogOpen}
            setDialogOpen={setInviteDialogOpen}
          />

          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              {editMode ? (
                <Input
                  type="text"
                  placeholder="Workspace name"
                  className="text-lg font-semibold bg-transparent"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                />
              ) : (
                <span className="text-lg font-semibold">{workspace.name}</span>
              )}

              {isAdmin && (
                <>
                  <Button
                    variant="ghost"
                    className="px-2.5"
                    onClick={() => {
                      setWorkspaceName(workspace.name);
                      setEditMode(!editMode);
                    }}
                  >
                    {editMode ? (
                      <X className="h-6 w-6" />
                    ) : (
                      <Pen className="h-6 w-6" />
                    )}
                  </Button>

                  {editMode && (
                    <LoadingButton
                      className="bg-blue-500 hover:bg-blue-400 px-2.5"
                      onClick={saveWorkspace}
                      pending={loading}
                      disabled={workspace.name === workspaceName}
                    >
                      <Check className="h-6 w-6" />
                    </LoadingButton>
                  )}
                </>
              )}
            </div>

            <span className="text-sm text-sidebar-foreground/60 capitalize">
              {workspace.visibility}
            </span>
          </div>
        </div>

        <Button
          className="bg-blue-500 hover:bg-blue-400"
          onClick={() => setInviteDialogOpen(true)}
          disabled={!isAdmin}
        >
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

        <div className="flex flex-row space-y-4 lg:space-y-0 lg:space-x-4 flex-wrap">
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
                className={`relative flex flex-col w-72 h-24 p-2 rounded-sm cursor-pointer ${
                  board.background
                    ? `bg-${board.background}-500`
                    : "bg-sidebar-foreground/10"
                }`}
                onMouseEnter={() => setBoardHover(board.id)}
                onMouseLeave={() => setBoardHover("")}
              >
                <span className="text-lg font-semibold">{board.name}</span>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: boardHover === board.id ? 1 : 0 }}
                >
                  <span className="text-sm text-sidebar-foreground/60 absolute bottom-1.5 right-0.5 hover:text-primary">
                    <Star className="w-4 h-4 mr-1" />
                  </span>
                </motion.div>
              </div>
            ))}

          <Popover
            open={boardDialogOpen}
            onOpenChange={() => {
              setBoardDialogOpen(!boardDialogOpen);
              setNewBoardData({
                name: "",
                visibility: "private",
                background: "blue",
              });
            }}
          >
            <PopoverTrigger asChild>
              <Button
                className="flex flex-col w-72 h-24 p-2 rounded-sm bg-sidebar-foreground/10 text-sm text-primary"
                variant="ghost"
              >
                Create new board
              </Button>
            </PopoverTrigger>

            <PopoverContent>
              <div className="flex flex-col space-y-4">
                <span className="text-sm font-semibold text-center text-primary">
                  Create board
                </span>

                <div className="flex flex-col space-y-2">
                  <Label>Board name</Label>
                  <Input
                    type="text"
                    placeholder="Board name"
                    value={newBoardData.name}
                    onChange={(e) =>
                      setNewBoardData({ ...newBoardData, name: e.target.value })
                    }
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <Label>Visibility</Label>

                  <Select
                    value={newBoardData.visibility}
                    onValueChange={(e) =>
                      setNewBoardData({ ...newBoardData, visibility: e })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Private" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="public">Public</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col space-y-2">
                  <Label>Background</Label>

                  <div className="flex flex-row flex-wrap space-x-2 w-full">
                    {BACKGROUNDS.map((backgroundColor: string) => (
                      <div
                        key={backgroundColor}
                        className={`w-10 h-6 rounded-sm cursor-pointer ${
                          newBoardData.background === backgroundColor &&
                          "ring-1 ring-primary"
                        } bg-${backgroundColor}-500`}
                        onClick={() =>
                          setNewBoardData({
                            ...newBoardData,
                            background: backgroundColor,
                          })
                        }
                      />
                    ))}
                  </div>
                </div>

                <LoadingButton
                  className="bg-blue-500 hover:bg-blue-400"
                  onClick={handleCreateBoard}
                  pending={loadingBoard}
                  disabled={!newBoardData.name}
                >
                  Create
                </LoadingButton>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
