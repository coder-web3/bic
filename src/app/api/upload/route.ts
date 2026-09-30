import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const METADATA_FILE = path.join(process.cwd(), "src", "data", "mediaMetadata.json");

// Helper to ensure upload directory exists
function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

// Helper to read metadata
function getMetadata(): Record<string, { alt?: string; title?: string; updatedAt?: string }> {
  try {
    if (fs.existsSync(METADATA_FILE)) {
      const data = fs.readFileSync(METADATA_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading mediaMetadata.json:", err);
  }
  return {};
}

// Helper to save metadata
function saveMetadata(meta: Record<string, { alt?: string; title?: string; updatedAt?: string }>) {
  try {
    const dir = path.dirname(METADATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(METADATA_FILE, JSON.stringify(meta, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving mediaMetadata.json:", err);
  }
}

// GET: List all uploaded media files in public/uploads along with their alt tags
export async function GET() {
  try {
    ensureUploadDir();
    const files = fs.readdirSync(UPLOAD_DIR);
    const metadata = getMetadata();

    const mediaList = files
      .filter((file) => !file.startsWith(".") && file !== "media-metadata.json")
      .map((filename) => {
        const filePath = path.join(UPLOAD_DIR, filename);
        const stats = fs.statSync(filePath);
        const fileMeta = metadata[filename] || metadata[`/uploads/${filename}`] || {};
        return {
          filename,
          url: `/uploads/${filename}`,
          size: stats.size,
          createdAt: stats.birthtime.toISOString(),
          alt: fileMeta.alt || "",
          title: fileMeta.title || "",
        };
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ success: true, files: mediaList, metadata });
  } catch (error: any) {
    console.error("Error reading media uploads:", error);
    return NextResponse.json({ error: "Failed to load media files" }, { status: 500 });
  }
}

// POST: Handle device file uploads
export async function POST(request: Request) {
  try {
    ensureUploadDir();

    const contentType = request.headers.get("content-type") || "";

    // Check if JSON request (e.g. metadata update)
    if (contentType.includes("application/json")) {
      const body = await request.json();
      const { filename, url, alt, title } = body;
      const key = filename || url;

      if (!key) {
        return NextResponse.json({ error: "Filename or URL is required" }, { status: 400 });
      }

      const metadata = getMetadata();
      metadata[key] = {
        ...metadata[key],
        alt: typeof alt === "string" ? alt : metadata[key]?.alt || "",
        title: typeof title === "string" ? title : metadata[key]?.title || "",
        updatedAt: new Date().toISOString(),
      };
      if (filename && !metadata[`/uploads/${filename}`]) {
        metadata[`/uploads/${filename}`] = metadata[key];
      }

      saveMetadata(metadata);
      return NextResponse.json({ success: true, key, metadata: metadata[key] });
    }

    // Form data file upload
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const initialAlt = (formData.get("alt") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Check file type
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
      "image/avif",
      "image/x-icon",
      "image/vnd.microsoft.icon",
      "image/ico"
    ];
    const isIconExtension = /\.(ico|svg|png|jpg|jpeg|webp|gif|avif)$/i.test(file.name);
    if (!validTypes.includes(file.type) && !isIconExtension) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload a JPEG, PNG, WEBP, GIF, SVG, AVIF, or ICO image." },
        { status: 400 }
      );
    }

    // Generate safe unique filename
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const sanitizeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueFilename = `upload-${Date.now()}-${sanitizeName}`;
    const filePath = path.join(UPLOAD_DIR, uniqueFilename);

    fs.writeFileSync(filePath, buffer);

    const fileUrl = `/uploads/${uniqueFilename}`;

    // Save alt tag in metadata if provided
    if (initialAlt) {
      const metadata = getMetadata();
      metadata[uniqueFilename] = {
        alt: initialAlt,
        updatedAt: new Date().toISOString(),
      };
      metadata[fileUrl] = metadata[uniqueFilename];
      saveMetadata(metadata);
    }

    return NextResponse.json({
      success: true,
      url: fileUrl,
      filename: uniqueFilename,
      originalName: file.name,
      size: file.size,
      alt: initialAlt,
    });
  } catch (error: any) {
    console.error("Error saving uploaded file:", error);
    return NextResponse.json({ error: "Failed to upload file to server" }, { status: 500 });
  }
}

// PATCH / PUT: Update alt tag or metadata for a media file
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { filename, url, alt, title } = body;
    const key = filename || url;

    if (!key) {
      return NextResponse.json({ error: "Filename or URL is required" }, { status: 400 });
    }

    const metadata = getMetadata();
    metadata[key] = {
      ...metadata[key],
      alt: typeof alt === "string" ? alt : metadata[key]?.alt || "",
      title: typeof title === "string" ? title : metadata[key]?.title || "",
      updatedAt: new Date().toISOString(),
    };
    if (filename && !metadata[`/uploads/${filename}`]) {
      metadata[`/uploads/${filename}`] = metadata[key];
    }

    saveMetadata(metadata);
    return NextResponse.json({ success: true, key, metadata: metadata[key] });
  } catch (error: any) {
    console.error("Error updating media metadata:", error);
    return NextResponse.json({ error: "Failed to update metadata" }, { status: 500 });
  }
}

// DELETE: Remove a file from public/uploads and clean up its metadata
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("filename");

    if (!filename) {
      return NextResponse.json({ error: "Filename parameter is required" }, { status: 400 });
    }

    const filePath = path.join(UPLOAD_DIR, filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);

      // Clean up metadata
      const metadata = getMetadata();
      delete metadata[filename];
      delete metadata[`/uploads/${filename}`];
      saveMetadata(metadata);

      return NextResponse.json({ success: true, message: "File deleted successfully" });
    } else {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
  } catch (error: any) {
    console.error("Error deleting file:", error);
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
  }
}
