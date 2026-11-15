
import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";

/**
 * Loads public content from the API.
 * Uses bundled fallback content if the API fails or returns an empty list.
 */
export default function useContent(path, fallback = []) {
  const [items, setItems] = useState(fallback);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // Immediately show fallback content while fetching.
    setItems(fallback);
    setLive(false);

    async function loadContent() {
      try {
        const res = await apiRequest(path);

        if (cancelled) return;

        if (Array.isArray(res?.items) && res.items.length > 0) {
          setItems(res.items);
          setLive(true);
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            `Unable to load ${path}; using bundled content instead:`,
            error
          );
        }
      }
    }

    loadContent();

    return () => {
      cancelled = true;
    };
  }, [path, fallback]);

  return { items, live };
}
