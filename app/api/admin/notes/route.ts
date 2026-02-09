import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET all notes for admin
export async function GET() {
  const notes = await db.note.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      published: true,
      readingTime: true,
      publishedAt: true,
      createdAt: true,
      tags: true,
    },
  });

  return NextResponse.json(notes);
}
