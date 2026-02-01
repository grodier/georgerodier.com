import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import puppeteer from "puppeteer";
import matter from "gray-matter";

const BASE_URL = "http://localhost:4321";

const CONTENT_FOLDER = "src/content/posts";
const OUTPUT_FOLDER = "public/social-cards";

const STATIC_PAGES = [
  { id: "home", title: "George Rodier" },
  { id: "posts", title: "Blog" },
  { id: "subscribe", title: "Subscribe" },
];

async function getPosts() {
  const postsDir = path.join(process.cwd(), CONTENT_FOLDER);
  const files = await fs.readdir(postsDir);
  const mdFiles = files.filter((file) => file.endsWith(".md"));

  const posts = await Promise.all(
    mdFiles.map(async (file) => {
      const content = await fs.readFile(path.join(postsDir, file), "utf-8");
      const { data } = matter(content);
      if (!data.title) return null;
      const id = file.replace(/\.md$/, "");
      return { id, title: data.title };
    }),
  );

  return posts.filter(Boolean);
}

async function generateImage(browser, outputPath, filename, title) {
  const outputFile = path.join(outputPath, filename);

  if (existsSync(outputFile)) {
    console.log(`Skipping ${filename} - already exists`);
    return;
  }

  const url = `${BASE_URL}/social-card?title=${encodeURIComponent(title)}`;
  const page = await browser.newPage();

  console.log(`Generating ${filename}...`);
  await page.goto(url);
  await page.setViewport({ width: 1200, height: 630 });

  await page.screenshot({
    path: outputFile,
    type: "png",
  });

  await page.close();
}

async function generateOGImages() {
  const outputPath = path.join(process.cwd(), OUTPUT_FOLDER);
  const posts = await getPosts();

  const browser = await puppeteer.launch();

  // Generate OG images for posts
  for (const post of posts) {
    await generateImage(
      browser,
      outputPath,
      `posts-${post.id}.png`,
      post.title,
    );
  }

  // Generate OG images for static pages
  for (const page of STATIC_PAGES) {
    await generateImage(browser, outputPath, `${page.id}.png`, page.title);
  }

  await browser.close();
}

generateOGImages().catch(console.error);
