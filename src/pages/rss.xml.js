import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { transform, walk } from "ultrahtml";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
import { sortedTimeDescending } from "@utils/postUtils";

const parser = new MarkdownIt();

function isRelativeURL(path) {
  try {
    new URL(path);
    return false;
  } catch (e) {
    return true;
  }
}

// Implmentation inspired by https://github.com/delucis/astro-blog-full-text-rss/blob/latest/src/pages/rss.xml.ts
export async function GET(context) {
  const posts = await getCollection("posts");
  const sortedPosts = sortedTimeDescending(posts);
  const items = await Promise.all(
    sortedPosts.map(async (post) => {
      const initSanitizedContent = sanitizeHtml(parser.render(post.body), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
      });

      const content = await transform(initSanitizedContent, [
        async (node) => {
          await walk(node, (node) => {
            if (node.name === "img" && isRelativeURL(node.attributes.src)) {
              node.attributes.src = new URL(
                node.attributes.src,
                context.site,
              ).toString();
            }

            if (node.name === "a" && isRelativeURL(node.attributes.href)) {
              node.attributes.href = new URL(
                node.attributes.href,
                context.site,
              ).toString();
            }
          });
          return node;
        },
      ]);

      return {
        title: post.data.title,
        pubDate: post.data.pubDate,
        link: `/posts/${post.id}/`,
        author: post.data.author,
        description: post.data.description,
        content,
      };
    }),
  );

  return rss({
    title: "George Rodier's Blog",
    description:
      "George's thoughts on tech, building software, pragmatism, delivering value and more.",
    site: context.site,
    items: items,
  });
}
