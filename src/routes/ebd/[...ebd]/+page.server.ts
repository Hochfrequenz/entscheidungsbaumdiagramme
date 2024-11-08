import { error } from "@sveltejs/kit";

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
  const path = params.ebd.endsWith("/") ? params.ebd.slice(0, -1) : params.ebd;
  const segments = path.split("/");
  const [formatVersion, ebdFile] = segments;

  if (!formatVersion || !ebdFile) {
    throw error(404);
  }

  const availableVersions = getFormatVersions();
  const version = availableVersions.find(
    (v: { code: string }) => v.code === formatVersion,
  );

  if (!version) {
    throw error(404);
  }

  return {
    formatVersion: version,
    ebdFile,
    svgPath: `/ebd/${formatVersion}/${ebdFile}.svg`,
  };
};
