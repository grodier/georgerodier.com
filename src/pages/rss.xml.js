import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
import { sortedTimeDescending } from "@utils/postUtils";

const parser = new MarkdownIt();

export async function GET(context) {
  const posts = await getCollection("posts");
  const sortedPosts = sortedTimeDescending(posts);
  return rss({
    title: "George Rodier's Blog",
    description:
      "George's thoughts on tech, building software, pragmatism, delivering value and more.",
    site: context.site,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      link: `/posts/${post.id}/`,
      author: post.data.author,
      description: post.data.description,
      content: sanitizeHtml(parser.render(post.body), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
      }),
    })),
  });
}
