import fs from "fs";
import path from "path";
import defaultAboutData from "@/data/aboutData.json";

export function getAboutData() {
  try {
    const dataFilePath = path.join(process.cwd(), "src", "data", "aboutData.json");
    if (fs.existsSync(dataFilePath)) {
      const fileContents = fs.readFileSync(dataFilePath, "utf8");
      return JSON.parse(fileContents);
    }
  } catch (err) {
    console.error("Error reading aboutData.json from disk, using default:", err);
  }
  return defaultAboutData;
}
