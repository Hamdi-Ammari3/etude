import { redirect } from "next/navigation";

// The catalog moved to the home page ("/"). Old links and bookmarks
// (/videos?niveau=…&type=pdf…) keep working with the same filters.
export default async function VideosRedirect({ searchParams }) {
  const sp = (await searchParams) || {};
  const qs = new URLSearchParams();
  Object.entries(sp).forEach(([key, value]) => {
    (Array.isArray(value) ? value : [value]).forEach((v) => v != null && qs.append(key, v));
  });
  const query = qs.toString();
  redirect(query ? `/?${query}` : "/");
}