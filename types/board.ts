export interface Board {
  id: string;
  name: string;
  background: string;
  visibility: "public" | "private";
  workspace_id: string;
  last_updated: number;
}

export type List = {
  id: string;
  title: string;
  position: number;
  board_id: string;
};

export type Card = {
  id: string;
  title: string;
  description: string;
  members: string[];
  labels: string[];
  position: number;
  board_id: string;
  list_id: string;
};
