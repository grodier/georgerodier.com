import { z, defineCollection } from "astro:content";

let posts = defineCollection({
  type: "content",
  schema: z.object({
    author: z.string().default("George Rodier"),
    pubDate: z.date(),
    title: z.string(),
    tags: z.array(z.string()).optional(),
    description: z.string(),
  }),
});

export const collections = {
  posts,
};
