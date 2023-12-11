import { isEmpty, max } from "lodash";
import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { PersonSummary } from "apiClient/people";
import { DataGrid } from "components/DataGrid";
import { SearchTextField } from "components/Inputs/TextField";
import { PersonLink } from "components/PersonLink";
import { TablePagination } from "components/TablePagination";
import { useSetPageTitle } from "hooks";
import { usePeopleList } from "redux/api";

import { PeopleFilters } from "./PeopleFilters";
import { usePeopleFilters } from "./usePeopleFilters";

type TablePerson = Omit<PersonSummary, "firstName" | "lastName"> & {
  name: string;
};

export function PeoplePage() {
  useSetPageTitle("People");
  const [page, setPage] = useState<number>(1);
  const { filters, setFilters } = usePeopleFilters();
  const [showFilters, setShowFilters] = useState<boolean>(!isEmpty(filters));
  const { openRentals, groups, q } = filters;
  const query = q ?? "";
  const { personList, nbPages } = usePeopleList({
    q: query,
    page,
    openRentals,
    groups,
  });
  const setQuery = (q: string) => setFilters((filters) => ({ ...filters, q }));

  const peopleData = personList?.map(({ firstName, lastName, ...other }) => ({
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

      {nbPages != null && (
        <div className="row">
          <div className="col-md-auto">
            <TablePagination setPage={setPage} page={page} nbPage={nbPages} />
          </div>
          <div className="col-md d-flex flex-grow-1 justify-content-between">
            <button
              className="btn btn-outline-primary mb-3 ms-md-3"
              onClick={() => setShowFilters((v) => !v)}
            >
              ▽ Filters
            </button>
            <div>
              <Link to="/add-person">
                <button className="btn btn-outline-primary mb-3 me-3">
                  ＋ Add person
                </button>
              </Link>
              {personList && (
                <CopyButton
                  className="btn btn-outline-secondary mb-3"
                  getText={() => personList!.map((p) => p.email).join(", ")}
                  tooltip={`Copied ${personList.length} emails to clipboard`}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {showFilters && (
        <PeopleFilters filters={filters} setFilters={setFilters} />
      )}

      {peopleData && (
        <DataGrid columns={myColumns} data={peopleData} rowWrapper={LinkRow} />
      )}
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
  return (
    <PersonLink className="link-row" id={id}>
      {children}
    </PersonLink>
  );
}

function RentalCell({ item: person }: { item: TablePerson }) {
  const oldestRental = max(person.rentals.map((r) => r.weeksOut));
  return (
    <>
      <List className="d-none d-md-block">
        {person.rentals.map(({ id, type, weeksOut }) => (
          <li key={id}>
            {id} — {type.typeName} ({weeksOut} week{weeksOut > 1 ? "s" : ""})
          </li>
        ))}
      </List>
      {!isEmpty(person.rentals) && (
        <span className="d-md-none">
          {person.rentals.length} rental{person.rentals.length > 1 ? "s" : ""}
          <br />
          {oldestRental} week{oldestRental! > 1 ? "s" : ""}
        </span>
      )}
    </>
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

function CopyButton({
  getText,
  className,
  tooltip,
}: {
  getText: () => string;
  className?: string;
  tooltip: string;
}) {
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  return (
    <TooltipButton
      className={className}
      onClick={() => {
        navigator.clipboard.writeText(getText());
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 2000);
      }}
      type="button"
    >
      {showTooltip && <span className="tooltip-text">{tooltip}</span>}
      Export emails
    </TooltipButton>
  );
}

const TooltipButton = styled.button`
  position: relative;

  & .tooltip-text {
    width: 140px;
    background-color: var(--bs-btn-hover-bg);
    color: var(--bs-btn-hover-color);
    text-align: center;
    border-radius: 6px;
    padding: 5px;
    position: absolute;
    z-index: 1;
    bottom: 150%;
    left: 50%;
    margin-left: -75px;
  }
`;
