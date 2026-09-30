import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";
import defaultSettings from "@/data/siteSettings.json";

export const dynamic = "force-dynamic";

const dataFilePath = path.join(process.cwd(), "src", "data", "siteSettings.json");

export async function GET() {
  try {
    if (fs.existsSync(dataFilePath)) {
      const fileContents = fs.readFileSync(dataFilePath, "utf8");
      const data = JSON.parse(fileContents);
      return NextResponse.json({
        ...defaultSettings,
        ...data,
      });
    }
    return NextResponse.json(defaultSettings);
  } catch (error) {
    console.error("Error reading site settings:", error);
    return NextResponse.json({ error: "Failed to read site settings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    fs.writeFileSync(dataFilePath, JSON.stringify(body, null, 2), "utf8");
    
    // Invalidate Next.js cache
    try {
      revalidatePath("/", "layout");
    } catch (revalidateErr) {
      console.warn("Revalidation warning:", revalidateErr);
    }

    return NextResponse.json({ 
      success: true, 
      message: "Site settings saved successfully!" 
    });
  } catch (error) {
    console.error("Error saving site settings:", error);
    return NextResponse.json({ error: "Failed to save site settings" }, { status: 500 });
  }
}

