import { z, defineCollection } from "astro:content";
import { glob } from "astro/loaders";

let posts = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/posts" }),
  schema: z.object({
    author: z.string().default("George Rodier"),
    pubDate: z.date(),
    title: z.string(),
    tags: z.array(z.string()).optional(),
    description: z.string(),
    ctaTitle: z.string().optional(),
    ctaDescription: z.string().optional(),
  }),
});

export const collections = {
  posts,
};
