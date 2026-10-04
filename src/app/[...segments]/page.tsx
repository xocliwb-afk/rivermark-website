import { notFound } from "next/navigation";

/** Every canonical route now has a concrete page. Unknown paths keep the shared 404. */
export default function UnknownRoutePage() {
  notFound();
}
