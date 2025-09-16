import { map } from "lodash";

import { GroupSelect } from "src/components/GroupSelect";
import { Checkbox } from "src/components/Inputs/Checkbox";

export type Filters = {
  q?: string;
  openRentals?: boolean;
  groups?: number[];
};

type Props = {
  filters: Filters;
  setFilters: (updater: (previousFilters: Filters) => Filters) => void;
};

export function PeopleFilters({ filters, setFilters }: Props) {
  const update = (updater: Partial<Filters>) =>
    setFilters((filters) => ({ ...filters, ...updater }));

  return (
    <div className="form mb-3 col-lg-6">
      <div className="form-switch mb-2">
        <Checkbox
          value={filters.openRentals}
          className="me-3"
          onChange={() => update({ openRentals: !filters.openRentals })}
        />
        Open Rentals only
      </div>
      <label>Groups:</label>
      <GroupSelect
        groupIds={filters.groups ?? []}
        onChange={(groups) => update({ groups: map(groups, "id") })}
      />
    </div>
  );
}
