import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div>
      <h1>Page</h1>
      <p>Session: {JSON.stringify(session)}</p>
    </div>
  );
}
