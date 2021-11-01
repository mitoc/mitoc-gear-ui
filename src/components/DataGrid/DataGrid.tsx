import React from "react";
import styled from "styled-components";
import { isPlainObject, isArray } from "lodash";

interface Item {
  [key: string]: any;
}

type Column<T extends Item> = {
  key: string;
  header: string;
  renderer?: React.ComponentType<{ item: T }>;
};

type Props<T extends Item> = {
  columns: Column<T>[];
  data: T[];
  rowWrapper?: React.ComponentType<{ item: T; children: React.ReactNode }>;
};

export function DataGrid<T extends Item>(props: Props<T>) {
  const colCount = props.columns.length;
  const rowCount = props.data.length + 1;

  return (
    <DataGridWrapper
      role="grid"
      colCount={colCount}
      aria-rowcount={rowCount}
      aria-colcount={colCount}
    >
      <div role="row" aria-rowindex={1}>
        {props.columns.map((col, idx) => (
          <div
            key={col.key}
            role="columnheader"
            aria-colindex={idx + 1}
            className="p-2 d-flex align-items-center"
          >
            {col.header}
          </div>
        ))}
      </div>
      {props.data.map((item, rowIdx) => (
        <Row
          columns={props.columns}
          idx={rowIdx}
          item={item}
          rowWrapper={props.rowWrapper}
        />
      ))}
    </DataGridWrapper>
  );
}

function Row<T>({
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
      {columns.map((col, colIdx) => (
        <div
          className="p-2 d-flex align-items-center"
          role="gridcell"
          aria-colindex={1 + colIdx}
        >
          {renderValue(col, item)}
        </div>
      ))}
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
    const Renderer = col.renderer;
    return <Renderer item={item} />;
  }
  const value = item[col.key];
  if (isPlainObject(value) || isArray(value)) {
    return JSON.stringify(value);
  }
  return value;
}

const DataGridWrapper = styled.div<{ colCount: number }>`
  display: grid;
  border-left: 1px solid #ddd;
  border-top: 1px solid #ddd;

  [role="row"] {
    display: grid;
    grid-template-columns: repeat(${({ colCount }) => colCount}, 1fr);
    min-height: 50px;
  }

  [role="columnheader"] {
    font-weight: 700;
    background-color: #f9f9f9;
    border-bottom: 1px solid #ddd;
    border-right: 1px solid #ddd;
  }

  [role="gridcell"] {
    border-bottom: 1px solid #ddd;
    border-right: 1px solid #ddd;
  }

  a {
    color: unset;
    text-decoration: none;
  }

  a:hover {
    background-color: #f5f5f5;
  }
`;
