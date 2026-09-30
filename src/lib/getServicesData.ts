import fs from "fs";
import path from "path";
import defaultServices from "@/data/servicesData.json";

export function getServicesData() {
  try {
    const dataFilePath = path.join(process.cwd(), "src", "data", "servicesData.json");
    if (fs.existsSync(dataFilePath)) {
      const fileContents = fs.readFileSync(dataFilePath, "utf8");
      return JSON.parse(fileContents);
    }
  } catch (err) {
    console.error("Error loading services data from disk, using fallback:", err);
  }
  return defaultServices;
}
