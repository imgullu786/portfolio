import { z } from "zod";

// Project Schema
export const projectSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  content: z.string().optional(),
  coverImage: z.string().url().optional().or(z.literal("")),
  liveUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  techStack: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

export type ProjectFormData = z.infer<typeof projectSchema>;

// Blog Schema
export const blogSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().optional(),
  excerpt: z.string().min(1, "Excerpt is required").max(500),
  content: z.string().min(1, "Contente is required"),
  coverImage: z.string().url().optional().or(z.literal("")),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  publishedAt: z.date().optional().nullable(),
  tags: z.array(z.string()).default([]),
});

export type BlogFormData = z.infer<typeof blogSchema>;

// Movie Schema
export const movieSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  director: z.string().optional(),
  posterUrl: z.string().url().optional().or(z.literal("")),
  rating: z.number().min(0).max(10).optional().nullable(),
  status: z.enum(["WATCHING", "COMPLETED", "TO_WATCH"]).default("TO_WATCH"),
  published: z.boolean().default(false),
});

export type MovieFormData = z.infer<typeof movieSchema>;

// Book Schema
export const bookSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  author: z.string().optional(),
  coverUrl: z.string().url().optional().or(z.literal("")),
  rating: z.number().min(0).max(10).optional().nullable(),
  status: z.enum(["READING", "COMPLETED", "TO_READ"]).default("TO_READ"),
  published: z.boolean().default(false),
});

export type BookFormData = z.infer<typeof bookSchema>;

// Snippet Schema
export const snippetSchema = z.object({
  caption: z.string().optional().or(z.literal("")),
  imageUrl: z.string().optional().or(z.literal("")),
  published: z.boolean().default(false),
}).refine((data) => data.caption || data.imageUrl, {
  message: "Either caption or image is required",
});

export type SnippetFormData = z.infer<typeof snippetSchema>;

// Note Schema
export const noteSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  published: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
});

export type NoteFormData = z.infer<typeof noteSchema>;