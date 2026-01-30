import rss from "@astrojs/rss";
import { getCollection, render } from "astro:content";
import { transform, walk } from "ultrahtml";
import { sortedTimeDescending } from "@utils/postUtils";
import { experimental_AstroContainer as AstroContainer } from "astro/container";

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
  const container = await AstroContainer.create();
  const posts = await getCollection("posts");
  const sortedPosts = sortedTimeDescending(posts);
  const items = await Promise.all(
    sortedPosts.map(async (post) => {
      const { Content } = await render(post);
      const rawContent = await container.renderToString(Content);

      const content = await transform(rawContent, [
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
