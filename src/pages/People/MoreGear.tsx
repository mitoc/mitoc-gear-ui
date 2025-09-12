import { useState } from "react";
import styled from "styled-components";

import { GearLink } from "components/GearLink";
import { SearchTextField } from "components/Inputs/TextField";
import { TablePagination } from "components/TablePagination";
import { fmtAmount } from "lib/fmtNumber";
import { useGearList } from "redux/api";

import { usePersonPageContext } from "./PeoplePage/PersonPageContext";

export function MoreGear() {
  const { checkoutBasket, isApproved } = usePersonPageContext();
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  const { gearList, nbPages } = useGearList({ q: query, page, retired: false });

  return (
    <StyledDiv className="border rounded-2 p-2 bg-light">
      <div className="d-flex justify-content-between">
        <h3 className="mb-4">Rent gear</h3>
        {query && nbPages != null && nbPages > 1 && (
          <TablePagination setPage={setPage} page={page} nbPage={nbPages} />
        )}
      </div>
      <label className="w-100 mb-2 d-flex flex-row align-items-center">
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
      </label>

      {gearList && query && (
        <Table className="table">
          <thead>
            <tr>
              <th>Add</th>
              <th>Gear</th>
              <th className="d-none d-md-table-cell">Description</th>
              <th className="d-none d-md-table-cell">Deposit</th>
              <th className="d-none d-md-table-cell">Fee</th>
            </tr>
          </thead>
          <tbody>
            {gearList
              .filter(
                (item) => !checkoutBasket.items.some((g) => g.id === item.id),
              )
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
                          onClick={() => checkoutBasket.add(gearItem)}
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
                      <GearLink id={id}>{id}</GearLink>
                      <br />
                      <span>{type.typeName}</span>
                      {restricted && (
                        <>
                          <br />
                          {!isApproved(id, type.id) ? (
                            <strong className="text-warning">RESTRICTED</strong>
                          ) : (
                            <strong className="text-success">
                              ☑ Approved
                            </strong>
                          )}
                        </>
                      )}
                    </td>
                    <td className="d-none d-md-table-cell">
                      <>{specification}</>
                    </td>
                    <td className="d-none d-md-table-cell">
                      {fmtAmount(depositAmount)}
                    </td>
                    <td className="d-none d-md-table-cell">
                      {fmtAmount(dailyFee)}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      )}
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  input {
    width: 250px;
    max-width: 100%;
  }
`;

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
