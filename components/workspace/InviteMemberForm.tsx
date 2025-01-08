"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/loading-button";

import { Workspace } from "@/types/workspace";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

import { inviteUserToWorkspace } from "@/actions/workspace";

export default function InviteMemberForm({
  workspace,
  dialogOpen,
  setDialogOpen,
}: {
  workspace: Workspace;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
}) {
  const router = useRouter();
  const { toast } = useToast();

  const [value, setValue] = useState("");
  const [role, setRole] = useState("member");

  const [loading, setLoading] = useState(false);

  const handleInviteMember = async () => {
    setLoading(true);

    const { success, message } = await inviteUserToWorkspace(
      workspace.id,
      value,
      role
    );

    if (success) {
      toast({ title: "Success", description: message });
      setDialogOpen(false);

      router.refresh();
    } else {
      toast({ title: "Error", description: message, variant: "destructive" });
    }

    setLoading(false);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Member</DialogTitle>
          <DialogDescription>
            Invite a member to join {workspace.name}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Email or user"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />

          <Select value={role} onValueChange={setRole} defaultValue="member">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="User role" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <LoadingButton
            className="w-full"
            pending={loading}
            onClick={handleInviteMember}
          >
            Invite Member
          </LoadingButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
