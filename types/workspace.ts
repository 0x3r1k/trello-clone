export interface Workspace {
  id: string;
  name: string;
  visibility: "public" | "private";
  image?: string;
  image_fm_id?: string;
}
