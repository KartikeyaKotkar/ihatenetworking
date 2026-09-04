'use client';

import { useCallback, useEffect, useState } from "react";
import SearchPalette, { SearchButton } from "@/components/SearchPalette";

export default function HomeSearch() {
  const [open, setOpen] = useState(false);
  const openPalette = useCallback(() => setOpen(true), []);
  const closePalette = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="w-full">
      <SearchButton onOpen={openPalette} />
      <SearchPalette open={open} onClose={closePalette} />
    </div>
  );
}
