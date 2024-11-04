import { getFormatVersions } from "$server/format-version-loader";
import { prerenderEntries } from "$server/prerender-entries";

import type { PageServerLoad } from "./$types";

interface RouteEntry {
  ebd: string;
  filePath: string;
}

export function entries() {
  const routes = prerenderEntries();
  return routes.map((route: RouteEntry) => ({
    ebd: route.ebd,
  }));
}

export const load: PageServerLoad = async ({ params }) => {
  const [formatVersion, ebdFile] = params.ebd.split("/");
  const availableVersions = getFormatVersions();
  const version = availableVersions.find(
    (v: { code: string }) => v.code === formatVersion,
  );

  return {
    formatVersion: version,
    ebdFile,
    svgPath: `/ebd/${formatVersion}/${ebdFile}.svg`,
  };
};
