import { compact, map } from "lodash";
import { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import { GearSummary } from "apiClient/gear";
import { DataGrid } from "components/DataGrid";
import { TablePagination } from "components/TablePagination";
import { SearchTextField } from "components/Inputs/TextField";
import { GearLink } from "components/GearLink";
import { useGearList } from "redux/api";
import { useSetPageTitle } from "hooks";

import { GearStatus } from "../GearStatus";
import { GearFilters, Filters } from "./GearFilters";

export function AllGearPage() {
  useSetPageTitle("Gear");
  const [page, setPage] = useState<number>(1);
  const [query, setQuery] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [filters, setFilters] = useState<Filters>({});
  const { gearTypes } = filters;

  const { gearList, nbPages } = useGearList({
    q: query,
    page,
    gearTypes: map(gearTypes, "id"),
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
            <Link to="/add-person">
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
  return <GearLink id={gearItem.id}>{children}</GearLink>;
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

const ColoredCell = styled.div<{ color?: string }>`
  width: 100%;
  height: 100%;
  border-left: solid 0.5rem;
  ${(props) =>
    props.color != null ? `border-left-color: ${props.color};` : ""};
`;
