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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";

const workspacesData = [
  {
    id: "1",
    name: "Espacio de trabajo de Erik",
    image: "/images/erik-workspace.jpg",
  },
  {
    id: "2",
    name: "Desarrollo de Trello",
    image: "/images/trello-development.jpg",
  },
];

export function NavWorkspaces() {
  const pathname = usePathname();
  const { state } = useSidebar();

  return (
    <>
      {state === "expanded" && (
        <SidebarGroupLabel>Workspaces</SidebarGroupLabel>
      )}
      <SidebarMenu>
        {workspacesData.map((item) => (
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
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={item.image ?? undefined}
                        alt={item.name}
                      />

                      <AvatarFallback className="rounded-lg bg-sidebar-foreground/10 text-sidebar-foreground">
                        {item.name[0]}
                      </AvatarFallback>
                    </Avatar>

                    <span className="truncate text-sm">{item.name}</span>
                  </div>
                </SidebarMenuButton>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubButton
                    href={`/workspace/${item.id}/boards`}
                    isActive={pathname.includes(`/workspace/${item.id}/boards`)}
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
