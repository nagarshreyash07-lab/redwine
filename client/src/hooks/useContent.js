import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";

/**
 * Loads a public list from the API. Falls back to bundled content when the API is
 * unreachable or still empty, so the site never renders blank.
 */
export default function useContent(path, fallback) {
  const [items, setItems] = useState(fallback);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    apiRequest(path)
      .then((res) => {
        if (!cancelled && Array.isArray(res.items) && res.items.length) { setItems(res.items); setLive(true); }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [path]);

  return { items, live };
}
