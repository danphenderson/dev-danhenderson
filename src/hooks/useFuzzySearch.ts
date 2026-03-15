import { useMemo, useState } from 'react';
import Fuse from 'fuse.js';

export function useFuzzySearch<T>(rows: T[], keys: string[]) {
  const [search, setSearch] = useState('');

  const fuse = useMemo(
    () =>
      new Fuse(rows, {
        keys,
        threshold: 0.4,
        ignoreLocation: true,
      }),
    [rows, keys]
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return rows;
    return fuse.search(search.trim()).map((result) => result.item);
  }, [fuse, rows, search]);

  return { search, setSearch, filtered } as const;
}
