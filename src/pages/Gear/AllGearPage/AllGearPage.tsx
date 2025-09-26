import { compact, isEqual } from "lodash";
import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { GearSummary } from "src/apiClient/gear";
import { DataGrid } from "src/components/DataGrid";
import { GearLink } from "src/components/GearLink";
import { SearchTextField } from "src/components/Inputs/TextField";
import { TablePagination } from "src/components/TablePagination";
import { useSetPageTitle } from "src/hooks";
import { useGearList } from "src/redux/api";

import { GearStatus } from "../GearStatus";

import { GearFilters, GearStatusFilter } from "./GearFilters";
import { gearStatusToBoolean, useGearFilters } from "./useGearFilter";

export function AllGearPage() {
  useSetPageTitle("Gear");
  const [page, setPage] = useState<number>(1);
  const { filters, setFilters } = useGearFilters();
  const [showFilters, setShowFilters] = useState<boolean>(
    !isEqual(filters, { retired: GearStatusFilter.exclude }), // Open the panel if filters are not the default
  );
  const { gearTypes, broken, missing, retired, q, locations, restricted } =
    filters;
  const query = q ?? "";
  const setQuery = (q: string) => setFilters((filters) => ({ ...filters, q }));

  const { gearList, nbPages } = useGearList({
    q: query,
    page,
    gearTypes: gearTypes,
    broken: gearStatusToBoolean(broken),
    missing: gearStatusToBoolean(missing),
    retired: gearStatusToBoolean(retired),
    restricted: gearStatusToBoolean(restricted),
    locations: locations,
  });

  const myColumns = compact([
    { key: "id", header: "Serial Number", renderer: IDCell, className: "" },
    { key: "type.typeName", header: "Type", renderer: TypeCell },
    {
      key: "description",
      header: "Description",
      hideOnMobile: true,
      renderer: DescriptionCell,
    },
    { key: "status", header: "Status", renderer: StatusCell },
    {
      key: "location",
      header: "Location",
      renderer: LocationCell,
      hideOnMobile: true,
    },
  ]);

  return (
    <>
      <SearchTextField
        value={query}
        onChange={(newQuery) => {
          setPage(1);
          setQuery(newQuery);
        }}
        className="mb-3"
        placeholder="Search"
        debounceTime={300}
      />

      {nbPages != null && (
        <div className="row">
          <div className="col-sm-auto">
            <TablePagination setPage={setPage} page={page} nbPage={nbPages} />
          </div>
          <div className="col-md d-flex flex-grow-1 justify-content-between">
            <button
              className="btn btn-outline-primary mb-3 ms-md-3"
              onClick={() => setShowFilters((v) => !v)}
            >
              ▽ Filters
            </button>
            <Link to="/add-gear">
              <button className="btn btn-outline-primary mb-3">
                ＋ Add new gear
              </button>
            </Link>
          </div>
        </div>
      )}

      {showFilters && <GearFilters filters={filters} setFilters={setFilters} />}

      {gearList && (
        <DataGrid columns={myColumns} data={gearList} rowWrapper={LinkRow} />
      )}
    </>
  );
}

function LinkRow({
  item: gearItem,
  children,
}: {
  item: GearSummary;
  children: React.ReactNode;
}) {
  return (
    <GearLink className="link-row" id={gearItem.id}>
      {children}
    </GearLink>
  );
}

function IDCell({ item: gearItem }: { item: GearSummary }) {
  const color = gearItem.available ? "bs-teal" : "bs-danger";
  return (
    <ColoredCell
      className="d-flex align-items-center p-2"
      color={`var(--${color})`}
    >
      {gearItem.id}
    </ColoredCell>
  );
}

function DescriptionCell({ item: gearItem }: { item: GearSummary }) {
  return (
    <>
      {gearItem.specification}
      {gearItem.description && (
        <>
          <br />
          {gearItem.description}
        </>
      )}
      {gearItem.size && (
        <>
          <br />
          Size: {gearItem.size}
        </>
      )}
    </>
  );
}

function StatusCell({ item: gearItem }: { item: GearSummary }) {
  return <GearStatus gearItem={gearItem} short={true} />;
}

function TypeCell({ item: gearItem }: { item: GearSummary }) {
  return (
    <>
      {gearItem.type.typeName}
      {gearItem.restricted && (
        <>
          <br />
          <strong className="text-warning">RESTRICTED</strong>
        </>
      )}
    </>
  );
}

function LocationCell({ item: gearItem }: { item: GearSummary }) {
  return gearItem.location.shorthand;
}

const ColoredCell = styled.div<{ color?: string }>`
  width: 100%;
  height: 100%;
  border-left: solid 0.5rem;
  ${(props) =>
    props.color != null ? `border-left-color: ${props.color};` : ""};
`;
