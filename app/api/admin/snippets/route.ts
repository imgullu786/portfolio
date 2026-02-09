import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
    try {
        const snippets = await db.snippet.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(snippets);
    } catch (error) {
        console.error("Failed to fetch snippets:", error);
        return NextResponse.json(
            { error: "Failed to fetch snippets" },
            { status: 500 }
        );
    }
}
