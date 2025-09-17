import { useLocation, useNavigate } from "react-router-dom";

type Args<Filters> = {
  parse: (params: URLSearchParams) => Filters;
  serialize: (filters: Filters) => Record<string, string>;
};
type Updater<Filters> = (previousFilters: Filters) => Filters;
type ReturnType<Filters> = {
  filters: Filters;
  setFilters: (updater: Updater<Filters>) => void;
};

export function useQueryParamFilters<Filters extends Record<string, any>>({
  parse,
  serialize,
}: Args<Filters>): ReturnType<Filters> {
  const navigate = useNavigate();
  const location = useLocation();

  const getFilters = () => {
    const params = new URLSearchParams(location.search);
    return parse(params);
  };

  const setFilters = (updater: Updater<Filters>) => {
    const newFilters = updater(getFilters());
    const serialized = serialize(newFilters);
    const params = new URLSearchParams(serialized);
    navigate(
      { pathname: location.pathname, search: params.toString() },
      { replace: true },
    );
  };

  return { filters: getFilters(), setFilters };
}
