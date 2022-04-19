import { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import { GearSummary } from "apiClient/gear";
import { DataGrid } from "components/DataGrid";
import { TablePagination } from "components/TablePagination";
import { SearchTextField } from "components/Inputs/TextField";
import { GearLink } from "components/GearLink";
import { useGearList } from "features/api";
import { useSetPageTitle } from "hooks";

import { GearStatus } from "./GearStatus";

export function AllGearPage() {
  useSetPageTitle("Gear");
  const [page, setPage] = useState<number>(1);
  const [query, setQuery] = useState<string>("");

  const { gearList, nbPages } = useGearList({ q: query, page });

  const myColumns = [
    { key: "id", header: "Serial Number", renderer: IDCell, className: "" },
    { key: "type.typeName", header: "Type" },
    { key: "description", header: "Description", renderer: DescriptionCell },
    { key: "status", header: "Status", renderer: StatusCell },
  ];

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
        <div className="d-flex justify-content-between">
          <TablePagination setPage={setPage} page={page} nbPage={nbPages} />
          <Link to="/add-gear">
            <button className="btn btn-outline-primary mb-3">
              ＋ Add new gear
            </button>
          </Link>
        </div>
      )}

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
      {gearItem.restricted && (
        <>
          RESTRICTED
          <br />
        </>
      )}
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
  return <GearStatus gearItem={gearItem} />;
}

const ColoredCell = styled.div<{ color?: string }>`
  width: 100%;
  height: 100%;
  border-left: solid 0.5rem;
  ${(props) =>
    props.color != null ? `border-left-color: ${props.color};` : ""};
`;
