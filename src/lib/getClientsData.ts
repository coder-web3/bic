import fs from "fs";
import path from "path";
import defaultClients from "@/data/clientsData.json";

export interface ClientItem {
  id: string;
  name: string;
  arabic?: string;
  type?: string;
  logo?: string;
}

export function getClientsData(): ClientItem[] {
  try {
    const dataFilePath = path.join(process.cwd(), "src", "data", "clientsData.json");
    if (fs.existsSync(dataFilePath)) {
      const fileContents = fs.readFileSync(dataFilePath, "utf8");
      const parsed = JSON.parse(fileContents);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      if (parsed && Array.isArray(parsed.clients)) {
        return parsed.clients;
      }
    }
  } catch (err) {
    console.error("Error reading clients data from disk:", err);
  }
  return defaultClients as ClientItem[];
}
