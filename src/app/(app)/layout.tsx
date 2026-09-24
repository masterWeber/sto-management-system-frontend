import type { ReactNode } from "react";
import { AppShell } from "@/widgets/app-shell/app-shell";

export default function AppLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
