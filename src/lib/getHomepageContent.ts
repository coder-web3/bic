import fs from "fs";
import path from "path";
import defaultContent from "@/data/homepageContent.json";

export function getHomepageContent() {
  try {
    const dataFilePath = path.join(process.cwd(), "src", "data", "homepageContent.json");
    if (fs.existsSync(dataFilePath)) {
      const fileContents = fs.readFileSync(dataFilePath, "utf8");
      return JSON.parse(fileContents);
    }
  } catch (err) {
    console.error("Error loading homepage content from disk, using fallback:", err);
  }
  return defaultContent;
}
