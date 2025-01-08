import { Suspense } from "react";

import { DataTable, DataTableSkeleton } from "./data-table";
import { membersColumn, pendingInvitesColumn } from "./columns";
import { Separator } from "@/components/ui/separator";

import {
  getMembersFromWorkspace,
  getPendingInvitesFromWorkspace,
} from "@/actions/workspace";

export default async function WorkspaceMembersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const members = await getMembersFromWorkspace(id);
  const pendingInvites = await getPendingInvitesFromWorkspace(id);

  return (
    <div className="container mx-auto">
      <Suspense fallback={<DataTableSkeleton />}>
        <div className="flex flex-col items-start">
          <h1 className="text-2xl font-semibold">Members</h1>

          {/* @ts-expect-error - This not is a error */}
          <DataTable columns={membersColumn} data={members} />
        </div>

        <Separator />

        <div className="flex flex-col items-start mt-4">
          <h1 className="text-2xl font-semibold">Pending Invites</h1>

          {/* @ts-expect-error - This not is a error */}
          <DataTable columns={pendingInvitesColumn} data={pendingInvites} />
        </div>
      </Suspense>
    </div>
  );
}
