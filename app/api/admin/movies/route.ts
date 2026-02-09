import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
    try {
        const movies = await db.movie.findMany({
            orderBy: { updatedAt: "desc" },
        });
        return NextResponse.json(movies);
    } catch (error) {
        console.error("Failed to fetch movies:", error);
        return NextResponse.json(
            { error: "Failed to fetch movies" },
            { status: 500 }
        );
    }
}
