import { useState } from "react";

import styled from "styled-components";
import { Link } from "react-router-dom";

import { PersonSummary } from "apiClient/people";
import { DataGrid } from "components/DataGrid";
import { TablePagination } from "components/TablePagination";
import { SearchTextField } from "components/Inputs/TextField";
import { PersonLink } from "components/PersonLink";
import { Checkbox } from "components/Inputs/Checkbox";
import { usePeopleList } from "features/api";

type TablePerson = Omit<PersonSummary, "firstName" | "lastName"> & {
  name: string;
};

export function PeoplePage() {
  const [page, setPage] = useState<number>(1);
  const [query, setQuery] = useState<string>("");
  const [openRentals, setOpenRentals] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const { personList, nbPages } = usePeopleList({
    q: query,
    page,
    openRentals,
  });

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
      <SearchTextField
        value={query}
        onChange={(newQuery) => {
          setPage(1);
          setQuery(newQuery);
        }}
        placeholder="Search"
        debounceTime={300}
        className="mb-3"
      />

      {nbPages != null && (
        <div className="d-flex justify-content-between">
          <div className="d-flex flew-row">
            <TablePagination setPage={setPage} page={page} nbPage={nbPages} />
            <button
              className="btn btn-outline-primary mb-3 ms-3"
              onClick={() => setShowFilters((v) => !v)}
            >
              ▽ Filters
            </button>
          </div>
          <Link to="/add-person">
            <button className="btn btn-outline-primary mb-3">
              ＋ Add person
            </button>
          </Link>
        </div>
      )}

      {showFilters && (
        <div className="form-switch mb-3">
          <Checkbox
            value={openRentals}
            className="me-3"
            onChange={() => setOpenRentals((v) => !v)}
          />
          Open Rentals only
        </div>
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
      {person.rentals.map(({ id, type, weeksOut }) => (
        <li key={id}>
          {id} — {type.typeName} ({weeksOut} weeks)
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
