"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { movieSchema, MovieFormData } from "@/lib/validations";
import { auth } from "@/lib/auth";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export async function createMovie(data: MovieFormData) {
  await requireAdmin();

  const validated = movieSchema.parse(data);

  const movie = await db.movie.create({
    data: {
      title: validated.title,
      director: validated.director || null,
      posterUrl: validated.posterUrl || null,
      rating: validated.rating,
      status: validated.status,
      published: validated.published,
    },
  });

  revalidatePath("/admin/movies");
  revalidatePath("/movies");
  return { success: true, data: movie };
}

export async function updateMovie(id: string, data: MovieFormData) {
  await requireAdmin();

  const validated = movieSchema.parse(data);

  const movie = await db.movie.update({
    where: { id },
    data: {
      title: validated.title,
      director: validated.director || null,
      posterUrl: validated.posterUrl || null,
      rating: validated.rating,
      status: validated.status,
      published: validated.published,
    },
  });

  revalidatePath("/admin/movies");
  revalidatePath("/movies");
  return { success: true, data: movie };
}

export async function deleteMovie(id: string) {
  await requireAdmin();
  await db.movie.delete({ where: { id } });
  revalidatePath("/admin/movies");
  revalidatePath("/movies");
  return { success: true };
}

export async function getMovies(options?: {
  published?: boolean;
  status?: string;
  limit?: number;
}) {
  return db.movie.findMany({
    where: {
      published: options?.published,
      status: options?.status as any,
    },
    orderBy: { updatedAt: "desc" },
    take: options?.limit,
  });
}

export async function getMovieById(id: string) {
  return db.movie.findUnique({ where: { id } });
}
