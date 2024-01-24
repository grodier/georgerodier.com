import { getCollection, type CollectionEntry } from "astro:content";
import { slugifyStr } from "@utils/slugify";

export async function getStaticPaths() {
  let postEntries = await getCollection("posts");
  return postEntries.map((post) => ({
    params: { slug: slugifyStr(post.data.title) },
    props: { post },
  }));
}

export async function GET() {
  console.log("TESTING");
  new Response();
}
