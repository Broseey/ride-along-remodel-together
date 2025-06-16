
import { LucideIcon } from "lucide-react";

export interface MenuItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

export interface User {
  name: string;
  email: string;
  avatar: string | null;
}
