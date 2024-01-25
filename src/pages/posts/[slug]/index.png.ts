import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";
import { generateOgImageForPost } from "../../../utils/generateOgImages";
import { slugifyStr } from "../../../utils/slugify";

export async function getStaticPaths() {
  let postEntries = await getCollection("posts");
  return postEntries.map((post) => {
    return {
      params: { slug: slugifyStr(post.data.title) },
      props: post,
    };
  });
}

export const GET: APIRoute = async ({ props }) => {
  return new Response(
    await generateOgImageForPost(props as CollectionEntry<"posts">),
    {
      headers: { "Content-Type": "image/png" },
    }
  );
};
