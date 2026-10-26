export type AppView =
  | { name: "notes" }
  | { name: "expenses" }
  | { name: "links" }
  | { name: "editor"; id: string };

export function readView(): AppView {
  if (typeof window === "undefined") return { name: "notes" };
  const hash = window.location.hash.replace(/^#/, "");
  const path = hash || window.location.pathname;
  const noteMatch = path.match(/\/(?:notes|note)\/([^/]+)/);
  if (noteMatch?.[1]) return { name: "editor", id: noteMatch[1] };
  if (path.includes("expenses")) return { name: "expenses" };
  if (path.includes("links")) return { name: "links" };
  return { name: "notes" };
}

export function go(path: string) {
  const next = path.startsWith("#") ? path : `#${path.startsWith("/") ? path : `/${path}`}`;
  if (window.location.pathname !== "/") {
    window.location.replace(`/${next}`);
    return;
  }
  if (window.location.hash === next) {
    window.dispatchEvent(new Event("hashchange"));
    return;
  }
  window.location.hash = next;
}
