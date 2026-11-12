import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { getAnalyticsConsent, trackAnalyticsEvent } from "../../services/analytics";

function track(type, path, target = "") {
  const safePath = path === "/" ? "/" : "/other";
  trackAnalyticsEvent(type, safePath, target).catch((error) => {
    console.error("Unable to record anonymous site activity:", error);
  });
}

export default function AnalyticsTracker() {
  const { pathname } = useLocation();
  const sentPage = useRef("");
  const seenSections = useRef(new Set());
  const [enabled, setEnabled] = useState(() => getAnalyticsConsent() === "accepted");

  useEffect(() => {
    const enable = () => setEnabled(true);
    const disable = () => setEnabled(false);
    window.addEventListener("redwine:analytics-enabled", enable);
    window.addEventListener("redwine:analytics-disabled", disable);
    return () => {
      window.removeEventListener("redwine:analytics-enabled", enable);
      window.removeEventListener("redwine:analytics-disabled", disable);
    };
  }, []);

  useEffect(() => {
    if (!enabled || getAnalyticsConsent() !== "accepted" || sentPage.current === pathname) return;
    sentPage.current = pathname;
    track("page_view", pathname);
  }, [enabled, pathname]);

  useEffect(() => {
    function onClick(event) {
      if (getAnalyticsConsent() !== "accepted" || !(event.target instanceof Element)) return;
      const element = event.target.closest("[data-analytics-event]");
      if (!element) return;
      const { analyticsEvent, analyticsTarget = "" } = element.dataset;
      if (analyticsEvent) track(analyticsEvent, window.location.pathname, analyticsTarget);
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (!enabled || getAnalyticsConsent() !== "accepted" || !("IntersectionObserver" in window)) return undefined;
    const sections = document.querySelectorAll("main section[id]");
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const target = entry.target.id;
        const key = `${pathname}:${target}`;
        if (entry.isIntersecting && target && !seenSections.current.has(key)) {
          seenSections.current.add(key);
          track("section_view", window.location.pathname, target);
        }
      }
    }, { threshold: 0.35 });

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [enabled, pathname]);

  return null;
}
