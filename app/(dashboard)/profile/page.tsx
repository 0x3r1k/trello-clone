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
          {session.user.emailVerified === false && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4 bg-primary-foreground">
              <p className="font-bold">Email not verified</p>
              <p>
                Your email address has not been verified. Please check your
                inbox for a verification email.
              </p>
            </div>
          )}

          <ProfileForm session={session} />
        </CardContent>
      </Card>
    </div>
  );
}
