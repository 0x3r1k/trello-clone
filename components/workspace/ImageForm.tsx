"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/loading-button";

import { updateWorkspaceImage } from "@/actions/workspace";
import { fmClient } from "@/lib/fivemanage";

import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Workspace } from "@/types/workspace";

export default function WorkspaceImageForm({
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

  const [tabType, setTabType] = useState<"url" | "file">("url");
  const [tabUrl, setTabUrl] = useState("");
  const [tabFile, setTabFile] = useState<File | null>(null);
  const [loadingImageSave, setLoadingImageSave] = useState(false);

  const saveWorkspaceImage = async () => {
    setLoadingImageSave(true);

    let newUrl: string = tabUrl;
    let fmId: string | undefined;

    if (tabType === "file" && tabFile) {
      const file = new Blob([tabFile], {
        type: tabFile.type,
      });

      const uploadResponse = await fmClient.uploadFile("image", file, {
        name: `workspace-${workspace.id}-image`,
        description: `Workspace ${workspace.name} image`,
      });

      if (uploadResponse.url) {
        newUrl = uploadResponse.url;
        fmId = uploadResponse.id;
      }
    }

    const { success, message } = await updateWorkspaceImage(
      workspace.id,
      newUrl,
      fmId
    );

    setDialogOpen(false);
    setLoadingImageSave(false);

    if (success) {
      toast({ title: "Success", description: message });
    } else {
      toast({ title: "Error", description: message, variant: "destructive" });
    }

    router.refresh();
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Workspace Image</DialogTitle>
          <DialogDescription>
            Update the workspace image by providing a URL or uploading a file
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col space-y-4">
          <Tabs
            defaultValue="url"
            value={tabType}
            // @ts-expect-error - Types are incorrect
            onValueChange={setTabType}
          >
            <TabsList className="w-full mb-2">
              <TabsTrigger value="url" className="w-full">
                URL
              </TabsTrigger>

              <TabsTrigger value="file" className="w-full">
                File
              </TabsTrigger>
            </TabsList>

            <TabsContent value="url">
              <Input
                type="text"
                id="workspace-image"
                placeholder="Workspace Image URL"
                value={tabUrl}
                onChange={(e) => setTabUrl(e.target.value)}
              />
            </TabsContent>

            <TabsContent value="file">
              <Input
                type="file"
                id="workspace-image"
                placeholder="Workspace Image URL"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  setTabFile(file);
                }}
                accept="image/*"
              />
            </TabsContent>
          </Tabs>

          <LoadingButton
            className="bg-blue-500 hover:bg-blue-400"
            onClick={saveWorkspaceImage}
            pending={loadingImageSave}
          >
            Save Image
          </LoadingButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
