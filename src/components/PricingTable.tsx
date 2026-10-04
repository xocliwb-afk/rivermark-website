import { introductoryPriceLabel, showIntroductoryPricing } from "@/config/publication";
import styles from "./PricingTable.module.css";

export type PricingTableColumn = Readonly<{
  label: string;
  numeric?: boolean;
}>;

export type PricingTableRow = Readonly<{
  label: string;
  values: readonly string[];
}>;

function PricingValue({ value, measured }: Readonly<{ value: string; measured: boolean }>) {
  if (!measured) {
    return value;
  }

  const monetaryValue = value.match(/([+]?\$\d+)/);

  if (!monetaryValue || monetaryValue.index === undefined) {
    return value;
  }

  const start = monetaryValue.index;
  const end = start + monetaryValue[0].length;

  return (
    <>
      {value.slice(0, start)}
      <span className={styles.numeric}>{monetaryValue[0]}</span>
      {value.slice(end)}
    </>
  );
}

type PricingTableProps = Readonly<{
  caption: string;
  firstColumnLabel: string;
  columns: readonly PricingTableColumn[];
  rows: readonly PricingTableRow[];
  className?: string;
  testId?: string;
}>;

export function PricingTable({
  caption,
  firstColumnLabel,
  columns,
  rows,
  className,
  testId,
}: PricingTableProps) {
  const visibleColumns = columns.map((column, index) => ({ ...column, index }))
    .filter(column => !/introductory/i.test(column.label) || showIntroductoryPricing())
    .map(column => ({ ...column, label: /introductory/i.test(column.label) ? introductoryPriceLabel(column.label) : column.label }));
  const classes = [styles.table, className].filter(Boolean).join(" ");

  return (
    <table className={classes} data-pricing-table={testId}>
      <caption>{caption}</caption>
      <thead>
        <tr>
          <th scope="col">{firstColumnLabel}</th>
          {visibleColumns.map((column) => (
            <th scope="col" key={column.label}>
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.label}>
            <th scope="row">{row.label}</th>
            {visibleColumns.map((column) => (
              <td
                data-label={column.label}
                key={column.label}
              >
                <PricingValue
                  measured={column.numeric === true}
                  value={row.values[column.index]}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
