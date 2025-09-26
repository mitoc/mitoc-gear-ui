import { get, isArray, isPlainObject } from "lodash";
import React from "react";
import styled from "styled-components";

interface Item {
  id: string | number;
  [key: string]: any;
}

type Column<T extends Item> = {
  key: string;
  header: string;
  renderer?: (props: { item: T }) => React.ReactNode;
  className?: string;
  // TODO: hideOnMobile and width don't work well together
  hideOnMobile?: boolean;
  width?: number;
};

type Props<T extends Item> = {
  columns: Column<T>[];
  data: T[];
  rowWrapper?: React.ComponentType<{ item: T; children: React.ReactNode }>;
};

export function DataGrid<T extends Item>(props: Props<T>) {
  const colCount = props.columns.length;
  const rowCount = props.data.length + 1;

  const widths = props.columns.map((col) => col.width ?? 1);

  return (
    <DataGridWrapper
      role="grid"
      colCount={colCount}
      widths={widths}
      aria-rowcount={rowCount}
      aria-colcount={colCount}
    >
      <div role="row" aria-rowindex={1}>
        {props.columns.map((col, idx) => {
          const className = [
            "p-2 align-items-center",
            col.hideOnMobile ? "d-none d-md-flex" : "d-flex",
          ].join(" ");
          return (
            <div
              key={col.key}
              role="columnheader"
              aria-colindex={idx + 1}
              className={className}
              style={{ gridRow: 1 }}
            >
              {col.header}
            </div>
          );
        })}
      </div>
      {props.data.map((item, rowIdx) => (
        <Row
          key={item.id}
          columns={props.columns}
          idx={rowIdx}
          item={item}
          rowWrapper={props.rowWrapper}
        />
      ))}
    </DataGridWrapper>
  );
}

function Row<T extends Item>({
  columns,
  idx,
  item,
  rowWrapper,
}: {
  idx: number;
  item: T;
  columns: Props<T>["columns"];
  rowWrapper: Props<T>["rowWrapper"];
}) {
  const row = (
    <div role="row" aria-rowindex={1 + 1 + idx}>
      {columns.map((col, colIdx) => {
        const { className: overrideClassName } = col;
        const className =
          overrideClassName ??
          [
            "p-2 align-items-center",
            col.hideOnMobile ? "d-none d-md-flex" : "d-flex",
          ].join(" ");
        return (
          <div
            className={className}
            role="gridcell"
            aria-colindex={1 + colIdx}
            key={col.key}
            style={{ gridRow: 1 }}
          >
            <div>{renderValue(col, item)}</div>
          </div>
        );
      })}
    </div>
  );
  const Wrapper = rowWrapper;
  if (Wrapper == null) {
    return row;
  }
  return <Wrapper item={item}>{row}</Wrapper>;
}

function renderValue<T extends Item>(col: Column<T>, item: T) {
  if (col.renderer != null) {
    return col.renderer({ item });
  }
  const value = get(item, col.key);
  if (isPlainObject(value) || isArray(value)) {
    return JSON.stringify(value);
  }
  return value;
}

const DataGridWrapper = styled.div<{ colCount: number; widths: number[] }>`
  display: grid;
  border-left: 1px solid #ddd;
  border-top: 1px solid #ddd;

  [role="row"] {
    display: grid;
    grid-auto-columns: ${({ widths }) => widths.map((w) => `${w}fr`).join(" ")};
    min-height: 50px;
  }

  [role="columnheader"],
  [role="gridcell"] {
    overflow: hidden;
    border-bottom: 1px solid #ddd;
    border-right: 1px solid #ddd;
  }

  [role="columnheader"] {
    font-weight: 700;
    background-color: #f9f9f9;
  }

  [role="gridcell"] > div {
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    height: 100%;
  }

  > a {
    color: unset;
    text-decoration: none;
  }

  .link-row:hover {
    background-color: #f5f5f5;
  }
`;
