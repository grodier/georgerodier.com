import type { CollectionEntry } from "astro:content";

export function sortedTimeDescending(posts: CollectionEntry<"posts">[]) {
  return posts.sort((a, b) => {
    return (
      Math.floor(new Date(b.data.pubDate).getTime() / 1000) -
      Math.floor(new Date(a.data.pubDate).getTime() / 1000)
    );
  });
}
