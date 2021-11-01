import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";

import Form from "react-bootstrap/Form";
import Pagination from "react-bootstrap/Pagination";
import { debounce } from "lodash";
import styled from "styled-components";

import { peopleClient, PersonSummary } from "apiClient/people";
import { DataGrid } from "components/DataGrid";

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

function TablePagination({
  page,
  setPage,
  nbPage,
}: {
  page: number;
  setPage: (p: number) => void;
  nbPage: number;
}) {
  const goToPage = (p: number) => () => setPage(p);

  return (
    <Pagination>
      <Pagination.Prev disabled={page === 1} onClick={goToPage(page - 1)} />
      {page > 1 && <Pagination.Item onClick={goToPage(1)}>1</Pagination.Item>}
      {page - 2 > 1 && <Pagination.Ellipsis onClick={goToPage(page - 2)} />}
      {page - 1 > 1 && (
        <Pagination.Item onClick={goToPage(page - 1)}>
          {page - 1}
        </Pagination.Item>
      )}
      <Pagination.Item active>{page}</Pagination.Item>
      {page + 1 < nbPage && (
        <Pagination.Item onClick={goToPage(page + 1)}>
          {page + 1}
        </Pagination.Item>
      )}

      {page + 2 < nbPage && (
        <Pagination.Ellipsis onClick={goToPage(page + 2)} />
      )}

      {page < nbPage && (
        <Pagination.Item onClick={goToPage(nbPage)}>{nbPage}</Pagination.Item>
      )}
      <Pagination.Next
        disabled={page === nbPage}
        onClick={goToPage(page + 1)}
      />
    </Pagination>
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
