import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";

import { formatDate } from "lib/fmtDate";
import { Rental, getPersonRentalHistory } from "apiClient/people";
import { TablePagination } from "components/TablePagination";

type Props = {
  personId: string;
};

export function PersonRentalsHistory({ personId }: Props) {
  const [rentals, setRentals] = useState<Rental[] | null>(null);
  const [nbPages, setNbPages] = useState<number>(0);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    getPersonRentalHistory(personId, page).then((rentalsList) => {
      setRentals(rentalsList.results);
      setNbPages(Math.ceil(rentalsList.count / 50));
    });
  }, [personId, page]);

  return (
    <div className="border rounded-2 p-2 bg-light">
      <div className="d-flex justify-content-between">
        <h3>Rental History</h3>
        {nbPages > 1 && (
          <TablePagination setPage={setPage} page={page} nbPage={nbPages} />
        )}
      </div>

      {rentals && (
        <Table>
          <thead>
            <tr>
              <th>Serial N.</th>
              <th>Type</th>
              <th>Checked out</th>
              <th>Returned</th>
              <th>Weeks out</th>
            </tr>
          </thead>
          <tbody>
            {rentals.map(({ id, type, checkedout, returned, weeksOut }) => (
              <tr key={id + checkedout}>
                <td>
                  <Link to={`/gear/${id}`}>{id}</Link>
                </td>
                <td>{type.typeName}</td>
                <td>{formatDate(checkedout)}</td>
                <td>{returned && formatDate(returned)}</td>
                <td>{weeksOut}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
