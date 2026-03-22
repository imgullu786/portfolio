import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabaseAdmin, STORAGE_BUCKET } from "@/lib/supabase";

// Sanitize filemname for URL safe
function sanitizeFilename(filename: string): string {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contentType = searchParams.get("contentType");
    const id = searchParams.get("id");

    if (!contentType || !id) {
      return NextResponse.json(
        { error: "contentType and id are required" },
        { status: 400 }
      );
    }

    const directory = `${contentType}/${id}`;

    // List files in the directory
    const { data: files, error } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .list(directory, {
        sortBy: { column: "created_at", order: "desc" },
      });

    if (error) {
      console.error("Supabase list error:", error);
      return NextResponse.json(
        { error: "Failed to list images" },
        { status: 500 }
      );
    }
    
    // Filter for image files and build public URLs
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
    const images = (files || [])
      .filter((file) => {
        const ext = file.name.split(".").pop()?.toLowerCase() || "";
        return imageExtensions.includes(ext);
      })
      .map((file) => {
        const { data } = supabaseAdmin.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(`${directory}/${file.name}`);

        return {
          filename: file.name,
          url: data.publicUrl,
        };
      });
      
    return NextResponse.json({ images });
  } catch (error) {
    console.error("List images error:", error);
    return NextResponse.json(
      { error: "Failed to list images" },
      { status: 500 }
    );
  }
}

// Upload image to Supabase Storage
export async function POST(request: NextRequest) {
  try {
    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const contentType = formData.get("contentType") as string | null;
    const id = formData.get("id") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    // Build directory path based on content type and ID
    let directory = "images";
    if (contentType && id) {
      directory = `${contentType}/${id}`;
    } else if (contentType) {
      directory = contentType;
    }

    // Use original sanitized filename with timestamp prefix to avoid collisions
    const timestamp = Date.now();
    const originalName = file.name.split(".").slice(0, -1).join(".") || "image";
    const extension = file.name.split(".").pop() || "png";
    const sanitizedName = sanitizeFilename(originalName);
    const filePath = `${directory}/${timestamp}-${sanitizedName}.${extension}`;

    // Convert file to buffer for upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Supabase Storage
    const { error } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to upload image" },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    return NextResponse.json({
      url: urlData.publicUrl,
      filename: filePath,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}

// Delete image from Supabase Storage
export async function DELETE(request: NextRequest) {
  try {
    // Get the file URL from the request body
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    // Extract file path from the public URL
    // Supabase public URLs look like: https://<project>.supabase.co/storage/v1/object/public/<bucket>/<path>
    const bucketSegment = `/storage/v1/object/public/${STORAGE_BUCKET}/`;
    const bucketIndex = url.indexOf(bucketSegment);

    if (bucketIndex === -1) {
      return NextResponse.json(
        { error: "Invalid image URL or URL doesn't match Supabase storage" },
        { status: 400 }
      );
    }

    const filePath = decodeURIComponent(
      url.substring(bucketIndex + bucketSegment.length)
    );

    // Delete the file
    const { error } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .remove([filePath]);

    if (error) {
      console.error("Supabase delete error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to delete image" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
