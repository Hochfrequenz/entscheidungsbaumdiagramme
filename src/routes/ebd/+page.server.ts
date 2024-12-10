import { getEbdMetadata, getEbdNames, getRoles } from "$server/ebd-loader";
import { getFormatVersions } from "$server/format-version-loader";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url }) => {
  const ebds = getEbdNames();
  const formatVersions = getFormatVersions();
  const metadata = getEbdMetadata();
  const roles = getRoles();

  const initialFormatVersion = url.searchParams.get("fv") || "";
  const initialEbd = url.searchParams.get("ebd") || "";
  const initialRoles = url.searchParams.get("roles")?.split(",") || [];

  let initialEbdList = initialFormatVersion
    ? ebds[initialFormatVersion] || []
    : [];

  return {
    ebds,
    formatVersions,
    metadata,
    roles,
    initialState: {
      formatVersion: initialFormatVersion,
      ebd: initialEbd,
      roles: initialRoles,
      ebdList: initialEbdList,
    },
  };
};
