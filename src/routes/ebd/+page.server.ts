import {
  getChapters,
  getEbdMetadata,
  getEbdNames,
  getRoles,
} from "$server/ebd-loader";
import { getFormatVersions } from "$server/format-version-loader";

export const load = async () => {
  const ebds = getEbdNames();
  const formatVersions = getFormatVersions();
  const metadata = getEbdMetadata();
  const roles = getRoles();
  const chapters = getChapters();

  return {
    ebds,
    formatVersions,
    metadata,
    roles,
    chapters,
    initialState: {
      formatVersion: "",
      ebd: "",
      roles: [],
      chapters: [],
      ebdList: [],
    },
  };
};
