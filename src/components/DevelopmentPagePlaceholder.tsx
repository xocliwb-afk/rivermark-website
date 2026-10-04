import { Container } from "./Container";
import styles from "./DevelopmentPagePlaceholder.module.css";
import { Section } from "./Section";

type DevelopmentPagePlaceholderProps = Readonly<{
  title: string;
  description: string;
  statusLabel?: string;
}>;

export function DevelopmentPagePlaceholder({
  title,
  description,
  statusLabel,
}: DevelopmentPagePlaceholderProps) {
  return (
    <Section className={styles.placeholder} labelledBy="development-page-title">
      <Container width="reading">
        <p className={styles.eyebrow}>Local development</p>
        <h1 id="development-page-title">{title}</h1>
        {statusLabel ? (
          <p className={styles.status}>{statusLabel}</p>
        ) : null}
        <p className={styles.description}>{description}</p>
      </Container>
    </Section>
  );
}
