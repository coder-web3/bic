import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";

const galleryFilePath = path.join(process.cwd(), "src", "data", "galleryData.json");

export async function GET() {
  try {
    if (!fs.existsSync(galleryFilePath)) {
      return NextResponse.json({}, {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      });
    }
    const data = fs.readFileSync(galleryFilePath, "utf8");
    return NextResponse.json(JSON.parse(data), {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  } catch (error) {
    console.error("Error reading gallery data:", error);
    return NextResponse.json({ error: "Failed to read gallery data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid data format." }, { status: 400 });
    }

    fs.writeFileSync(galleryFilePath, JSON.stringify(body, null, 2), "utf8");

    try {
      revalidatePath("/", "layout");
      revalidatePath("/gallery", "page");
      revalidatePath("/admin/gallery", "page");
    } catch (revalErr) {
      console.warn("Revalidation warning:", revalErr);
    }

    return NextResponse.json({ success: true, message: "Gallery data updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error saving gallery data:", error);
    return NextResponse.json({ error: "Failed to save gallery data" }, { status: 500 });
  }
}
