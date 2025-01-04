export default function WorkspacePage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  return (
    <div>
      <h1>Workspace Page ({params.id})</h1>
    </div>
  );
}
