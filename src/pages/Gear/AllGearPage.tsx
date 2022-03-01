import { useEffect, useState, useMemo } from "react";
import { debounce } from "lodash";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { GearSummary, getGearList } from "apiClient/gear";
import { DataGrid } from "components/DataGrid";
import { TablePagination } from "components/TablePagination";
import { formatDate } from "lib/fmtDate";

import { GearStatus } from "./GearStatus";
import { iteratorSymbol } from "immer/dist/internal";

export function AllGearPage() {
  const [gearList, setGearList] = useState<GearSummary[] | null>(null);
  const [page, setPage] = useState<number>(1);
  const [nbPage, setNbPage] = useState<number>(1);
  const [query, setQuery] = useState<string>("");

  const fetch = useMemo(
    () =>
      debounce(
        (q: string, page?: number) =>
          getGearList(q, page).then((data) => {
            setGearList(data.results);
            setNbPage(Math.ceil(data.count / 50));
          }),
        300
      ),
    [setGearList]
  );

  useEffect(() => {
    fetch(query.trim(), page);
  }, [query, page, fetch]);

  if (gearList == null) {
    return null;
  }

  const myColumns = [
    { key: "id", header: "Serial Number", renderer: IDCell, className: "" },
    { key: "type.typeName", header: "Type" },
    { key: "description", header: "Description", renderer: DescriptionCell },
    { key: "status", header: "Status", renderer: StatusCell },
  ];

  return (
    <>
      <Form.Group className="mb-3 w-100">
        <Form.Control
          type="text"
          placeholder="Search"
          onChange={(data) => {
            setPage(1);
            setQuery(data.target.value);
          }}
        />
      </Form.Group>
      <TablePagination setPage={setPage} page={page} nbPage={nbPage} />

      <DataGrid columns={myColumns} data={gearList} rowWrapper={LinkRow} />
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
  const { id } = gearItem;
  const href = `/gear/${id}`;
  return <Link to={href}>{children}</Link>;
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
