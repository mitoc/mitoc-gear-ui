import { useState } from "react";
import styled from "styled-components";

import { useGearList } from "features/cache";
import { TablePagination } from "components/TablePagination";
import { GearSummary } from "apiClient/gear";
import { GearLink } from "components/GearLink";
import { TextField } from "components/Inputs/TextField";
import { fmtAmount } from "lib/fmtNumber";

type Props = {
  onAddGear: (item: GearSummary) => void;
  gearToCheckout: GearSummary[];
};

export function MoreGear({ onAddGear, gearToCheckout }: Props) {
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  const { gearList, nbPages } = useGearList(query, page);

  return (
    <div className="border rounded-2 p-2 bg-light">
      <div className="d-flex justify-content-between">
        <h3>More gear</h3>
        {nbPages != null && nbPages > 1 && (
          <TablePagination setPage={setPage} page={page} nbPage={nbPages} />
        )}
      </div>
      <label className="form-group w-100 mb-2 d-flex flex-row align-items-center">
        <TextField
          value={query}
          onChange={(newQuery) => {
            setPage(1);
            setQuery(newQuery);
          }}
          placeholder="Search"
          debounceTime={300}
          className="w-50"
        />
      </label>

      {gearList && (
        <Table className="table">
          <thead>
            <tr>
              <th>Add</th>
              <th>Name</th>
              <th>Description</th>
              <th>Deposit</th>
              <th>Fee</th>
            </tr>
          </thead>
          <tbody>
            {gearList
              .filter((item) => !gearToCheckout.some((g) => g.id === item.id))
              .map((gearItem) => {
                const {
                  id,
                  type,
                  depositAmount,
                  dailyFee,
                  restricted,
                  specification,
                  available,
                  checkedOutTo,
                  missing,
                  broken,
                  retired,
                } = gearItem;
                return (
                  <tr key={id}>
                    <td className="text-center">
                      {available ? (
                        <AddButton
                          className="btn btn-outline-primary w-100 h-100"
                          onClick={() => onAddGear(gearItem)}
                        >
                          Add
                        </AddButton>
                      ) : (
                        <strong className="text-danger">
                          {checkedOutTo
                            ? "Checked out"
                            : missing
                            ? "Missing"
                            : broken
                            ? "Broken"
                            : retired
                            ? "Retired"
                            : ""}
                        </strong>
                      )}
                    </td>
                    <td className="mw-40">
                      {type.typeName} (<GearLink id={id}>{id}</GearLink>)
                    </td>
                    <td>
                      <>
                        {restricted && (
                          <>
                            RESTRICTED
                            <br />
                          </>
                        )}
                        {specification}
                      </>
                    </td>
                    <td>{fmtAmount(depositAmount)}</td>
                    <td>{fmtAmount(dailyFee)}</td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      )}
    </div>
  );
}

const AddButton = styled.button`
  min-width: 100px;
  min-height: 50px;
`;

const Table = styled.table`
  td,
  th {
    vertical-align: middle;
  }
`;
