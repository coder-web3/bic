import fs from "fs";
import path from "path";
import defaultBlogData from "@/data/blogData.json";

export function getBlogData() {
  try {
    const dataFilePath = path.join(process.cwd(), "src", "data", "blogData.json");
    if (fs.existsSync(dataFilePath)) {
      const fileContents = fs.readFileSync(dataFilePath, "utf8");
      return JSON.parse(fileContents);
    }
  } catch (err) {
    console.error("Error reading blogData.json from disk, using default:", err);
  }
  return defaultBlogData;
}
