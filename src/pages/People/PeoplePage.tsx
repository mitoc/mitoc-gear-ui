import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import DataGrid, { Row, RowRendererProps } from "react-data-grid";
import Form from "react-bootstrap/Form";
import Pagination from "react-bootstrap/Pagination";
import { debounce } from "lodash";

import { peopleClient, PersonSummary } from "apiClient/people";

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

  const columns = [
    { key: "name", name: "Name" },
    { key: "email", name: "Email" },
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

      <DataGrid
        columns={columns}
        rows={peopleData}
        rowRenderer={LinkRow}
        className="fill-grid"
        enableVirtualization={false}
        rowHeight={50}
        style={{ height: 50 * (people.length + 1) + 2 }}
      />
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

function LinkRow(props: RowRendererProps<TablePerson>) {
  const { row } = props;
  const { id } = row;
  const href = `/people/${id}`;
  return (
    <Link to={href}>
      <Row {...props} />
    </Link>
  );
}
