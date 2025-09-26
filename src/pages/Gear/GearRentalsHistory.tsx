import { useEffect, useState } from "react";

import { GearRental, getGearRentalHistory } from "src/apiClient/gear";
import { getPagesCount } from "src/apiClient/getPagesCount";
import { GearItemID } from "src/apiClient/idTypes";
import { PersonLink } from "src/components/PersonLink";
import { TablePagination } from "src/components/TablePagination";
import { formatDate } from "src/lib/fmtDate";

type Props = {
  gearId: GearItemID;
};

export function GearRentalsHistory({ gearId }: Props) {
  const [rentals, setRentals] = useState<GearRental[] | null>(null);
  const [nbPages, setNbPages] = useState<number>(0);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    getGearRentalHistory(gearId, page).then((rentalsList) => {
      setRentals(rentalsList.results);
      setNbPages(getPagesCount(rentalsList));
    });
  }, [gearId, page]);

  return (
    <div className="border rounded-2 p-2 bg-light">
      <div className="d-flex justify-content-between">
        <h3>Rental History</h3>
        {nbPages > 1 && (
          <TablePagination setPage={setPage} page={page} nbPage={nbPages} />
        )}
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Renter</th>
            <th className="d-none d-md-table-cell">Checked out</th>
            <th className="d-none d-md-table-cell">Returned</th>
            <th className="d-none d-md-table-cell">Weeks out</th>
            <th className="d-md-none">Rental</th>
          </tr>
        </thead>
        <tbody>
          {rentals &&
            rentals.map(({ person, checkedout, returned, weeksOut }) => (
              <tr key={person.id + checkedout}>
                <td>
                  <PersonLink id={person.id}>
                    {person.firstName} {person.lastName}
                  </PersonLink>
                </td>
                <td className="d-none d-md-table-cell">
                  {formatDate(checkedout)}
                </td>
                <td className="d-none d-md-table-cell">
                  {returned && formatDate(returned)}
                </td>
                <td className="d-none d-md-table-cell">{weeksOut}</td>
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
    </div>
  );
}
