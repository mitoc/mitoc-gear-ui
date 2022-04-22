import { useEffect, useState } from "react";

import { formatDate } from "lib/fmtDate";
import { Rental, getPersonRentalHistory } from "apiClient/people";
import { TablePagination } from "components/TablePagination";
import { GearLink } from "components/GearLink";

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
        <table className="table">
          <thead>
            <tr>
              <th className="d-none d-md-table-cell">Serial N.</th>
              <th className="d-none d-md-table-cell">Type</th>
              <th className="d-none d-md-table-cell">Checked out</th>
              <th className="d-none d-md-table-cell">Returned</th>
              <th className="d-none d-md-table-cell">Weeks out</th>
              <th className="d-md-none">Gear</th>
              <th className="d-md-none">Rental</th>
            </tr>
          </thead>
          <tbody>
            {rentals.map(({ id, type, checkedout, returned, weeksOut }) => (
              <tr key={id + checkedout}>
                <td className="d-none d-md-table-cell">
                  <GearLink id={id}>{id}</GearLink>
                </td>
                <td className="d-none d-md-table-cell">{type.typeName}</td>
                <td className="d-none d-md-table-cell">
                  {formatDate(checkedout)}
                </td>
                <td className="d-none d-md-table-cell">
                  {returned && formatDate(returned)}
                </td>
                <td className="d-none d-md-table-cell">{weeksOut}</td>
                <td className="d-md-none">
                  <GearLink id={id}>{id}</GearLink>
                  <br />
                  {type.typeName}
                </td>
                <td className="d-md-none">
                  {!returned ? (
                    <span>{formatDate(checkedout)} → now (still out)</span>
                  ) : (
                    <span>
                      {formatDate(checkedout)} → {formatDate(returned)} (
                      {weeksOut} week{weeksOut > 1 ? "s" : ""})
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
