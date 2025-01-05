import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function WorkspaceCard({
  item,
}: {
  item: {
    name: string;
    image?: string;
  };
}) {
  return (
    <div className="flex items-center space-x-2">
      <Avatar className="h-8 w-8 rounded-lg">
        <AvatarImage src={item.image ?? undefined} alt={item.name} />

        <AvatarFallback className="rounded-lg bg-sidebar-foreground/10 text-sidebar-foreground">
          {item.name[0]}
        </AvatarFallback>
      </Avatar>

      <span className="truncate text-sm">{item.name}</span>
    </div>
  );
}

export function WorkspaceCardSkeleton() {
  return (
    <div className="flex items-center space-x-2 w-full">
      <Avatar className="h-8 w-8 rounded-lg">
        <AvatarFallback className="rounded-lg bg-sidebar-foreground/10 text-sidebar-foreground">
          W
        </AvatarFallback>
      </Avatar>

      <span className="truncate text-sm w-full bg-sidebar-foreground/10 rounded h-4 animate-pulse" />
    </div>
  );
}
