import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { Link, useParams, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { collectionCenters, donationData, driveData, type Drive } from "@/data/mockData";
import { useApiResource } from "@/hooks/useApiResource";
import { donationSchema, type DonationFormValues } from "@/schemas/forms";
import { api, hasBackend } from "@/api/client";
import { closedLabel, isFull } from "@/pages/DrivesPages";
import paymentQr from "../imports/payment-qr.jpeg";
import { FormField as Field, Notice, PageHeader } from "@/components/PagePrimitives";

const dropOffCenter = collectionCenters[0];
const DONATION_TYPES = ["Money", "Food", "Clothing", "Education", "Medical", "Household"];

// Same idea as the Match page: a donation can only go to drives that request that kind of gift.
// Money can support any drive. Clothing has no drive category of its own, so it goes to household/emergency relief.
const norm = (value: unknown) => String(value ?? "").trim().toLowerCase();
function sameCategory(category: unknown, type: string) {
  const a = norm(category);
  const b = norm(type);
  return a === b || (a.length > 2 && b.length > 2 && (a.includes(b) || b.includes(a)));
}
function driveMatchesType(drive: Drive, type: string): boolean {
  if (!type) return false;
  if (type === "Money") return true;
  if (type === "Clothing") return sameCategory(drive.category, "Household") || sameCategory(drive.category, "Emergency") || Boolean(drive.urgent);
  return sameCategory(drive.category, type);
}

export function NewDonationPage() {
  const { data: drives } = useApiResource<Drive[]>("/drives", driveData);
  const [searchParams] = useSearchParams();
  const [success, setSuccess] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [submittedMoney, setSubmittedMoney] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [proof, setProof] = useState<File | null>(null);
  const [proofError, setProofError] = useState<string | null>(null);
  const { register, handleSubmit, setValue, getValues, watch, formState: { errors, isSubmitting } } = useForm<DonationFormValues>({
    resolver: zodResolver(donationSchema),
    defaultValues: { driveId: "", type: "", quantity: 1, details: "", contactNumber: "" },
  });

  // The donation type comes first: everything else stays locked until one is chosen
  const type = watch("type");
  const isMoney = type === "Money";
  const locked = !type;

  // Only drives that match the chosen donation type can be selected
  const eligibleDrives = useMemo(() => drives.filter((drive) => driveMatchesType(drive, type)), [drives, type]);

  // Preselect the drive passed from "Donate" buttons (?drive=<id or title>), picking its type first
  const requestedDrive = searchParams.get("drive");
  useEffect(() => {
    if (!requestedDrive) return;
    const requested = drives.find((drive) => drive.id === requestedDrive || drive.title === requestedDrive);
    if (!requested || isFull(requested)) return;
    if (!getValues("type")) {
      const typeMatch = DONATION_TYPES.find((option) => option !== "Money" && sameCategory(requested.category, option));
      if (typeMatch) setValue("type", typeMatch);
      return;
    }
    if (!getValues("driveId") && eligibleDrives.some((drive) => drive.id === requested.id)) setValue("driveId", requested.id);
  }, [requestedDrive, drives, eligibleDrives, type, getValues, setValue]);

  function onProofChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setProofError(null);
    if (file && !["image/jpeg", "image/png", "image/webp", "application/pdf"].includes(file.type)) {
      setProof(null);
      event.target.value = "";
      setProofError("Upload a JPG, PNG, WebP, or PDF file");
      return;
    }
    if (file && file.size > 10 * 1024 * 1024) {
      setProof(null);
      event.target.value = "";
      setProofError("File must be 10 MB or smaller");
      return;
    }
    setProof(file);
  }

  async function onSubmit(values: DonationFormValues) {
    setSubmitError(null);
    const chosen = drives.find((drive) => drive.id === values.driveId);
    if (chosen && !driveMatchesType(chosen, values.type)) {
      setSubmitError(`This drive doesn't accept ${values.type.toLowerCase()} donations. Please choose a matching drive.`);
      return;
    }
    if (chosen && isFull(chosen)) {
      setSubmitError("This drive is no longer accepting donations. Please choose another drive.");
      return;
    }
    if (isMoney && !proof) {
      setProofError("Upload proof of your payment (screenshot or receipt)");
      return;
    }
    const payload = {
      ...values,
      // Items are always handed over at the drop-off center (money is paid by QR)
      method: "dropoff",
      details: values.details.trim() || (isMoney ? "Monetary donation via QR payment" : values.details),
    };
    try {
      if (hasBackend) {
        let response;
        if (isMoney && proof) {
          const body = new FormData();
          Object.entries(payload).forEach(([key, value]) => body.append(key, String(value)));
          body.append("proof", proof);
          response = await api.post("/donations", body, { headers: { "Content-Type": "multipart/form-data" } });
        } else {
          response = await api.post("/donations", payload);
        }
        setReference(response.data?.code ?? response.data?.donation?.code ?? response.data?.id ?? null);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
      setSubmittedMoney(isMoney);
      setSuccess(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to submit donation");
    }
  }

  if (success) return <main className="mx-auto max-w-xl px-5 py-24 text-center"><div className="mx-auto grid size-20 place-items-center rounded-full bg-[#F2C94C] text-3xl">✓</div><h1 className="mt-6 text-4xl font-bold">Donation submitted</h1><p className="mt-3 text-[#6B7C8F]">{reference ? <>Your record <span className="font-mono font-bold">{reference}</span> is pending review.</> : "Your donation is pending review."}{submittedMoney ? " We will verify your proof of payment before approving it." : " Its receiving QR code will activate after approval."}</p><Link to="/donations" className="mt-8 inline-block rounded-full bg-[#34418E] px-6 py-3 font-bold text-white">View my donations</Link></main>;

  return (
    <>
      <PageHeader eyebrow="New record" title="Make a donation" description="Provide accurate details so the organization can verify, schedule, and document your gift." />
      <main className="mx-auto max-w-3xl px-5 py-12 lg:px-8">
        {submitError && <Notice tone="error">{submitError}</Notice>}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-6 bg-white p-6 shadow-sm sm:p-10">
          <Field label="1. What are you donating?" error={errors.type?.message}><select {...register("type", { onChange: (event) => { const current = getValues("driveId"); if (current && !drives.some((drive) => drive.id === current && driveMatchesType(drive, event.target.value))) setValue("driveId", ""); } })} className="field"><option value="">Select donation type</option>{DONATION_TYPES.map((option) => <option key={option}>{option}</option>)}</select></Field>
          {locked && <p className="text-sm text-[#6B7C8F]">Choose a donation type to continue.</p>}

          <fieldset disabled={locked} className={`m-0 min-w-0 space-y-6 border-0 p-0 transition-opacity ${locked ? "opacity-50" : ""}`}>
            <Field label="2. Donation drive" error={errors.driveId?.message}><select {...register("driveId")} className="field"><option value="">{eligibleDrives.length ? "Select a drive" : "No open drives accept this type"}</option>{eligibleDrives.map((drive) => <option key={drive.id} value={drive.id} disabled={isFull(drive)}>{drive.title}{isFull(drive) ? ` (${closedLabel(drive)})` : ""}</option>)}</select>{type && <span className="mt-1 block text-xs text-[#6B7C8F]">{isMoney ? "Money can support any drive." : `Showing drives that need ${type.toLowerCase()} donations.`}</span>}</Field>
            <Field label={isMoney ? "Amount (₱)" : "Quantity"} error={errors.quantity?.message}><input {...register("quantity", { valueAsNumber: true })} type="number" min="1" className="field" /></Field>

            {isMoney ? (
              <div className="space-y-5 border-l-4 border-[#F2C94C] bg-[#F5F4EF] p-5 sm:p-6">
                <div className="text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#B88910]">Scan to donate</p>
                  <img src={paymentQr} alt="Payment QR code" className="mx-auto mt-3 size-56 bg-white p-2 shadow-sm" />
                  <p className="mx-auto mt-3 max-w-sm text-sm text-[#6B7C8F]">Scan with GCash, Maya, or your banking app and send the amount above. Then upload your receipt below so we can verify it.</p>
                </div>
                <Field label="Proof of donation" error={proofError ?? undefined}>
                  <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" onChange={onProofChange} className="field" />
                  <span className="mt-1 block text-xs text-[#6B7C8F]">{proof ? proof.name : "Screenshot or receipt · JPG, PNG or PDF · up to 10 MB"}</span>
                </Field>
              </div>
            ) : (
              <div className="space-y-2 border-l-4 border-[#F2C94C] bg-[#F5F4EF] p-5">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#B88910]">Drop-off center</p>
                <p className="text-lg font-bold">{dropOffCenter.name}</p>
                <p className="text-sm"><strong>Address:</strong> {dropOffCenter.address}</p>
                <p className="text-sm"><strong>Open:</strong> {dropOffCenter.hours}</p>
                <p className="text-xs text-[#6B7C8F]">Bring your items here after submitting. Accepts {dropOffCenter.accepts.toLowerCase()}.</p>
              </div>
            )}

            <Field label={isMoney ? "Reference number or note (optional)" : "Donation details"} error={errors.details?.message}><textarea {...register("details")} rows={isMoney ? 2 : 4} className="field" placeholder={isMoney ? "e.g. GCash reference number" : "Describe the items, condition, sizes, or amount"} /></Field>
            <Field label="Contact number" error={errors.contactNumber?.message}><input {...register("contactNumber")} className="field" placeholder="+639171234567" /></Field>
            <button disabled={isSubmitting || locked} className="w-full rounded-full bg-[#F2C94C] px-6 py-4 font-bold disabled:opacity-60">{isSubmitting ? "Submitting…" : isMoney ? "Submit donation with proof" : "Submit donation for review"}</button>
          </fieldset>
        </form>
      </main>
    </>
  );
}

export function MyDonationsPage() {
  const { data, error } = useApiResource<typeof donationData>("/donations", donationData);
  const [removedIds, setRemovedIds] = useState<string[]>([]);
  const items = data.filter((item) => !removedIds.includes(item.id));
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  // Close the dialog with Escape
  useEffect(() => {
    if (!deleteId) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setDeleteId(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [deleteId]);
  async function removeDonation() {
    if (!deleteId) return;
    try {
      if (hasBackend) await api.delete(`/donations/${deleteId}`);
      setRemovedIds((current) => [...current, deleteId]);
      setMessage("Donation record deleted successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to delete donation.");
    }
    setDeleteId(null);
  }
  return (
    <>
      <PageHeader eyebrow="Donor account" title="My donations" description="Review approval, drop-off, receiving, and documentation status." action={<Link to="/donations/new" className="rounded-full bg-[#F2C94C] px-5 py-3 font-bold">New donation</Link>} />
      <main className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
        {error && <Notice>{error}</Notice>}
        {message && <Notice tone="success">{message}</Notice>}
        {items.length === 0 ? <div className="mt-6 border border-dashed p-12 text-center"><h2 className="text-xl font-bold">No donation records</h2><p className="mt-2 text-[#6B7C8F]">Your submitted donations will appear here.</p></div> : (
          <div className="mt-6 overflow-x-auto bg-white">
            <table className="w-full min-w-3xl text-left text-sm"><thead className="bg-[#ECEEF7] text-xs uppercase"><tr>{["Reference", "Drive", "Method", "Status", "Date", "Actions"].map((heading) => <th key={heading} className="px-5 py-4">{heading}</th>)}</tr></thead><tbody>{items.map((item) => <tr key={item.id} className="border-t border-[#34418E]/10"><td className="px-5 py-4 font-mono font-bold">{item.id}</td><td className="px-5 py-4">{item.drive}</td><td className="px-5 py-4">{item.method}</td><td className="px-5 py-4"><span className="bg-[#FFF3C4] px-2 py-1 font-semibold">{item.status}</span></td><td className="px-5 py-4">{item.date}</td><td className="px-5 py-4"><Link to={`/donations/${item.id}`} className="font-bold">Track</Link>{item.status === "Pending" && <button onClick={() => setDeleteId(item.id)} className="ml-4 text-red-700">Delete</button>}</td></tr>)}</tbody></table>
          </div>
        )}
      </main>
      {deleteId && <div className="fixed inset-0 z-50 grid place-items-center bg-[#1D2758]/60 p-5" onMouseDown={(event) => event.target === event.currentTarget && setDeleteId(null)}><div role="dialog" aria-modal="true" aria-labelledby="delete-title" className="max-w-sm bg-white p-7"><h2 id="delete-title" className="text-xl font-bold">Delete donation?</h2><p className="mt-3 text-sm text-[#6B7C8F]">This pending record will be permanently removed.</p><div className="mt-6 flex gap-3"><button onClick={() => setDeleteId(null)} className="flex-1 border px-4 py-3 font-bold">Cancel</button><button onClick={removeDonation} className="flex-1 bg-red-700 px-4 py-3 font-bold text-white">Delete</button></div></div></div>}
    </>
  );
}

type TrackedDonation = (typeof donationData)[number] & { statusHistory?: { status: string; changedAt: string }[] };

export function DonationTrackingPage() {
  const { donationId } = useParams();
  const { data: donation, loading } = useApiResource<TrackedDonation | null>(`/donations/${donationId}`, null);
  if (loading) return <main className="mx-auto max-w-3xl px-5 py-24 text-center">Loading…</main>;
  if (!donation) return <main className="mx-auto max-w-3xl px-5 py-24 text-center"><h1 className="text-4xl font-bold">Donation not found</h1><Link to="/donations" className="mt-6 inline-block text-[#B88910]">Return to donations</Link></main>;
  // The admin moves a donation through these steps. Money is paid by QR, so it has no drop-off step.
  const steps = donation.type === "Money" ? ["Submitted", "Approved", "Received"] : ["Submitted", "Approved", "Dropped off", "Received"];
  const rejected = donation.status === "Rejected";
  const active = rejected ? 0 : Math.max(steps.indexOf(donation.status === "Pending" ? "Submitted" : donation.status), 0);
  const when = (step: string) => {
    const entry = donation.statusHistory?.find((item) => item.status === (step === "Submitted" ? "Pending" : step));
    return entry ? new Date(entry.changedAt).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" }) : null;
  };
  return (
    <>
      <PageHeader eyebrow={donation.id} title="Donation tracking" description={donation.drive} />
      <main className="mx-auto max-w-4xl px-5 py-12 lg:px-8">
        <div className="bg-white p-7 sm:p-10">
          {rejected && <Notice tone="error">This donation was rejected by the administrator.</Notice>}
          {steps.map((step, index) => <div key={step} className="flex gap-5 pb-8 last:pb-0"><span className={`grid size-9 shrink-0 place-items-center rounded-full font-bold ${index <= active ? "bg-[#34418E] text-white" : "bg-[#ECEEF7]"}`}>{index + 1}</span><div><h2 className="font-bold">{step}</h2><p className="mt-1 text-sm text-[#6B7C8F]">{index <= active ? `Completed${when(step) ? ` · ${when(step)}` : ""}` : "Waiting for the previous step"}</p></div></div>)}
        </div>
      </main>
    </>
  );
}
