import { Checkbox } from "components/Inputs/Checkbox";
import { GroupSelect } from "components/GroupSelect";
import { PeopleGroup } from "apiClient/people";

export type Filters = {
  openRentals?: boolean;
  groups?: PeopleGroup[];
};

type Props = {
  filters: Filters;
  setFilters: (filters: Filters) => void;
};

export function PeopleFilters({ filters, setFilters }: Props) {
  const update = (updater: Partial<Filters>) =>
    setFilters({ ...filters, ...updater });

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
        groups={filters.groups ?? []}
        onChange={(groups) => update({ groups })}
      />
    </div>
  );
}
