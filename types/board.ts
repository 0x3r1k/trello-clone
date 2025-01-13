export interface Board {
  id: string;
  name: string;
  background: string;
  visibility: "public" | "private";
  workspace_id: string;
  last_updated: number;
}
