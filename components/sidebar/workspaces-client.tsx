"use client";

import {
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  WorkspaceCard,
  WorkspaceCardSkeleton,
} from "@/components/sidebar/workspace-card";
import { Workspace } from "@/types/workspace";

import { usePathname } from "next/navigation";
import Link from "next/link";

export function WorkspacesClient({ workspaces }: { workspaces: Workspace[] }) {
  const pathname = usePathname();
  const { state } = useSidebar();

  return (
    <>
      {state === "expanded" && (
        <SidebarGroupLabel>Workspaces</SidebarGroupLabel>
      )}

      <SidebarMenu>
        {workspaces.length > 0 &&
          workspaces.map((item) => (
            <Collapsible
              key={item.id}
              className="group/collapsible"
              defaultOpen={pathname.includes(`/workspace/${item.id}`)}
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    tooltip={item.name}
                    isActive={pathname.includes(`/workspace/${item.id}`)}
                  >
                    {state === "collapsed" ? (
                      <Link href={`/workspace/${item.id}`}>
                        <WorkspaceCard item={item} />
                      </Link>
                    ) : (
                      <WorkspaceCard item={item} />
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubButton
                      href={`/workspace/${item.id}`}
                      isActive={pathname.includes(`/workspace/${item.id}`)}
                    >
                      Boards
                    </SidebarMenuSubButton>

                    <SidebarMenuSubButton
                      href={`/workspace/${item.id}/members`}
                      isActive={pathname.includes(
                        `/workspace/${item.id}/members`,
                      )}
                    >
                      Members
                    </SidebarMenuSubButton>

                    <SidebarMenuSubButton
                      href={`/workspace/${item.id}/settings`}
                      isActive={pathname.includes(
                        `/workspace/${item.id}/settings`,
                      )}
                    >
                      Settings
                    </SidebarMenuSubButton>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ))}
      </SidebarMenu>
    </>
  );
}

export function WorkspacesClientSkeleton() {
  return (
    <>
      <SidebarGroupLabel>Workspaces</SidebarGroupLabel>

      <SidebarMenu>
        {[1, 2, 3].map((item) => (
          <Collapsible key={item} className="group/collapsible" open={false}>
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton size="lg">
                  <WorkspaceCardSkeleton />
                </SidebarMenuButton>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubButton isActive>Boards</SidebarMenuSubButton>
                  <SidebarMenuSubButton>Members</SidebarMenuSubButton>
                  <SidebarMenuSubButton>Settings</SidebarMenuSubButton>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </>
  );
}
