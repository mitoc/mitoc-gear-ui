import { useState } from "react";

import styled from "styled-components";

import { PersonSummary } from "apiClient/people";
import { DataGrid } from "components/DataGrid";
import { TablePagination } from "components/TablePagination";
import { TextField } from "components/Inputs/TextField";
import { PersonLink } from "components/PersonLink";
import { usePeopleList } from "features/api";

type TablePerson = Omit<PersonSummary, "firstName" | "lastName"> & {
  name: string;
};

export function PeoplePage() {
  const [page, setPage] = useState<number>(1);
  const [query, setQuery] = useState<string>("");
  const { personList, nbPages } = usePeopleList({ q: query, page });

  const peopleData = personList?.map(({ firstName, lastName, ...other }) => ({
    name: `${firstName} ${lastName}`,
    ...other,
  }));

  const myColumns = [
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "rentals", header: "Rentals", renderer: RentalCell },
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

      {peopleData && (
        <DataGrid columns={myColumns} data={peopleData} rowWrapper={LinkRow} />
      )}
    </>
  );
}

function LinkRow({
  item: person,
  children,
}: {
  item: TablePerson;
  children: React.ReactNode;
}) {
  const { id } = person;
  return <PersonLink id={id}>{children}</PersonLink>;
}

function RentalCell({ item: person }: { item: TablePerson }) {
  return (
    <List>
      {person.rentals.map(({ id, type }) => (
        <li key={id}>
          {id} — {type.typeName}
        </li>
      ))}
    </List>
  );
}

const List = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  height: 100%;

  li {
    line-height: unset;
  }
`;
