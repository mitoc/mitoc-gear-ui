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

export default function PeoplePage() {
  const [people, setPeople] = useState<PersonSummary[] | null>(null);
  const [page, setPage] = useState<number>(1);
  const [nbPage, setNbPage] = useState<number>(1);
  const [query, setQuery] = useState<string>("");

  const fetch = useMemo(
    () =>
      debounce(
        (q: string, page?: number) =>
          peopleClient.getPersonList(q, page).then((data) => {
            console.log(data);
            setPeople(data.results);
            setNbPage(Math.ceil(data.count / 50));
          }),
        300
      ),
    [setPeople]
  );

  useEffect(() => {
    fetch(query.trim(), page);
  }, [query, page]);

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
            setPage(0);
            setQuery(data.target.value);
          }}
        />
      </Form.Group>
      <Pagination>
        <Pagination.Prev onClick={() => setPage((p) => p - 1)} />
        <Pagination.Item onClick={() => setPage(1)}>1</Pagination.Item>
        <Pagination.Ellipsis />
        <Pagination.Item active>{page}</Pagination.Item>
        <Pagination.Ellipsis />
        <Pagination.Item onClick={() => setPage((p) => nbPage)}>
          {nbPage}
        </Pagination.Item>
        <Pagination.Next onClick={() => setPage((p) => p + 1)} />
      </Pagination>

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
