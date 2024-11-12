import { getEbdNames } from "$server/ebd-loader";
import { getFormatVersions } from "$server/format-version-loader";

export const load = async () => {
  const formatVersions = getFormatVersions();
  const ebds = getEbdNames();

  return {
    formatVersions,
    ebds,
  };
};
