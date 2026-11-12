import { useEffect, useState } from "react";

/** Returns the id of the section currently crossing the middle of the viewport. */
export default function useActiveSection(ids, routeKey) {
  const [active, setActive] = useState("");
  const key = ids.join(",");

  useEffect(() => {
    const elements = key.split(",").map((id) => document.getElementById(id)).filter(Boolean);
    if (!elements.length) { setActive(""); return; }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting && setActive(entry.target.id));
    }, { rootMargin: "-45% 0px -50% 0px" });
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [key, routeKey]);

  return active;
}
