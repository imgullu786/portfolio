'use server';

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { calculateReadingTime, createSlug } from "@/lib/utils";
import { noteSchema, NoteFormData } from "@/lib/validations";
import { auth } from "@/lib/auth";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session.user;
}


// Get all unique tags with counts
export async function getAllNoteTags() {
  const notes = await db.note.findMany({
    where: { published: true },
    select: { tags: true },
  });

  const tagCounts: Record<string, number> = {};
  notes.forEach((note) => {
    note.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  return Object.entries(tagCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

// ============================================
// NOTE ACTIONS
// ============================================
export async function createNote(data: NoteFormData) {
  await requireAdmin();

  const validated = noteSchema.parse(data);
  const slug = validated.slug || createSlug(validated.title);
  const readingTime = calculateReadingTime(validated.content);

  const note = await db.note.create({
    data: {
      title: validated.title,
      slug,
      content: validated.content,
      published: validated.published,
      readingTime,
      publishedAt: validated.published ? new Date() : null,
      tags: validated.tags || [],
    },
  });

  revalidatePath("/admin/notes");
  revalidatePath("/notes");
  return { success: true, data: note };
}

export async function updateNote(id: string, data: NoteFormData) {
  await requireAdmin();

  const validated = noteSchema.parse(data);
  const slug = validated.slug || createSlug(validated.title);
  const readingTime = calculateReadingTime(validated.content);

  // Get current note to check published status
  const currentNote = await db.note.findUnique({ where: { id } });

  const note = await db.note.update({
    where: { id },
    data: {
      title: validated.title,
      slug,
      content: validated.content,
      published: validated.published,
      readingTime,
      // Set publishedAt only when first publishing
      publishedAt: validated.published && !currentNote?.publishedAt
        ? new Date()
        : currentNote?.publishedAt,
      tags: validated.tags || [],
    },
  });

  revalidatePath("/admin/notes");
  revalidatePath("/notes");
  revalidatePath(`/notes/${note.slug}`);
  return { success: true, data: note };
}

export async function deleteNote(id: string) {
  await requireAdmin();

  await db.note.delete({ where: { id } });

  revalidatePath("/admin/notes");
  revalidatePath("/notes");
  return { success: true };
}

export async function getNotes(options?: {
  published?: boolean;
  limit?: number;
  tag?: string;
}) {
  return db.note.findMany({
    where: {
      published: options?.published,
      tags: options?.tag ? { has: options.tag } : undefined,
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: options?.limit,
  });
}

export async function getPaginatedNotes(options: {
  published?: boolean;
  tag?: string;
  limit?: number;
  cursor?: string;
}) {
  const limit = options.limit || 10;

  const notes = await db.note.findMany({
    where: {
      published: options.published,
      tags: options.tag ? { has: options.tag } : undefined,
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: limit + 1,
    cursor: options.cursor ? { id: options.cursor } : undefined,
    skip: options.cursor ? 1 : 0,
  });

  const hasMore = notes.length > limit;
  const items = hasMore ? notes.slice(0, limit) : notes;
  const nextCursor = hasMore ? items[items.length - 1]?.id : undefined;

  return {
    items,
    nextCursor,
    hasMore,
  };
}

export async function getNoteBySlug(slug: string) {
  return db.note.findUnique({
    where: { slug },
  });
}

export async function getNoteById(id: string) {
  return db.note.findUnique({
    where: { id },
  });
}
