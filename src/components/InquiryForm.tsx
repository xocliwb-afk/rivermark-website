"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { siteRoutes } from "@/config/routes";
import { publicContact } from "@/config/publication";
import { businessEmail, contactTopicFromFragment, inquiryDefinitions, inquiryEndpoint, inquiryGroupsFor, propertyHelpTopic, sensitiveInformationNotice, type InquiryType } from "@/config/inquiries";
import { initialInquiryValues, inquiryPayload, validateInquiry, type InquiryResult } from "@/lib/inquiry-validation";
import styles from "./InquiryForm.module.css";

export function InquiryForm({ type }: Readonly<{ type: InquiryType }>) {
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const locked = useRef(false);
  const [values, setValues] = useState(() => initialInquiryValues(type));
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<InquiryResult | null>(null);
  const [submittedType, setSubmittedType] = useState<InquiryType>(type);
  const isContact = type !== "new-construction-interest";
  const routeType = isContact && values.topic === propertyHelpTopic ? "manual-review" : type;
  const content = inquiryDefinitions[routeType];
  const groups = inquiryGroupsFor(type, values.topic);
  const fields = groups.flatMap(group => group.fields);
  const errors = result?.status === "validation_error" ? result.errors : {};

  useEffect(() => {
    if (result) summaryRef.current?.focus();
  }, [result]);

  useEffect(() => {
    if (!isContact) return;
    // Apply entry intentions only on navigation, never on a render or topic edit.
    const applyFragment = (fragment: string) => {
      const topic = contactTopicFromFragment(fragment);
      if (!topic || locked.current) return;
      setValues(current => current.topic === topic ? current : { ...current, topic });
      setResult(null);
    };
    const navigate = () => applyFragment(window.location.hash);
    const initial = window.requestAnimationFrame(navigate);
    const followContactLink = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      const url = new URL(anchor.href, window.location.href);
      // Next Link may update history without firing hashchange, including the same hash.
      if (url.origin === window.location.origin && url.pathname === window.location.pathname) applyFragment(url.hash);
    };
    window.addEventListener("hashchange", navigate);
    window.addEventListener("popstate", navigate);
    window.addEventListener("pageshow", navigate);
    document.addEventListener("click", followContactLink);
    return () => {
      window.cancelAnimationFrame(initial);
      window.removeEventListener("hashchange", navigate);
      window.removeEventListener("popstate", navigate);
      window.removeEventListener("pageshow", navigate);
      document.removeEventListener("click", followContactLink);
    };
  }, [isContact]);

  function editField(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const control = event.currentTarget;
    const value = control instanceof HTMLInputElement && control.type === "checkbox" ? (control.checked ? "yes" : "") : control.value;
    setValues(current => ({ ...current, [control.name]: value }));
    if (control.name === "topic" || control.name === "preferredResponse") setResult(null);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (locked.current || !formRef.current) return;
    const data = new FormData(formRef.current);
    const payload = inquiryPayload(type, values, String(data.get("website") ?? ""));
    const checked = validateInquiry(payload);
    if (!checked.inquiry) { setResult({ status: "validation_error", errors: checked.errors }); return; }
    locked.current = true;
    setPending(true);
    setResult(null);
    setSubmittedType(checked.inquiry.type);
    try {
      const response = await fetch(inquiryEndpoint, {
        method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin", cache: "no-store", body: JSON.stringify(payload),
      });
      const next: InquiryResult = await response.json();
      if (response.ok && next.status === "success") {
        setValues(initialInquiryValues(type));
        formRef.current?.reset();
        setResult(next);
      } else if (next.status === "validation_error" && next.errors && typeof next.errors === "object") setResult(next);
      else if (next.status === "rate_limited") setResult(next);
      else setResult({ status: "delivery_error" });
    } catch { setResult({ status: "delivery_error" }); }
    finally { locked.current = false; setPending(false); }
  }

  const success = result?.status === "success";
  return <div className={styles.inquiry}>
    <p id={`${type}-boundary`} className={isContact ? styles.hint : styles.notice}>{content.boundary}</p>
    <p id={`${type}-required`} className={styles.instructions}>Fields marked Required must be completed. Other fields are optional.</p>
    <form ref={formRef} className={styles.form} aria-describedby={`${type}-boundary ${type}-required ${!success ? `${type}-sensitive` : ""}`.trim()} aria-busy={pending} data-rm-inquiry={type} method="post" action={inquiryEndpoint} noValidate onSubmit={submit}>
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor={`${type}-website`}>Leave this field empty</label>
        <input id={`${type}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" maxLength={200} />
      </div>
      <div ref={summaryRef} tabIndex={-1} className={styles.status} role={result && !success ? "alert" : "status"} aria-live={result && !success ? "assertive" : "polite"} aria-atomic="true" hidden={!result}>
        {success && <p>{inquiryDefinitions[submittedType].success}</p>}
        {result?.status === "validation_error" && <><p>Please correct the following before sending:</p><ul>{Object.entries(errors).map(([name, message]) => {
          const field = fields.find(candidate => candidate.name === name);
          return <li key={name}>{field ? <a href={`#${type}-${name}`} onClick={event => { event.preventDefault(); document.getElementById(`${type}-${name}`)?.focus(); }}>{field.summaryLabel ?? field.label}: {message}</a> : message}</li>;
        })}</ul></>}
        {result?.status === "delivery_error" && <p>We couldn&apos;t send your request right now. Please try again or <a href={`mailto:${businessEmail}`}>email Rivermark directly</a>{publicContact.phone?.approved && <> or <a href={publicContact.phone.href}>call {publicContact.phone.display}</a></>}. Your entries remain below.</p>}
        {result?.status === "rate_limited" && <p>Too many requests have been made in a short time. Please wait {Math.max(1, Math.ceil((result.retryAfter || 900) / 60))} minute(s), then try again, or <a href={`mailto:${businessEmail}`}>email Rivermark directly</a>{publicContact.phone?.approved && <> or <a href={publicContact.phone.href}>call {publicContact.phone.display}</a></>}. Your entries remain below.</p>}
      </div>
      {!success && <>
        {groups.map(group => <fieldset key={group.legend} className={styles.group} disabled={pending}>
          <legend>{group.legend}</legend>
          <div className={styles.fields}>{group.fields.map(field => {
            const id = `${type}-${field.name}`;
            const required = field.required || (field.name === "phone" && values.preferredResponse === "Phone");
            const description = [field.hint ? `${id}-hint` : "", errors[field.name] ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined;
            const attrs = { id, name: field.name, required, "aria-invalid": Boolean(errors[field.name]), "aria-describedby": description, onChange: editField };
            const value = values[field.name] ?? field.defaultValue ?? (field.required ? "" : field.options?.[0] ?? "");
            return <div key={field.name} className={`${styles.field} ${field.kind === "textarea" || field.kind === "checkbox" || field.name === "topic" ? styles.full : ""}`}>
              <label htmlFor={id}><span>{field.label}</span><span className={styles.requirement}>{required ? "Required" : "Optional"}</span></label>
              {field.kind === "select" ? <select {...attrs} value={value}>{field.required && !field.defaultValue && <option value="" disabled>Choose an option</option>}{field.options?.map(option => <option key={option} value={option}>{option}</option>)}</select>
                : field.kind === "textarea" ? <textarea {...attrs} value={value} maxLength={field.maxLength} rows={5} />
                : field.kind === "checkbox" ? <input {...attrs} type="checkbox" checked={value === "yes"} value="yes" />
                : <input {...attrs} value={value} type={field.kind ?? "text"} maxLength={field.maxLength} min={field.min} max={field.max} step={field.kind === "number" ? 1 : undefined} inputMode={field.kind === "number" ? "numeric" : undefined} autoComplete={field.autoComplete ?? "off"} />}
              {field.hint && <p id={`${id}-hint`} className={styles.hint}>{field.hint}</p>}
              {errors[field.name] && <p id={`${id}-error`} className={styles.error}>{errors[field.name]}</p>}
            </div>;
          })}</div>
        </fieldset>)}
        <aside className={styles.boundary} id={`${type}-sensitive`}><h3>Keep sensitive information out of this form</h3><p>{sensitiveInformationNotice}</p></aside>
        <p className={styles.hint}>Your request goes to Rivermark&apos;s business email through Google Workspace. No appointment is created. <Link href={siteRoutes.privacy}>Privacy information</Link></p>
        <div className={styles.submitArea}><button type="submit" className={styles.button} disabled={pending}>{pending ? "Sending…" : content.submitLabel}</button><p role="status" aria-live="polite">{pending ? "Sending your request. Please wait." : ""}</p></div>
        <noscript><p>JavaScript is needed to send this form. Please email <a href={`mailto:${businessEmail}`}>{businessEmail}</a> instead.</p></noscript>
      </>}
    </form>
  </div>;
}
