import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const dataFilePath = path.join(process.cwd(), "src", "data", "homepageContent.json");

export async function GET() {
  try {
    const fileContents = fs.readFileSync(dataFilePath, "utf8");
    const data = JSON.parse(fileContents);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error reading homepage content:", error);
    return NextResponse.json({ error: "Failed to read content" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    fs.writeFileSync(dataFilePath, JSON.stringify(body, null, 2), "utf8");
    
    // Invalidate Next.js cache so changes reflect instantly on live pages
    try {
      revalidatePath("/", "layout");
      revalidatePath("/", "page");
      revalidatePath("/about-us", "page");
    } catch (revalidateErr) {
      console.warn("Revalidation warning:", revalidateErr);
    }

    return NextResponse.json({ success: true, message: "Homepage content updated successfully" });
  } catch (error) {
    console.error("Error saving homepage content:", error);
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 });
  }
}

