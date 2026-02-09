import { NextRequest, NextResponse } from "next/server";
import { deleteNote, getNoteById } from "@/actions/notes";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET single note
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const note = await getNoteById(id);

  if (!note) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  return NextResponse.json(note);
}

// DELETE note
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  
  try {
    await deleteNote(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete note" }, { status: 500 });
  }
}
