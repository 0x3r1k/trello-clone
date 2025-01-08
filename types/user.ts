export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string;
}

export interface UserInvite {
  id: string;
  name: string;
  email: string;
  role: string;
  workspace_id: string;
}
