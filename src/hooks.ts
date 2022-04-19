import { useEffect } from "react";

const baseTitle = "MITOC Gear";

export function useSetPageTitle(title: string) {
  useEffect(() => {
    const newTitle = title ? [baseTitle, title].join(" | ") : baseTitle;
    document.title = newTitle;
    return () => {
      document.title = baseTitle;
    };
  }, [title]);
}
