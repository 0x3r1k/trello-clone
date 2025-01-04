export default async function WorkspaceBoardsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div>
      <h1>Workspace Boards Page ({(await params).id})</h1>
    </div>
  );
}
