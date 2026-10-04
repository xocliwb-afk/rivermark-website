import { introductoryPriceLabel, showIntroductoryPricing } from "@/config/publication";
import styles from "./PricePair.module.css";

export type PriceValue = Readonly<{
  label: string;
  amount: string;
  allowance?: string;
}>;

type PricePairProps = Readonly<{
  introductory: PriceValue;
  standard: PriceValue;
  className?: string;
}>;

export function PricePair({
  introductory,
  standard,
  className,
}: PricePairProps) {
  const classes = [styles.pair, className].filter(Boolean).join(" ");

  return (
    <dl className={classes}>
      {[standard, ...(showIntroductoryPricing() ? [{ ...introductory, label: introductoryPriceLabel(introductory.label) }] : [])].map((price) => (
        <div className={styles.price} key={price.label}>
          <dt className={styles.label}>{price.label}</dt>
          <dd className={styles.value}>
            <span className={styles.amount}>{price.amount}</span>
            {price.allowance ? (
              <span className={styles.allowance}>{price.allowance}</span>
            ) : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}
