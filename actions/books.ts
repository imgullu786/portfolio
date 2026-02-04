"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { bookSchema, BookFormData } from "@/lib/validations";
import { auth } from "@/lib/auth";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export async function createBook(data: BookFormData) {
  await requireAdmin();

  const validated = bookSchema.parse(data);

  const book = await db.book.create({
    data: {
      title: validated.title,
      author: validated.author || null,
      coverUrl: validated.coverUrl || null,
      rating: validated.rating,
      status: validated.status,
      published: validated.published,
    },
  });

  revalidatePath("/admin/books");
  revalidatePath("/books");
  return { success: true, data: book };
}

export async function updateBook(id: string, data: BookFormData) {
  await requireAdmin();

  const validated = bookSchema.parse(data);

  const book = await db.book.update({
    where: { id },
    data: {
      title: validated.title,
      author: validated.author || null,
      coverUrl: validated.coverUrl || null,
      rating: validated.rating,
      status: validated.status,
      published: validated.published,
    },
  });

  revalidatePath("/admin/books");
  revalidatePath("/books");
  return { success: true, data: book };
}

export async function deleteBook(id: string) {
  await requireAdmin();
  await db.book.delete({ where: { id } });
  revalidatePath("/admin/books");
  revalidatePath("/books");
  return { success: true };
}

export async function getBooks(options?: {
  published?: boolean;
  status?: string;
  limit?: number;
}) {
  return db.book.findMany({
    where: {
      published: options?.published,
      status: options?.status as any,
    },
    orderBy: { updatedAt: "desc" },
    take: options?.limit,
  });
}

export async function getBookById(id: string) {
  return db.book.findUnique({ where: { id } });
}
