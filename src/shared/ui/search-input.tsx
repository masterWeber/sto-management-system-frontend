"use client";

import { TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

export function SearchInput({
  value,
  onChange,
  placeholder = "Поиск",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <TextInput
      leftSection={<IconSearch size={16} />}
      value={value}
      onChange={(event) => onChange(event.currentTarget.value)}
      placeholder={placeholder}
    />
  );
}
