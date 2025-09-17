import { ListWrapper } from "./types";

export function getPagesCount(data: ListWrapper<unknown>): number {
  return Math.ceil(data?.count / (data.pageSize ?? 100));
}
