"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  AppShell as MantineAppShell,
  Avatar,
  Burger,
  Group,
  Menu,
  NavLink,
  ScrollArea,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { logout } from "@/features/auth/api";
import { useAccess } from "@/features/auth/model/use-access";
import { useSession } from "@/features/auth/model/use-session";
import { ROLE_LABELS } from "@/shared/config/roles";
import { ColorSchemeToggle } from "@/shared/ui/color-scheme-toggle";
import { NAV_ITEMS } from "./nav-items";

function getInitials(fullName?: string): string {
  if (!fullName) return "?";
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppShell({ children }: { children: ReactNode }) {
  const [opened, { toggle, close }] = useDisclosure();
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useSession();
  const { can } = useAccess();

  const items = NAV_ITEMS.filter((item) => can(item.section));

  const handleLogout = async () => {
    await logout();
    queryClient.clear();
    router.replace("/login");
    router.refresh();
  };

  return (
    <MantineAppShell
      header={{ height: 56 }}
      navbar={{
        width: 260,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <MantineAppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group gap="sm">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Text fw={700} size="lg">
              СТО
            </Text>
          </Group>
          <Group gap="sm">
            <ColorSchemeToggle />
            <Menu position="bottom-end" withArrow>
              <Menu.Target>
                <UnstyledButton aria-label="Меню пользователя">
                  <Group gap="xs">
                    <Avatar size="sm" radius="xl" color="blue">
                      {getInitials(user?.fullName)}
                    </Avatar>
                    <div>
                      <Text size="sm" fw={500} lh={1.2}>
                        {user?.fullName ?? "…"}
                      </Text>
                      <Text size="xs" c="dimmed" lh={1.2}>
                        {user ? ROLE_LABELS[user.role] : ""}
                      </Text>
                    </div>
                  </Group>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item onClick={handleLogout}>Выйти</Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </MantineAppShell.Header>

      <MantineAppShell.Navbar p="xs">
        <ScrollArea>
          {items.map((item) => (
            <NavLink
              key={item.href}
              component={Link}
              href={item.href}
              label={item.label}
              leftSection={<item.icon size={18} />}
              active={isActive(pathname, item.href)}
              onClick={close}
            />
          ))}
        </ScrollArea>
      </MantineAppShell.Navbar>

      <MantineAppShell.Main>{children}</MantineAppShell.Main>
    </MantineAppShell>
  );
}
