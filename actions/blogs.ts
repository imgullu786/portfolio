'use server'

import { revalidatePath } from "next/cache";
import { blogSchema, BlogFormData } from "@/lib/validations";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { createSlug } from "@/lib/utils";


async function requireAdmin() {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "ADMIN") {
        throw new Error("Unauthorized");
    }
    return session.user;
}

// Calculate reading time
function calculateReadingTime(content: string) : number {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
}

// Get all unique tags with count
async function getUniqueTags() {
    const blogs = await db.blog.findMany({
        where: { published: true },
        select: { tags: true },
    });

    const tagCounts: Record<string, number> = {};
    blogs.forEach((blog) => {
        blog.tags.forEach((tag) => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
    });

    return Object.entries(tagCounts)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count);
}

// Blog Actions
export async function createBlog(data: BlogFormData) {
    await requireAdmin();
    
    const validated = blogSchema.parse(data);
    const slug = validated.slug || createSlug(validated.title);
    const readingTime = calculateReadingTime(validated.content);

    const blog = await db.blog.create({
        data: {
            title: validated.title,
            slug,
            excerpt: validated.excerpt,
            content: validated.content,
            coverImage: validated.coverImage,
            published: validated.published,
            featured: validated.featured,
            readingTime,
            publishedAt: validated.published ? new Date() : null,
            tags: validated.tags,
        }
    })
    
    revalidatePath("/admin/blogs");
    revalidatePath("/blog");
    return { success: true, data: blog };
}

export async function updateBlog(id: string, data: BlogFormData) {
    await requireAdmin();
    
    const validated = blogSchema.parse(data);
    const slug = validated.slug || createSlug(validated.title);
    const readingTime = calculateReadingTime(validated.content);
    
    // Get current blog to check published status
    const currentBlog = await db.blog.findUnique({ where: { id } });

    const blog = await db.blog.update({
        where: { id },
        data: {
            title: validated.title,
            slug,
            excerpt: validated.excerpt,
            content: validated.content,
            coverImage: validated.coverImage,
            published: validated.published,
            featured: validated.featured,
            readingTime,
            publishedAt: validated.published && !currentBlog?.publishedAt
                ? new Date()
                : currentBlog?.publishedAt,
            tags: validated.tags,
        }
    })

    revalidatePath("/admin/blogs");
    revalidatePath("/blog");
    revalidatePath(`/blog/${blog.slug}`);
    return { success: true, data: blog };
}

export async function deleteBlog(id: string) {
    await requireAdmin();

    const blog = await db.blog.delete({ where: { id } });

    revalidatePath("/admin/blogs");
    revalidatePath("/blog");
    return { success: true, data: blog };
}

export async function getBlogs(options?: {
    published?: boolean;
    featured?: boolean;
    limit?: number;
    tag?: string;
}) {
    return db.blog.findMany({
        where: {
            published: options?.published,
            featured: options?.featured,
            tags: options?.tag ? { has: options.tag } : undefined,
        },
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        take: options?.limit,
    });
}

export async function getPaginatedBlogs(options: {
    published?: boolean;
    tag?: string;
    limit?: number;
    cursor?: string;
}) {
    const limit = options.limit || 10;

    const blogs = await db.blog.findMany({
        where: {
            published: options.published,
            tags: options.tag ? { has: options.tag } : undefined,
        },
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        take: limit + 1, // Fetch one extra to check if there's more
        cursor: options.cursor ? { id: options.cursor } : undefined,
        skip: options.cursor ? 1 : 0, // Skip the cursor itself
    });

    const hasMore = blogs.length > limit;
    const items = hasMore ? blogs.slice(0, limit) : blogs;
    const nextCursor = hasMore ? items[items.length - 1]?.id : undefined;

    return {
        items,
        nextCursor,
        hasMore,
    };
}

export async function getBlogBySlug(slug: string) {
    return db.blog.findUnique({
        where: { slug },
    });
}

export async function getBlogById(id: string) {
    return db.blog.findUnique({
        where: { id },
    });
}

export async function incrementBlogViews(id: string) {
    await db.blog.update({
        where: { id },
        data: {
            views: { increment: 1 },
        },
    });
}
