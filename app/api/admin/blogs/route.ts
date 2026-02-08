import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const blogs = await db.blog.findMany({
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(blogs);
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}
