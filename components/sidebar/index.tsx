import * as React from "react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavWorkspaces } from "@/components/sidebar/nav-workspaces";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Session } from "@/lib/auth";

export function AppSidebar({ session }: { session: Session | null }) {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <NavMain />
          <SidebarSeparator />
          <NavWorkspaces />
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={session!.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
