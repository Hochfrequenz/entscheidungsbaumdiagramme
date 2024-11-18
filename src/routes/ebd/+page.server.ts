import { getEbdMetadata, getEbdNames, getRoles } from "$server/ebd-loader";
import { getFormatVersions } from "$server/format-version-loader";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const ebds = getEbdNames();
  const formatVersions = getFormatVersions();
  const metadata = getEbdMetadata();
  const roles = getRoles();

  return {
    ebds,
    formatVersions,
    metadata,
    roles,
  };
};
