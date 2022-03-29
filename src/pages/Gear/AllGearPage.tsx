import { useState } from "react";
import styled from "styled-components";

import { GearSummary } from "apiClient/gear";
import { DataGrid } from "components/DataGrid";
import { TablePagination } from "components/TablePagination";
import { TextField } from "components/Inputs/TextField";
import { GearLink } from "components/GearLink";
import { useGearList } from "features/cache";

import { GearStatus } from "./GearStatus";

export function AllGearPage() {
  const [page, setPage] = useState<number>(1);
  const [query, setQuery] = useState<string>("");

  const { gearList, nbPages } = useGearList(query, page);

  const myColumns = [
    { key: "id", header: "Serial Number", renderer: IDCell, className: "" },
    { key: "type.typeName", header: "Type" },
    { key: "description", header: "Description", renderer: DescriptionCell },
    { key: "status", header: "Status", renderer: StatusCell },
  ];

  return (
    <>
      <TextField
        value={query}
        onChange={(newQuery) => {
          setPage(1);
          setQuery(newQuery);
        }}
        placeholder="Search"
        debounceTime={300}
      />

      {nbPages != null && (
        <TablePagination setPage={setPage} page={page} nbPage={nbPages} />
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
