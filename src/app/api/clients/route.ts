import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";

const clientsFilePath = path.join(process.cwd(), "src", "data", "clientsData.json");

export async function GET() {
  try {
    if (!fs.existsSync(clientsFilePath)) {
      return NextResponse.json([], {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      });
    }
    const data = fs.readFileSync(clientsFilePath, "utf8");
    return NextResponse.json(JSON.parse(data), {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  } catch (error) {
    console.error("Error reading clients data:", error);
    return NextResponse.json({ error: "Failed to read clients data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid data format. Expected an array of client objects." }, { status: 400 });
    }

    fs.writeFileSync(clientsFilePath, JSON.stringify(body, null, 2), "utf8");

    try {
      revalidatePath("/", "layout");
      revalidatePath("/clients", "page");
      revalidatePath("/admin/clients", "page");
    } catch (revalErr) {
      console.warn("Revalidation warning:", revalErr);
    }

    return NextResponse.json({ success: true, message: "Clients updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error saving clients data:", error);
    return NextResponse.json({ error: "Failed to save clients data" }, { status: 500 });
  }
}
