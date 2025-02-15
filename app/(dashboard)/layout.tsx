import { AppSidebar } from "@/components/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import BreadcrumbClient from "@/components/breadcrumb";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function BoardsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const head = await headers();
  const session = await auth.api.getSession({
    headers: head,
  });

  return (
    <SidebarProvider>
      <AppSidebar session={session} />

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <BreadcrumbClient />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
