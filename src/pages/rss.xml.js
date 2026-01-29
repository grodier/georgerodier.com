import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const posts = await getCollection("posts");
  return rss({
    title: "George Rodier's Blog",
    description:
      "George's thoughts on tech, building software, pragmatism, delivering value and more.",
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      link: `/posts/${post.id}/`,
      author: post.data.author,
      description: post.data.description,
    })),
  });
}
