import Link from "next/link";
import { resourceLinkHref } from "./ResourceInline";

import styles from "./ServiceComparisonTable.module.css";

export type ServiceComparisonColumn = Readonly<{
  label: string;
}>;

export type ServiceComparisonRow = Readonly<{
  label: string;
  values: readonly (string | Readonly<{ label: string; destination: string }>)[];
}>;

type ServiceComparisonTableProps = Readonly<{
  caption: string;
  firstColumnLabel: string;
  columns: readonly ServiceComparisonColumn[];
  rows: readonly ServiceComparisonRow[];
}>;

export function ServiceComparisonTable({
  caption,
  firstColumnLabel,
  columns,
  rows,
}: ServiceComparisonTableProps) {
  return (
    <table className={styles.table}>
      <caption>{caption}</caption>
      <thead>
        <tr>
          <th scope="col">{firstColumnLabel}</th>
          {columns.map((column) => (
            <th scope="col" key={column.label}>
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.label}>
            <th data-label={firstColumnLabel} scope="row">
              {row.label}
            </th>
            {row.values.map((value, index) => (
              <td
                data-label={columns[index]?.label}
                key={`${columns[index]?.label}-${index}`}
              >
                {typeof value === "string" ? value : <ServiceLink {...value} />}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ServiceLink({ label, destination }: Readonly<{ label: string; destination: string }>) {
  const href = resourceLinkHref(destination);
  return href ? <Link className={styles.serviceLink} href={href}>{label}</Link> : label;
}
