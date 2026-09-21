import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const posts = defineCollection({
  loader: glob({ base: "./src/content/posts", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    image: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const work = defineCollection({
  loader: glob({ base: "./src/content/work", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    company: z.string(),
    role: z.string(),
    summary: z.string(),
    dateStart: z.coerce.date().optional(),
    dateEnd: z.union([z.coerce.date(), z.string()]).optional(),
    companyURL: z.string().optional(),
    employmentType: z.string().optional(),
    location: z.string().optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ base: "./src/content/projects", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
    demoURL: z.string().optional(),
    repoURL: z.string().optional(),
  }),
});

export const collections = { posts, work, projects };
