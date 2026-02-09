import { NextResponse } from "next/server";
import { deleteSnippet, getSnippetById } from "@/lib/actions/snippets";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const snippet = await getSnippetById(id);
        if (!snippet) {
            return NextResponse.json({ error: "Snippet not found" }, { status: 404 });
        }
        return NextResponse.json(snippet);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch snippet" },
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
        await deleteSnippet(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to delete snippet" },
            { status: 500 }
        );
    }
}
