export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string;
  role: "admin" | "member";
}
