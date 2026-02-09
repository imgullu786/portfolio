import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const movie = await db.movie.findUnique({
            where: { id },
        });

        if (!movie) {
            return NextResponse.json(
                { error: "Movie not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(movie);
    } catch (error) {
        console.error("Failed to fetch movie:", error);
        return NextResponse.json(
            { error: "Failed to fetch movie" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await db.movie.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete movie:", error);
        return NextResponse.json(
            { error: "Failed to delete movie" },
            { status: 500 }
        );
    }
}
