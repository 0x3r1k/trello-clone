import { Suspense } from "react";

import { getMembersFromWorkspace } from "@/actions/workspace";
import { DataTable, DataTableSkeleton } from "./data-table";
import { columns } from "./columns";

export default async function WorkspaceMembersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const members = await getMembersFromWorkspace(id);

  return (
    <div className="container mx-auto">
      <Suspense fallback={<DataTableSkeleton />}>
        {/* @ts-expect-error - This not is a error */}
        <DataTable columns={columns} data={members} />
      </Suspense>
    </div>
  );
}
