"use client";

import { useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";

export function useListParams(limit = 20) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debounced] = useDebouncedValue(search, 300);

  const onSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return {
    page,
    setPage,
    search,
    onSearch,
    searchValue: debounced.trim() || undefined,
    limit,
  };
}
