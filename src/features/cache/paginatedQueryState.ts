import { partial } from "lodash";

import { LoadingStatus, CacheState, PaginatedQueryState } from "./types";

function getDefaultQueryState() {
  return { results: {}, status: LoadingStatus.loading };
}

function markPageLoading<T>(
  get: (state: CacheState) => PaginatedQueryState<T>,
  cacheState: CacheState,
  query: string,
  page: number
) {
  const state = get(cacheState);
  state[query] ??= getDefaultQueryState();
  state[query].results[page] = {
    status: LoadingStatus.loading,
  };
}

function markPageFetched<T>(
  get: (state: CacheState) => PaginatedQueryState<T>,
  cacheState: CacheState,
  query: string,
  page: number,
  response: { count: number; results: T[] }
) {
  const state = get(cacheState);
  state[query] ??= getDefaultQueryState();

  state[query].status = LoadingStatus.idle;
  state[query].number = response.count;
  state[query].results[page] = {
    status: LoadingStatus.idle,
  };
  state[query].results[page].value = response.results;
}

export const markPeoplePageLoading = partial(
  markPageLoading,
  (cache) => cache.peopleSets
);

export const markPeoplePageFetched = partial(
  markPageFetched,
  (cache) => cache.peopleSets
);

export const markGearPageLoading = partial(
  markPageLoading,
  (cache) => cache.gearSets
);

export const markGearPageFetched = partial(
  markPageFetched,
  (cache) => cache.gearSets
);
