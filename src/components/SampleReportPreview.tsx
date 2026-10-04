import Image from "next/image";
import styles from "./EditorialPage.module.css";

export function SampleReportPreview() {
  return <figure className={styles.samplePreview}>
    <Image src="/reports/rivermark-residential-sample-page.png" width={745} height={1053}
      alt="Sample roof page: an obscured area remains unknown, while a separate deteriorated penetration seal calls for further evaluation. A fictional diagram supports the limitation." />
    <figcaption>A page from the 19-page fictional Residential sample. The PDF shows the report structure, three example findings and inspection limitations. No real property was inspected for this sample; illustrations replace property photographs, and unanswered systems do not imply an inspection.</figcaption>
  </figure>;
}
