export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div>
      <h1>Workspace Page ({(await params).id})</h1>
    </div>
  );
}
