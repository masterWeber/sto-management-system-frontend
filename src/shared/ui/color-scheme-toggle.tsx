"use client";

import { ActionIcon, useComputedColorScheme, useMantineColorScheme } from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";

export function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const computed = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  const toggle = () => setColorScheme(computed === "light" ? "dark" : "light");

  return (
    <ActionIcon
      variant="default"
      size="lg"
      aria-label="Переключить тему"
      onClick={toggle}
    >
      {computed === "light" ? <IconMoon size={18} /> : <IconSun size={18} />}
    </ActionIcon>
  );
}
