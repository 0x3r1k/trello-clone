import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileForm } from "@/components/profile/form";

import { auth, Session } from "@/lib/auth";
import { headers } from "next/headers";

export default async function ProfilePage() {
  const session = (await auth.api.getSession({
    headers: await headers(),
  })) as Session;

  return (
    <div className="grow flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">Profile Settings</CardTitle>
        </CardHeader>

        <CardContent>
          <ProfileForm session={session} />
        </CardContent>
      </Card>
    </div>
  );
}
