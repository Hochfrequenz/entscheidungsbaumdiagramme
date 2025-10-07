import { existsSync, rmSync } from "fs";
import { join } from "path";

const exclude = ["FV2104", "FV2110", "FV2204", "FV2210", "FV2304", "FV2310"];
const ebdDir = join(process.cwd(), "static", "ebd");

for (const version of exclude) {
  const path = join(ebdDir, version);
  if (existsSync(path)) {
    rmSync(path, { recursive: true, force: true });
    console.log(`excluded ${path} from build/`);
  }
}
