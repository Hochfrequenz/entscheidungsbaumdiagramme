import { getFormatVersions } from "$server/format-version-loader";
import { prerenderEntries } from "$server/prerender-entries";

import type { PageServerLoad } from "./$types";

export function entries() {
  const routes = prerenderEntries();
  return routes.map((route) => ({
    ebd: route.ebd,
  }));
}

export const load: PageServerLoad = async ({ params }) => {
  const [formatVersion, ebdFile] = params.ebd.split("/");
  const availableVersions = getFormatVersions();
  const version = availableVersions.find((v) => v.code === formatVersion);

  return {
    formatVersion: version,
    ebdFile,
    svgPath: `/ebd/${formatVersion}/${ebdFile}.svg`,
  };
};
