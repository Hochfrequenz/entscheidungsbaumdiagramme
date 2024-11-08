import { getEbdsWithMetadata } from "$server/ebd-loader";
import { getFormatVersions } from "$server/format-version-loader";

export const load = async () => {
  const formatVersions = getFormatVersions();
  const ebds = getEbdsWithMetadata();

  return {
    formatVersions,
    ebds,
  };
};
