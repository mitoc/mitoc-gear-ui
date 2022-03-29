import { partial } from "lodash";

import { LoadingStatus, CacheState, SetsKey, ValueList } from "./types";

function getDefaultQueryState() {
  return { results: {}, status: LoadingStatus.loading };
}

function markPageLoading(
  pty: SetsKey,
  state: CacheState,
  query: string,
  page: number
) {
  state[pty][query] ??= getDefaultQueryState();
  state[pty][query].results[page] = {
    status: LoadingStatus.loading,
  };
}

function markPageFetched<K extends SetsKey>(
  pty: K,
  state: CacheState,
  query: string,
  page: number,
  response: { count: number; results: ValueList<K> }
) {
  state[pty][query] ??= getDefaultQueryState();

  state[pty][query].status = LoadingStatus.idle;
  state[pty][query].number = response.count;
  state[pty][query].results[page] = {
    status: LoadingStatus.idle,
  };
  state[pty][query].results[page].value = response.results;
}

export const markPeoplePageLoading = partial(markPageLoading, "peopleSets");

export const markPeoplePageFetched = partial(
  markPageFetched,
  "peopleSets" as const
);

export const markGearPageLoading = partial(markPageLoading, "gearSets");

export const markGearPageFetched = partial(
  markPageFetched,
  "gearSets" as const
);
