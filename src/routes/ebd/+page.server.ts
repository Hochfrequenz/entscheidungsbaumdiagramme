import { getEbdsWithMetadata } from "$server/ebd-loader";
import { getFormatVersions } from "$server/format-version-loader";
import { getRoles } from "$server/ebd-loader";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const formatVersions = getFormatVersions();
  const ebds = getEbdsWithMetadata();
  const roles = getRoles();

  return {
    formatVersions,
    ebds,
    roles,
  };
};
