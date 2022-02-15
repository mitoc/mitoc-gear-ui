import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";

import Form from "react-bootstrap/Form";
import { debounce } from "lodash";
import styled from "styled-components";

import { peopleClient, PersonSummary } from "apiClient/people";
import { DataGrid } from "components/DataGrid";
import { TablePagination } from "components/TablePagination";

type TablePerson = Omit<PersonSummary, "firstName" | "lastName"> & {
  name: string;
};

export function PeoplePage() {
  const [people, setPeople] = useState<PersonSummary[] | null>(null);
  const [page, setPage] = useState<number>(1);
  const [nbPage, setNbPage] = useState<number>(1);
  const [query, setQuery] = useState<string>("");

  const fetch = useMemo(
    () =>
      debounce(
        (q: string, page?: number) =>
          peopleClient.getPersonList(q, page).then((data) => {
            setPeople(data.results);
            setNbPage(Math.ceil(data.count / 50));
          }),
        300
      ),
    [setPeople]
  );

  useEffect(() => {
    fetch(query.trim(), page);
  }, [query, page, fetch]);

  if (people == null) {
    return null;
  }

  const peopleData = people.map(({ firstName, lastName, ...other }) => ({
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

      <DataGrid columns={myColumns} data={peopleData} rowWrapper={LinkRow} />
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
  const href = `/people/${id}`;
  return <Link to={href}>{children}</Link>;
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
