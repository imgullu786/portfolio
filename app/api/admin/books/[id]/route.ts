import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const book = await db.book.findUnique({
            where: { id },
        });

        if (!book) {
            return NextResponse.json(
                { error: "Book not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(book);
    } catch (error) {
        console.error("Failed to fetch book:", error);
        return NextResponse.json(
            { error: "Failed to fetch book" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAdmin();
        const { id } = await params;
        await db.book.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete book:", error);
        return NextResponse.json(
            { error: "Failed to delete book" },
            { status: 500 }
        );
    }
}
