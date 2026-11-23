import { existsSync, readdirSync, rmSync } from "fs";
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

// The data repo also contains files that the app does not use at runtime. They are not shipped,
// because they exceed the file count limit of Azure Static Web Apps ("The number of static files was too large").
// Revisit when the UI starts using the outcomes files.
const unusedRootFiles = ["format_versions.json", "llms.txt"];
const unusedFormatVersionFile =
  /^(E_\d{4}\.outcomes\.json|.+\.schema\.json|index\.json|pruefi_to_key\.json|export_report\.json)$/;

for (const file of unusedRootFiles) {
  const path = join(ebdDir, file);
  if (existsSync(path)) {
    rmSync(path, { force: true });
    console.log(`excluded ${path} from build/`);
  }
}

if (existsSync(ebdDir)) {
  for (const dirent of readdirSync(ebdDir, { withFileTypes: true })) {
    if (!dirent.isDirectory() || !dirent.name.startsWith("FV")) continue;
    const versionDir = join(ebdDir, dirent.name);
    for (const file of readdirSync(versionDir)) {
      if (unusedFormatVersionFile.test(file)) {
        rmSync(join(versionDir, file), { force: true });
      }
    }
  }
}
