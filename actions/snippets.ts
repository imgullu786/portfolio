"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { snippetSchema } from "@/lib/validations";
import type { SnippetFormData } from "@/lib/validations";

async function requireAdmin() {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "ADMIN") {
        throw new Error("Unauthorized");
    }
    return session.user;
}

export async function createSnippet(data: SnippetFormData) {
    await requireAdmin();
    const validated = snippetSchema.parse(data);

    const snippet = await db.snippet.create({
        data: {
            caption: validated.caption || null,
            imageUrl: validated.imageUrl || null,
            published: validated.published,
        },
    });

    revalidatePath("/admin/snippets");
    revalidatePath("/snippets");
    return { success: true, data: snippet };
}

export async function updateSnippet(id: string, data: SnippetFormData) {
    await requireAdmin();
    const validated = snippetSchema.parse(data);

    const snippet = await db.snippet.update({
        where: { id },
        data: {
            caption: validated.caption || null,
            imageUrl: validated.imageUrl || null,
            published: validated.published,
        },
    });

    revalidatePath("/admin/snippets");
    revalidatePath("/snippets");
    return { success: true, data: snippet };
}

export async function deleteSnippet(id: string) {
    await requireAdmin();
    await db.snippet.delete({ where: { id } });
    revalidatePath("/admin/snippets");
    revalidatePath("/snippets");
    return { success: true };
}

export async function getSnippets(options?: { published?: boolean; limit?: number }) {
    return db.snippet.findMany({
        where: {
            published: options?.published,
        },
        orderBy: { createdAt: "desc" },
        take: options?.limit,
    });
}

export async function getSnippetById(id: string) {
    return db.snippet.findUnique({ where: { id } });
}
