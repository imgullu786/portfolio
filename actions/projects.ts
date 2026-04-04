'use server';

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { calculateReadingTime, createSlug } from "@/lib/utils";
import { projectSchema, ProjectFormData } from "@/lib/validations";
import { auth } from "@/lib/auth";

async function requireAdmin() {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "ADMIN") {
        throw new Error("Unauthorized");
    }
    return session.user;
}

// PROJECT ACTIONS
export async function createProject(data: ProjectFormData) {
    await requireAdmin();

    const validated = projectSchema.parse(data);
    const slug = validated.slug || createSlug(validated.title);
    const readingTime = calculateReadingTime(validated.content);

    const project = await db.project.create({
        data: {
            title: validated.title,
            slug,
            description: validated.description,
            content: validated.content || null,
            liveUrl: validated.liveUrl || null,
            githubUrl: validated.githubUrl || null,
            techStack: validated.techStack,
            featured: validated.featured,
            published: validated.published,
            sortOrder: validated.sortOrder,
            readingTime,
        },
    });

    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    return { success: true, data: project };
}

export async function updateProject(id: string, data: ProjectFormData) {
    await requireAdmin();

    const validated = projectSchema.parse(data);
    const slug = validated.slug || createSlug(validated.title);
    const readingTime = calculateReadingTime(validated.content);

    const project = await db.project.update({
        where: { id },
        data: {
            title: validated.title,
            slug,
            description: validated.description,
            content: validated.content || null,
            liveUrl: validated.liveUrl || null,
            githubUrl: validated.githubUrl || null,
            techStack: validated.techStack,
            featured: validated.featured,
            published: validated.published,
            sortOrder: validated.sortOrder,
            readingTime,
        },
    });

    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    revalidatePath(`/projects/${project.slug}`);
    return { success: true, data: project };
}

export async function deleteProject(id: string) {
    await requireAdmin();

    await db.project.delete({ where: { id } });

    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    return { success: true };
}

export async function getProjects(options?: {
    published?: boolean;
    featured?: boolean;
    limit?: number;
}) {
    return db.project.findMany({
        where: {
            published: options?.published,
            featured: options?.featured,
        },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        take: options?.limit,
    });
}

export async function getProjectBySlug(slug: string) {
    return db.project.findUnique({
        where: { slug },
    });
}

export async function getProjectById(id: string) {
    return db.project.findUnique({
        where: { id },
    });
}

