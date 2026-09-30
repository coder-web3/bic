import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const dataFilePath = path.join(process.cwd(), "src", "data", "servicesData.json");

export async function GET() {
  try {
    const fileContents = fs.readFileSync(dataFilePath, "utf8");
    const data = JSON.parse(fileContents);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error reading services data:", error);
    return NextResponse.json({ error: "Failed to read services data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // If body contains a single service update { serviceId, serviceData }
    if (body && typeof body === "object" && body.serviceId && body.serviceData) {
      let currentList: any[] = [];
      if (fs.existsSync(dataFilePath)) {
        try {
          currentList = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
        } catch (e) {
          currentList = [];
        }
      }

      const sIdx = currentList.findIndex((s: any) => s.id === body.serviceId);
      if (sIdx >= 0) {
        currentList[sIdx] = body.serviceData;
      } else {
        currentList.push(body.serviceData);
      }

      fs.writeFileSync(dataFilePath, JSON.stringify(currentList, null, 2), "utf8");

      try {
        revalidatePath("/", "layout");
        revalidatePath("/services", "layout");
        revalidatePath("/services", "page");
      } catch (revalidateErr) {
        console.warn("Revalidation warning:", revalidateErr);
      }

      return NextResponse.json({ 
        success: true, 
        message: `Service "${body.serviceData?.title || body.serviceId}" saved independently!` 
      });
    }

    // Default: full list save
    fs.writeFileSync(dataFilePath, JSON.stringify(body, null, 2), "utf8");
    
    // Invalidate Next.js cache across service routes so changes reflect instantly
    try {
      revalidatePath("/", "layout");
      revalidatePath("/services", "layout");
      revalidatePath("/services", "page");
    } catch (revalidateErr) {
      console.warn("Revalidation warning:", revalidateErr);
    }

    return NextResponse.json({ success: true, message: "Services updated successfully" });
  } catch (error) {
    console.error("Error saving services data:", error);
    return NextResponse.json({ error: "Failed to save services data" }, { status: 500 });
  }
}

