"use client";

import { useEffect } from "react";

export function AdScripts() {
  useEffect(() => {
    // Adsterra Popunder
    const popSrc = "https://pl31721006.profitableratecpmnetwork.com/85/1c/a4/851ca45e64bf48597a884931231569f0.js";
    if (!document.querySelector(`script[src="${popSrc}"]`)) {
      const s = document.createElement("script");
      s.src = popSrc;
      s.async = true;
      s.setAttribute("data-cfasync", "false");
      document.head.appendChild(s);
    }

    // Adsterra Social Bar Sticky Notification
    const socialSrc = "https://pl31721007.profitableratecpmnetwork.com/b9/ba/9a/b9ba9ade6d03e3abc2cdcb8be5f127f7.js";
    if (!document.querySelector(`script[src="${socialSrc}"]`)) {
      const s2 = document.createElement("script");
      s2.src = socialSrc;
      s2.async = true;
      s2.setAttribute("data-cfasync", "false");
      document.head.appendChild(s2);
    }
  }, []);

  return null;
}
