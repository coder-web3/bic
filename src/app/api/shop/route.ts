import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const dataFilePath = path.join(process.cwd(), "src", "data", "shopData.json");

export async function GET() {
  try {
    if (!fs.existsSync(dataFilePath)) {
      return NextResponse.json([]);
    }
    const fileContents = fs.readFileSync(dataFilePath, "utf8");
    const data = JSON.parse(fileContents || "[]");
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error reading shop data:", error);
    return NextResponse.json({ error: "Failed to read shop data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid data format. Expected array." }, { status: 400 });
    }

    fs.writeFileSync(dataFilePath, JSON.stringify(body, null, 2), "utf8");

    try {
      revalidatePath("/", "layout");
      revalidatePath("/shop", "page");
    } catch (revalidateErr) {
      console.warn("Revalidation warning:", revalidateErr);
    }

    return NextResponse.json({
      success: true,
      message: "Shop inventory updated and saved successfully!"
    });
  } catch (error) {
    console.error("Error saving shop data:", error);
    return NextResponse.json({ error: "Failed to save shop data" }, { status: 500 });
  }
}
