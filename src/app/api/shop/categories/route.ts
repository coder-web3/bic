import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const categoriesFilePath = path.join(process.cwd(), "src", "data", "shopCategories.json");

export async function GET() {
  try {
    if (!fs.existsSync(categoriesFilePath)) {
      return NextResponse.json([]);
    }
    const fileContents = fs.readFileSync(categoriesFilePath, "utf8");
    const data = JSON.parse(fileContents || "[]");
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error reading shop categories:", error);
    return NextResponse.json({ error: "Failed to read shop categories" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid data format. Expected array." }, { status: 400 });
    }

    fs.writeFileSync(categoriesFilePath, JSON.stringify(body, null, 2), "utf8");

    try {
      revalidatePath("/", "layout");
      revalidatePath("/shop", "page");
    } catch (revalidateErr) {
      console.warn("Revalidation warning:", revalidateErr);
    }

    return NextResponse.json({
      success: true,
      message: "Shop categories saved and updated successfully!"
    });
  } catch (error) {
    console.error("Error saving shop categories:", error);
    return NextResponse.json({ error: "Failed to save shop categories" }, { status: 500 });
  }
}
