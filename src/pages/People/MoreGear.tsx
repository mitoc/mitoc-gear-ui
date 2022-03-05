import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { useGearList } from "hooks/useGearList";
import { TablePagination } from "components/TablePagination";

type Props = {};

export function MoreGear() {
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  const { gearList, nbPage } = useGearList({ query, page });

  return (
    <div className="border rounded-2 p-2 bg-light">
      <div className="d-flex justify-content-between">
        <h3>More gear</h3>
        {nbPage > 1 && (
          <TablePagination setPage={setPage} page={page} nbPage={nbPage} />
        )}
      </div>
      <label className="form-group w-100 mb-2 d-flex flex-row align-items-center">
        <span className="me-2">Search:</span>
        <input
          type="text"
          className="form-control w-50"
          value={query}
          onChange={(evt) => {
            setQuery(evt.target.value);
          }}
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
            {gearList.map(
              ({
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
              }) => (
                <tr>
                  <td className="text-center">
                    {available ? (
                      <AddButton className="btn btn-outline-primary w-100 h-100">
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
                    {type.typeName} (<Link to={`/gear/${id}`}>{id}</Link>)
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
                  <td>{depositAmount}</td>
                  <td>{dailyFee}</td>
                </tr>
              )
            )}
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
